"""
Monitoring and observability setup for AI Unplugged Flask API
- Prometheus metrics
- OpenTelemetry tracing
- Logging enhancements
"""

import logging
import time
import os
from functools import wraps
from flask import Flask, request, Response
from prometheus_client import Counter, Histogram, Info, generate_latest, CONTENT_TYPE_LATEST
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor

# Prometheus metrics
REQUEST_COUNT = Counter(
    'app_request_count', 
    'Application Request Count',
    ['method', 'endpoint', 'http_status']
)
REQUEST_LATENCY = Histogram(
    'app_request_latency_seconds', 
    'Application Request Latency',
    ['method', 'endpoint']
)
ERROR_COUNT = Counter(
    'app_error_count',
    'Application Error Count',
    ['method', 'endpoint', 'error_type']
)
APP_INFO = Info('app_info', 'Application Information')

# Create logger
logger = logging.getLogger(__name__)

def init_monitoring(app: Flask):
    """Initialize all monitoring for the Flask app"""
    init_prometheus_metrics(app)
    init_opentelemetry(app)
    init_request_logging(app)
    log_app_startup(app)

def init_prometheus_metrics(app: Flask):
    """Initialize Prometheus metrics endpoint for the app"""
    # Set up app info
    APP_INFO.info({
        'app_name': 'ai_unplugged_api',
        'version': os.getenv('APP_VERSION', 'dev'),
        'environment': os.getenv('ENVIRONMENT', 'development')
    })
    
    # Add metrics endpoint
    @app.route('/metrics', methods=['GET'])
    def metrics():
        return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)
    
    # Add before_request and after_request hooks for metrics
    @app.before_request
    def before_request():
        request.start_time = time.time()
    
    @app.after_request
    def after_request(response):
        if hasattr(request, 'start_time'):
            request_latency = time.time() - request.start_time
            REQUEST_LATENCY.labels(
                method=request.method,
                endpoint=request.path
            ).observe(request_latency)
            
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.path,
            http_status=response.status_code
        ).inc()
        
        return response
    
    # Add error handler for metrics
    @app.errorhandler(Exception)
    def handle_exception(e):
        ERROR_COUNT.labels(
            method=request.method,
            endpoint=request.path,
            error_type=type(e).__name__
        ).inc()
        
        # Let the default error handlers take care of the response
        raise e

def init_opentelemetry(app: Flask):
    """Initialize OpenTelemetry tracing"""
    # Only initialize if OTLP_ENDPOINT is set
    if not os.getenv('OTLP_ENDPOINT'):
        logger.info("Skipping OpenTelemetry setup: OTLP_ENDPOINT not set")
        return
    
    # Set up trace provider
    trace.set_tracer_provider(TracerProvider())
    tracer = trace.get_tracer(__name__)
    
    # Set up exporter
    otlp_exporter = OTLPSpanExporter(
        endpoint=os.getenv('OTLP_ENDPOINT')
    )
    span_processor = BatchSpanProcessor(otlp_exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)
    
    # Instrument Flask
    FlaskInstrumentor().instrument_app(app)
    
    # Instrument requests library for outgoing HTTP calls
    RequestsInstrumentor().instrument()
    
    logger.info(f"OpenTelemetry tracing initialized with endpoint {os.getenv('OTLP_ENDPOINT')}")

def init_request_logging(app: Flask):
    """Set up request logging for all API calls"""
    @app.before_request
    def log_request():
        # Skip logging for metrics endpoint to reduce noise
        if request.path == '/metrics':
            return
        
        logger.info(f"Request: {request.method} {request.path} - IP: {request.remote_addr}")
        if request.is_json:
            # Truncate long request bodies
            body = str(request.get_json())
            if len(body) > 1000:
                body = body[:1000] + "... [truncated]"
            logger.debug(f"Request body: {body}")

def log_app_startup(app: Flask):
    """Log application startup information"""
    # Add this information when the app starts up
    @app.before_first_request
    def log_startup_info():
        logger.info("====== Application Started ======")
        logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
        logger.info(f"Debug mode: {app.debug}")
        logger.info(f"App version: {os.getenv('APP_VERSION', 'dev')}")
        
        # Log registered routes
        routes = []
        for rule in app.url_map.iter_rules():
            routes.append(f"{rule.endpoint}: {','.join(rule.methods)} {rule.rule}")
        
        logger.info(f"Registered routes: {len(routes)}")
        for route in routes:
            logger.debug(f"Route: {route}")

def route_monitor(f):
    """Decorator to monitor performance of specific routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        start_time = time.time()
        
        # Create a custom span for the route
        tracer = trace.get_tracer(__name__)
        with tracer.start_as_current_span(f.__name__) as span:
            # Add custom attributes to the span
            span.set_attribute("route.name", f.__name__)
            
            try:
                result = f(*args, **kwargs)
                span.set_attribute("route.success", True)
                return result
            except Exception as e:
                span.set_attribute("route.success", False)
                span.set_attribute("route.error", str(e))
                span.set_attribute("route.error_type", type(e).__name__)
                raise
            finally:
                execution_time = time.time() - start_time
                logger.info(f"Route {f.__name__} executed in {execution_time:.4f} seconds")
                
    return decorated_function 