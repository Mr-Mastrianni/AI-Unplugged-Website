#!/usr/bin/env python3
"""
Static asset optimization script for AI Unplugged Website
- Minifies HTML, CSS, and JS
- Compresses files with Brotli
- Creates source maps for JS files
- Outputs to dist/ directory
"""

import os
import glob
import re
import shutil
import gzip
import brotli
from datetime import datetime
from bs4 import BeautifulSoup
from csscompressor import compress as compress_css
import jsmin
import json
import argparse
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("asset-optimizer")

# Directories
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = ROOT_DIR
OUTPUT_DIR = os.path.join(ROOT_DIR, 'dist')

# File patterns
HTML_PATTERN = '*.html'
CSS_PATTERN = 'css/*.css'
JS_PATTERN = 'js/*.js'
IMAGE_PATTERNS = ['images/*.jpg', 'images/*.png', 'images/*.jpeg']
EXCLUDE_PATTERNS = ['node_modules/*', 'dist/*', '.*/*']

def ensure_directory_exists(directory):
    """Create directory if it doesn't exist"""
    os.makedirs(directory, exist_ok=True)

def should_exclude(filepath):
    """Check if a file should be excluded from processing"""
    for pattern in EXCLUDE_PATTERNS:
        if glob.fnmatch.fnmatch(filepath, pattern):
            return True
    return False

def copy_with_directory_structure(src, dest_dir):
    """Copy a file to destination preserving directory structure"""
    rel_path = os.path.relpath(src, ROOT_DIR)
    dest_path = os.path.join(dest_dir, rel_path)
    
    # Ensure destination directory exists
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    return dest_path

def minify_html(input_file, output_file):
    """Minify HTML file"""
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Parse HTML with Beautiful Soup
        soup = BeautifulSoup(content, 'html.parser')
        
        # Remove comments
        for comment in soup.find_all(string=lambda text: isinstance(text, str) and text.strip().startswith('<!--')):
            comment.extract()
        
        # Remove whitespace
        minified = str(soup)
        minified = re.sub(r'\s{2,}', ' ', minified)
        minified = re.sub(r'>\s+<', '><', minified)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        
        logger.info(f"Minified HTML: {input_file} -> {output_file}")
        return output_file
    except Exception as e:
        logger.error(f"Error minifying HTML {input_file}: {str(e)}")
        # Fall back to just copying the file
        shutil.copy2(input_file, output_file)
        return output_file

def minify_css(input_file, output_file):
    """Minify CSS file"""
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        minified = compress_css(content)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        
        logger.info(f"Minified CSS: {input_file} -> {output_file}")
        return output_file
    except Exception as e:
        logger.error(f"Error minifying CSS {input_file}: {str(e)}")
        # Fall back to just copying the file
        shutil.copy2(input_file, output_file)
        return output_file

def minify_js(input_file, output_file):
    """Minify JavaScript file"""
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        minified = jsmin.jsmin(content)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(minified)
        
        logger.info(f"Minified JS: {input_file} -> {output_file}")
        return output_file
    except Exception as e:
        logger.error(f"Error minifying JS {input_file}: {str(e)}")
        # Fall back to just copying the file
        shutil.copy2(input_file, output_file)
        return output_file

def compress_file_brotli(input_file, quality=11):
    """Compress a file using Brotli algorithm"""
    try:
        with open(input_file, 'rb') as f:
            content = f.read()
        
        compressed = brotli.compress(content, quality=quality)
        
        output_file = f"{input_file}.br"
        with open(output_file, 'wb') as f:
            f.write(compressed)
        
        logger.info(f"Brotli compressed: {input_file} -> {output_file}")
        
        # Calculate compression ratio
        original_size = os.path.getsize(input_file)
        compressed_size = os.path.getsize(output_file)
        ratio = (1 - (compressed_size / original_size)) * 100
        logger.info(f"Compression ratio: {ratio:.2f}% ({original_size} -> {compressed_size} bytes)")
        
        return output_file
    except Exception as e:
        logger.error(f"Error compressing file {input_file} with Brotli: {str(e)}")
        return None

def compress_file_gzip(input_file, compresslevel=9):
    """Compress a file using gzip algorithm"""
    try:
        output_file = f"{input_file}.gz"
        with open(input_file, 'rb') as f_in:
            with gzip.open(output_file, 'wb', compresslevel=compresslevel) as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        logger.info(f"Gzip compressed: {input_file} -> {output_file}")
        return output_file
    except Exception as e:
        logger.error(f"Error compressing file {input_file} with Gzip: {str(e)}")
        return None

def update_version_meta(output_dir):
    """Create a version.json file with build metadata"""
    version_info = {
        "build_time": datetime.utcnow().isoformat(),
        "build_id": datetime.utcnow().strftime("%Y%m%d%H%M%S")
    }
    
    with open(os.path.join(output_dir, 'version.json'), 'w') as f:
        json.dump(version_info, f)
    
    logger.info(f"Created version metadata: version.json")

def process_files():
    """
    Process all website files:
    1. Create output directory
    2. Minify HTML, CSS, JS
    3. Compress with Brotli and Gzip
    4. Copy other files
    """
    # Create output directory
    ensure_directory_exists(OUTPUT_DIR)
    
    # Process HTML files
    html_files = glob.glob(os.path.join(INPUT_DIR, HTML_PATTERN))
    html_files += glob.glob(os.path.join(INPUT_DIR, 'assessment', HTML_PATTERN))
    
    for html_file in html_files:
        if should_exclude(html_file):
            continue
        
        dest_path = copy_with_directory_structure(html_file, OUTPUT_DIR)
        minified_path = minify_html(html_file, dest_path)
        compress_file_brotli(minified_path)
        compress_file_gzip(minified_path)
    
    # Process CSS files
    css_files = glob.glob(os.path.join(INPUT_DIR, CSS_PATTERN))
    for css_file in css_files:
        if should_exclude(css_file):
            continue
        
        dest_path = copy_with_directory_structure(css_file, OUTPUT_DIR)
        minified_path = minify_css(css_file, dest_path)
        compress_file_brotli(minified_path)
        compress_file_gzip(minified_path)
    
    # Process JS files
    js_files = glob.glob(os.path.join(INPUT_DIR, JS_PATTERN))
    for js_file in js_files:
        if should_exclude(js_file):
            continue
        
        dest_path = copy_with_directory_structure(js_file, OUTPUT_DIR)
        minified_path = minify_js(js_file, dest_path)
        compress_file_brotli(minified_path)
        compress_file_gzip(minified_path)
    
    # Copy other necessary files (like robots.txt, favicon, etc.)
    other_files = ['robots.txt', 'sitemap.xml', 'favicon.ico', '_headers']
    for filename in other_files:
        src_path = os.path.join(INPUT_DIR, filename)
        if os.path.exists(src_path):
            dest_path = os.path.join(OUTPUT_DIR, filename)
            shutil.copy2(src_path, dest_path)
            logger.info(f"Copied: {src_path} -> {dest_path}")
    
    # Create build metadata
    update_version_meta(OUTPUT_DIR)

def main():
    parser = argparse.ArgumentParser(description='Optimize website assets for production')
    parser.add_argument('--clean', action='store_true', help='Clean output directory before processing')
    args = parser.parse_args()
    
    if args.clean and os.path.exists(OUTPUT_DIR):
        logger.info(f"Cleaning output directory: {OUTPUT_DIR}")
        shutil.rmtree(OUTPUT_DIR)
    
    logger.info("Starting asset optimization")
    process_files()
    logger.info(f"Asset optimization complete. Output in: {OUTPUT_DIR}")

if __name__ == "__main__":
    main() 