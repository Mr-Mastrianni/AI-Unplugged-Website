#!/usr/bin/env python3
"""
Comprehensive deployment script for AI Unplugged Website
- Optimizes static assets (HTML, CSS, JS)
- Converts images to WebP
- Runs tests
- Deploys frontend to GitHub Pages
- Deploys backend to Railway
"""

import os
import sys
import subprocess
import logging
import argparse
import json
import time
from datetime import datetime
import shutil

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"deploy_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("deploy")

# Project directories
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(ROOT_DIR, 'dist')

def run_command(command, description, check=True, shell=False):
    """Run a shell command and log output"""
    logger.info(f"Running: {description}")
    logger.debug(f"Command: {command}")
    
    try:
        if shell:
            process = subprocess.run(command, shell=True, check=check, text=True, capture_output=True)
        else:
            process = subprocess.run(command, check=check, text=True, capture_output=True)
        
        if process.stdout:
            logger.debug(process.stdout)
        
        if process.returncode == 0:
            logger.info(f"Successfully completed: {description}")
        else:
            logger.error(f"Failed: {description}")
            logger.error(f"Error output: {process.stderr}")
            if check:
                sys.exit(1)
        
        return process
    except subprocess.CalledProcessError as e:
        logger.error(f"Error executing {description}: {str(e)}")
        logger.error(f"Error output: {e.stderr}")
        if check:
            sys.exit(1)
        return None
    except Exception as e:
        logger.error(f"Unexpected error during {description}: {str(e)}")
        if check:
            sys.exit(1)
        return None

def check_requirements():
    """Check if all required tools are installed"""
    tools = {
        "python": "Python is required for running the scripts",
        "pip": "pip is required for installing Python dependencies",
        "git": "Git is required for GitHub Pages deployment",
        "railway": "Railway CLI is required for backend deployment",
    }
    
    missing_tools = []
    
    for tool, description in tools.items():
        try:
            subprocess.run(["which", tool], check=True, capture_output=True)
        except subprocess.CalledProcessError:
            missing_tools.append(f"{tool}: {description}")
    
    if missing_tools:
        logger.error("Missing required tools:")
        for tool in missing_tools:
            logger.error(f"  - {tool}")
        logger.error("Please install the missing tools and try again.")
        sys.exit(1)

def install_dependencies():
    """Install or update Python dependencies"""
    logger.info("Installing/updating Python dependencies...")
    run_command(["pip", "install", "-r", "requirements.txt"], "Installing Python dependencies")

def run_tests():
    """Run test suite"""
    logger.info("Running tests...")
    result = run_command(["python", "run_tests.py"], "Running tests", check=False)
    if result and result.returncode != 0:
        logger.error("Tests failed! Aborting deployment.")
        sys.exit(1)

def optimize_assets(clean=True):
    """Run asset optimization scripts"""
    logger.info("Optimizing static assets...")
    
    # Create dist directory if it doesn't exist
    os.makedirs(DIST_DIR, exist_ok=True)
    
    # Run the asset optimization script
    clean_arg = "--clean" if clean else ""
    run_command(["python", "optimize_assets.py", clean_arg], "Optimizing HTML/CSS/JS assets")
    
    # Run the image conversion script
    run_command(["python", "convert_to_webp.py", clean_arg], "Converting images to WebP format")
    
    logger.info(f"Asset optimization complete. Output in: {DIST_DIR}")

def deploy_to_github_pages():
    """Deploy frontend to GitHub Pages"""
    logger.info("Deploying frontend to GitHub Pages...")
    
    # Check if the repository is git-initialized
    if not os.path.exists(os.path.join(ROOT_DIR, '.git')):
        logger.error("This directory is not a git repository. Run 'git init' first.")
        return False
    
    # Check if on a branch
    branch_result = run_command(["git", "rev-parse", "--abbrev-ref", "HEAD"], 
                               "Checking current branch", check=False)
    if branch_result and branch_result.stdout.strip() == "HEAD":
        logger.error("Not on a branch. Create and checkout a branch first.")
        return False
    
    # Create and configure gh-pages branch if it doesn't exist
    branch_exists = subprocess.run(["git", "rev-parse", "--verify", "gh-pages"], 
                                 capture_output=True, text=True).returncode == 0
                                 
    if not branch_exists:
        logger.info("Creating gh-pages branch...")
        run_command(["git", "checkout", "--orphan", "gh-pages"], "Creating gh-pages branch")
        run_command(["git", "rm", "-rf", "."], "Clearing working directory")
        run_command(["git", "commit", "--allow-empty", "-m", "Initial gh-pages commit"], 
                   "Creating empty commit")
        run_command(["git", "checkout", branch_result.stdout.strip()], "Switching back to original branch")
    
    # Option 1: Manual deployment - copy dist to gh-pages branch
    logger.info("Deploying to GitHub Pages manually...")
    
    # Save the current branch
    current_branch = branch_result.stdout.strip()
    
    # Create a temporary directory for the gh-pages content
    deploy_dir = os.path.join(ROOT_DIR, ".deploy_gh_pages")
    os.makedirs(deploy_dir, exist_ok=True)
    
    # Copy dist contents to the deploy directory
    run_command(["cp", "-a", f"{DIST_DIR}/.", deploy_dir], "Copying dist to deploy directory")
    
    # Add custom domain if needed
    custom_domain = os.getenv("CUSTOM_DOMAIN")
    if custom_domain:
        with open(os.path.join(deploy_dir, "CNAME"), "w") as f:
            f.write(custom_domain)
        logger.info(f"Added CNAME file for custom domain: {custom_domain}")
    
    # Checkout gh-pages branch
    run_command(["git", "checkout", "gh-pages"], "Checking out gh-pages branch")
    
    # Clear the working directory (except .git and the deploy directory)
    for item in os.listdir(ROOT_DIR):
        if item != ".git" and item != os.path.basename(deploy_dir):
            item_path = os.path.join(ROOT_DIR, item)
            if os.path.isdir(item_path):
                shutil.rmtree(item_path)
            else:
                os.remove(item_path)
    
    # Copy from deploy directory to root
    for item in os.listdir(deploy_dir):
        src = os.path.join(deploy_dir, item)
        dst = os.path.join(ROOT_DIR, item)
        if os.path.isdir(src):
            shutil.copytree(src, dst)
        else:
            shutil.copy2(src, dst)
    
    # Add all files
    run_command(["git", "add", "."], "Adding files to git")
    
    # Commit
    run_command(["git", "commit", "-m", f"Deploy to GitHub Pages - {datetime.now().isoformat()}"], 
               "Committing files", check=False)
    
    # Push to GitHub
    run_command(["git", "push", "origin", "gh-pages"], "Pushing to GitHub")
    
    # Checkout the original branch
    run_command(["git", "checkout", current_branch], "Switching back to original branch")
    
    # Clean up
    shutil.rmtree(deploy_dir)
    
    logger.info("GitHub Pages deployment complete!")
    logger.info("Your site will be available at https://<username>.github.io/<repository>")
    logger.info("If you've configured a custom domain, it will be available at your domain.")
    return True

def deploy_backend():
    """Deploy backend to Railway"""
    logger.info("Deploying backend to Railway...")
    
    # Check if Railway is configured
    if not os.path.exists('railway.json'):
        logger.error("Railway configuration not found. Run 'railway init' first.")
        return False
    
    # Deploy to Railway
    run_command(["railway", "up"], "Deploying to Railway")
    logger.info("Backend deployment complete!")
    return True

def generate_deployment_report():
    """Generate a deployment report"""
    report_file = os.path.join(ROOT_DIR, f"deployment_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt")
    
    with open(report_file, 'w') as f:
        f.write(f"AI Unplugged Website Deployment Report\n")
        f.write(f"=====================================\n")
        f.write(f"Deployment Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Environment: {os.getenv('ENVIRONMENT', 'production')}\n\n")
        
        # Add version information
        version_file = os.path.join(DIST_DIR, 'version.json')
        if os.path.exists(version_file):
            try:
                with open(version_file, 'r') as vf:
                    version_info = json.load(vf)
                f.write(f"Build ID: {version_info.get('build_id', 'unknown')}\n")
                f.write(f"Build Time: {version_info.get('build_time', 'unknown')}\n\n")
            except json.JSONDecodeError:
                f.write("Version information not available\n\n")
        
        # Add asset statistics
        f.write("Asset Statistics:\n")
        f.write("-----------------\n")
        
        html_files = len([f for f in os.listdir(DIST_DIR) if f.endswith('.html')])
        f.write(f"HTML Files: {html_files}\n")
        
        css_dir = os.path.join(DIST_DIR, 'css')
        css_files = len([f for f in os.listdir(css_dir)]) if os.path.exists(css_dir) else 0
        f.write(f"CSS Files: {css_files}\n")
        
        js_dir = os.path.join(DIST_DIR, 'js')
        js_files = len([f for f in os.listdir(js_dir)]) if os.path.exists(js_dir) else 0
        f.write(f"JS Files: {js_files}\n")
        
        images_dir = os.path.join(DIST_DIR, 'images')
        webp_images = len([f for f in os.listdir(images_dir) if f.endswith('.webp')]) if os.path.exists(images_dir) else 0
        f.write(f"WebP Images: {webp_images}\n\n")
        
        f.write("Deployment Status:\n")
        f.write("-----------------\n")
        f.write(f"Frontend: Deployed to GitHub Pages\n")
        f.write(f"Backend: Deployed to Railway\n\n")
        
        f.write("Next Steps:\n")
        f.write("-----------\n")
        f.write("1. Verify the website is working correctly at your GitHub Pages URL\n")
        f.write("2. Check all API endpoints are accessible\n")
        f.write("3. Review monitoring dashboard\n")
        f.write("4. Consider adding a custom domain in GitHub repository settings\n")
    
    logger.info(f"Deployment report generated: {report_file}")
    return report_file

def main():
    parser = argparse.ArgumentParser(description='Deploy AI Unplugged Website')
    parser.add_argument('--skip-optimize', action='store_true', help='Skip asset optimization')
    parser.add_argument('--skip-frontend', action='store_true', help='Skip frontend deployment')
    parser.add_argument('--skip-backend', action='store_true', help='Skip backend deployment')
    parser.add_argument('--skip-tests', action='store_true', help='Skip running tests')
    parser.add_argument('--custom-domain', help='Set custom domain for GitHub Pages')
    args = parser.parse_args()
    
    logger.info("Starting deployment process")
    start_time = time.time()
    
    # Set custom domain if provided
    if args.custom_domain:
        os.environ['CUSTOM_DOMAIN'] = args.custom_domain
    
    # Check requirements
    check_requirements()
    
    # Install dependencies
    install_dependencies()
    
    # Run tests (unless skipped)
    if not args.skip_tests:
        run_tests()
    else:
        logger.info("Skipping tests as requested")
    
    # Optimize assets (unless skipped)
    if not args.skip_optimize:
        optimize_assets()
    else:
        logger.info("Skipping asset optimization as requested")
    
    # Deploy frontend (unless skipped)
    if not args.skip_frontend:
        deploy_to_github_pages()
    else:
        logger.info("Skipping frontend deployment as requested")
    
    # Deploy backend (unless skipped)
    if not args.skip_backend:
        deploy_backend()
    else:
        logger.info("Skipping backend deployment as requested")
    
    # Generate deployment report
    report_file = generate_deployment_report()
    
    # Calculate and log total time
    total_time = time.time() - start_time
    logger.info(f"Deployment completed in {total_time:.2f} seconds")
    logger.info(f"Deployment report: {report_file}")

if __name__ == "__main__":
    main() 