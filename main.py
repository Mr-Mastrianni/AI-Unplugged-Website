import os
from flask import Flask, request, jsonify, redirect, url_for
from agency_swarm.tools import ToolFactory
from dotenv import load_dotenv
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
import json
from werkzeug.exceptions import BadRequest, Unauthorized
from flask_talisman import Talisman
from monitoring import init_monitoring, route_monitor

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()

app = Flask(__name__)

# Configure CORS - restrict to your frontend domain in production
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins != "*":
    allowed_origins = allowed_origins.split(",")
CORS(app, resources={r"/*": {"origins": allowed_origins}})

# Configure security headers and HTTPS
if os.getenv("SECURE_HEADERS", "False").lower() in ['true', '1', 't']:
    csp = {
        'default-src': ['\'self\''],
        'script-src': ['\'self\'', '\'unsafe-inline\'', 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
        'font-src': ['\'self\'', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'],
        'img-src': ['\'self\'', 'data:'],
        'frame-src': ['\'self\'']
    }
    
    # Only force HTTPS in production
    force_https = os.getenv("ENVIRONMENT") == "production"
    
    Talisman(app, 
             content_security_policy=csp,
             force_https=force_https,
             force_https_permanent=True,
             strict_transport_security=True,
             strict_transport_security_max_age=31536000,
             frame_options='DENY')
    
    logger.info("Secure headers and HTTPS enforcement enabled")

# Configure rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per day", "20 per hour"],
    storage_uri="memory://",
)

db_token = os.getenv("DB_TOKEN")
if not db_token:
    logger.error("DB_TOKEN environment variable not set!")

# Initialize monitoring
init_monitoring(app)

def create_endpoint(route, tool_class):
    @app.route(route, methods=['POST'], endpoint=tool_class.__name__)
    @limiter.limit("10 per minute") 
    @route_monitor
    def endpoint():
        logger.info(f"Endpoint {route} called from IP: {get_remote_address()}")
        
        # Authentication check
        try:
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                logger.warning(f"Missing Authorization header from {get_remote_address()}")
                return jsonify({"message": "Authorization header is required"}), 401
                
            token = auth_header.split("Bearer ")[1]
            if token != db_token:
                logger.warning(f"Invalid token from {get_remote_address()}")
                return jsonify({"message": "Unauthorized"}), 401
        except IndexError:
            logger.warning(f"Malformed Authorization header from {get_remote_address()}")
            return jsonify({"message": "Invalid Authorization format. Use 'Bearer TOKEN'"}), 401
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return jsonify({"message": "Authentication error"}), 401

        # Request validation
        try:
            if not request.is_json:
                logger.warning(f"Non-JSON payload received from {get_remote_address()}")
                return jsonify({"message": "Request must be JSON"}), 400
                
            data = request.get_json()
            tool = tool_class(**data)
            result = tool.run()
            logger.info(f"Successfully processed request for {route}")
            return jsonify({"response": result})
        except TypeError as e:
            logger.warning(f"Invalid request parameters: {str(e)}")
            return jsonify({"message": "Invalid parameters", "error": str(e)}), 400
        except ValueError as e:
            logger.warning(f"Validation error: {str(e)}")
            return jsonify({"message": "Validation error", "error": str(e)}), 422
        except Exception as e:
            logger.error(f"Error processing request: {str(e)}", exc_info=True)
            return jsonify({"message": "Internal server error"}), 500
        
def parse_all_tools():
    tools_folder = './tools'
    tools_dict = {}
    
    try:
        for root, dirs, files in os.walk(tools_folder):
            relative_path = os.path.relpath(root, tools_folder)
            folder = relative_path if relative_path != '.' else 'root'
            for filename in files:
                if filename.endswith('.py'):
                    tool_path = os.path.join(root, filename)
                    try:
                        tool_class = ToolFactory.from_file(tool_path)
                        tools_dict.setdefault(folder, []).append(tool_class)
                    except Exception as e:
                        logger.error(f"Error loading tool from {tool_path}: {str(e)}")
        return tools_dict
    except Exception as e:
        logger.error(f"Error parsing tools: {str(e)}")
        return {}

# create endpoints for each file in ./tools
tools = parse_all_tools()
tools = [tool for tool_list in tools.values() for tool in tool_list]
logger.info(f"Tools found: {len(tools)}")

for tool in tools:
    route = f"/{tool.__name__}"
    logger.info(f"Creating endpoint for {route}")
    create_endpoint(route, tool)

@app.route("/", methods=['POST'])
@limiter.limit("30 per minute")
@route_monitor
def tools_handler():
    logger.info(f"Root endpoint called from IP: {get_remote_address()}")
    
    # Authentication
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            logger.warning("Missing Authorization header")
            return jsonify({"message": "Authorization header is required"}), 401
            
        token = auth_header.split("Bearer ")[1]
        if token != db_token:
            logger.warning("Invalid token")
            return jsonify({"message": "Unauthorized"}), 401
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return jsonify({"message": "Authentication error"}), 401

    with app.request_context(request.environ):
        return app.full_dispatch_request()

# Health check endpoint
@app.route("/health", methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

# Error handlers
@app.errorhandler(404)
def not_found(e):
    logger.warning(f"404 error: {request.path}")
    return jsonify({"message": "Endpoint not found"}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    logger.warning(f"Method not allowed: {request.method} {request.path}")
    return jsonify({"message": "Method not allowed"}), 405

@app.errorhandler(500)
def server_error(e):
    logger.error(f"Internal server error: {str(e)}")
    return jsonify({"message": "Internal server error"}), 500

if __name__ == '__main__':
    debug_mode = os.getenv("DEBUG", "False").lower() in ['true', '1', 't']
    port = int(os.getenv("PORT", default=5000))
    
    # In production, never run with debug=True
    if os.getenv("ENVIRONMENT") == "production":
        debug_mode = False
        
    logger.info(f"Starting application on port {port} with debug={debug_mode}")
    app.run(debug=debug_mode, port=port, host='0.0.0.0')