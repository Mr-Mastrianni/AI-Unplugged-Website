# AI Unplugged Website

This is the official website for AI Unplugged, offering AI solutions, agents, and automations for small businesses.

## Deployment Instructions

The website is set up to deploy to GitHub Pages for the frontend and Railway for the backend API.

### Prerequisites

- Python 3.7 or later
- Git
- GitHub account
- Railway account (for backend API)

### Frontend Deployment (GitHub Pages)

#### Option 1: Automated Deployment with GitHub Actions

1. **Push your code to GitHub**: 
   ```
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Set source to "GitHub Actions"
   - Commit and push the included `.github/workflows/deploy.yml` file if not already present

3. **Custom Domain (Optional)**:
   - In your repository settings > Pages
   - Under "Custom domain", enter your domain name and save
   - Update DNS settings with your domain registrar as instructed by GitHub
   - Update `sitemap.xml` and `robots.txt` with your actual domain

#### Option 2: Manual Deployment

1. **Build the optimized site**:
   ```
   python optimize_assets.py --clean
   python convert_to_webp.py --clean
   ```

2. **Deploy with the deploy script**:
   ```
   python deploy.py
   ```
   
   For a custom domain:
   ```
   python deploy.py --custom-domain yourdomain.com
   ```

### Backend Deployment (Railway)

1. **Initialize Railway if not already done**:
   ```
   railway login
   railway init
   ```

2. **Deploy to Railway**:
   ```
   railway up
   ```
   
3. **Environment Variables**:
   Set these in your Railway project settings:
   - `DB_TOKEN` - Secure token for API authentication
   - `ENVIRONMENT` - Set to "production"
   - `ALLOWED_ORIGINS` - List of allowed origins (e.g., your GitHub Pages URL)
   - `SECURE_HEADERS` - Set to "true"
   - `YOUTUBE_API_KEY` - For YouTube analyzer tools

## Development

### Local Development

1. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

2. **Run the backend locally**:
   ```
   python main.py
   ```

3. **Test frontend locally**:
   Open any HTML file directly in your browser, or use a local server:
   ```
   python -m http.server
   ```

### Testing

Run the test suite:
```
python run_tests.py
```

## Website Structure

- **Frontend**: Static HTML, CSS, JS files
- **Backend**: Flask API for tools and services
- **Tools**: Python modules for various AI tools and services

## Security and Optimization

The deployment includes:
- Minified and compressed HTML, CSS, and JS files
- WebP image optimization with responsive sizes
- Proper caching headers
- HTTPS enforcement
- Security headers
- API rate limiting

## Monitoring

The backend API includes:
- Prometheus metrics at `/metrics` endpoint
- OpenTelemetry tracing support
- Comprehensive logging

## Troubleshooting

If you encounter any issues with the deployment, check:
1. Deployment logs in GitHub Actions
2. Railway logs for backend issues
3. The generated deployment reports in the project root

## License

[Your License Information Here]
