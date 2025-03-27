#!/usr/bin/env python3
"""
Image conversion script for AI Unplugged Website
- Converts JPG, PNG images to WebP format
- Creates responsive image versions
- Maintains original images for fallback
"""

import os
import glob
import logging
from PIL import Image
import argparse
import shutil
from concurrent.futures import ThreadPoolExecutor

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("image-optimizer")

# Directories
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(ROOT_DIR, 'images')
OUTPUT_DIR = os.path.join(ROOT_DIR, 'dist', 'images')

# Image patterns to convert
IMAGE_PATTERNS = ['*.jpg', '*.jpeg', '*.png']

# Quality setting for WebP (0-100)
WEBP_QUALITY = 85

# Sizes for responsive images (width in pixels)
RESPONSIVE_SIZES = {
    'small': 480,
    'medium': 800,
    'large': 1200,
    'xl': 1920
}

def ensure_directory_exists(directory):
    """Create directory if it doesn't exist"""
    os.makedirs(directory, exist_ok=True)

def get_all_images():
    """Get list of all images to process"""
    all_images = []
    for pattern in IMAGE_PATTERNS:
        pattern_path = os.path.join(IMAGES_DIR, pattern)
        all_images.extend(glob.glob(pattern_path))
    return all_images

def convert_to_webp(image_path, output_path=None, quality=WEBP_QUALITY, width=None):
    """Convert an image to WebP format with optional resizing"""
    try:
        if output_path is None:
            # Create output path with same name but .webp extension
            filename = os.path.basename(image_path)
            name, _ = os.path.splitext(filename)
            output_path = os.path.join(OUTPUT_DIR, f"{name}.webp")
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Open and convert the image
        with Image.open(image_path) as img:
            # Resize if width specified
            if width:
                # Calculate height to maintain aspect ratio
                aspect_ratio = img.height / img.width
                height = int(width * aspect_ratio)
                img = img.resize((width, height), Image.LANCZOS)
            
            # Convert and save as WebP
            img.save(output_path, 'WEBP', quality=quality)
        
        # Get file sizes
        original_size = os.path.getsize(image_path)
        webp_size = os.path.getsize(output_path)
        savings = (1 - (webp_size / original_size)) * 100
        
        logger.info(f"Converted: {image_path} -> {output_path}")
        logger.info(f"Size reduction: {original_size / 1024:.1f} KB -> {webp_size / 1024:.1f} KB ({savings:.1f}% smaller)")
        
        return output_path
    except Exception as e:
        logger.error(f"Error converting {image_path} to WebP: {str(e)}")
        return None

def process_image(image_path):
    """Process a single image: convert to WebP and create responsive versions"""
    try:
        # Copy original image to output dir for fallback support
        filename = os.path.basename(image_path)
        original_dest = os.path.join(OUTPUT_DIR, filename)
        os.makedirs(os.path.dirname(original_dest), exist_ok=True)
        shutil.copy2(image_path, original_dest)
        
        # Convert to WebP (full size)
        name, _ = os.path.splitext(filename)
        webp_path = os.path.join(OUTPUT_DIR, f"{name}.webp")
        convert_to_webp(image_path, webp_path)
        
        # Create responsive versions
        for size_name, width in RESPONSIVE_SIZES.items():
            resp_webp_path = os.path.join(OUTPUT_DIR, f"{name}-{size_name}.webp")
            convert_to_webp(image_path, resp_webp_path, width=width)
    
    except Exception as e:
        logger.error(f"Failed to process image {image_path}: {str(e)}")

def process_all_images():
    """Process all images in the images directory"""
    ensure_directory_exists(OUTPUT_DIR)
    
    images = get_all_images()
    logger.info(f"Found {len(images)} images to process")
    
    # Use thread pool for faster processing
    with ThreadPoolExecutor(max_workers=os.cpu_count()) as executor:
        executor.map(process_image, images)

def main():
    parser = argparse.ArgumentParser(description='Convert images to WebP format')
    parser.add_argument('--clean', action='store_true', help='Clean output directory before processing')
    args = parser.parse_args()
    
    if args.clean and os.path.exists(OUTPUT_DIR):
        logger.info(f"Cleaning output directory: {OUTPUT_DIR}")
        shutil.rmtree(OUTPUT_DIR)
    
    logger.info("Starting image optimization")
    process_all_images()
    logger.info(f"Image optimization complete. Output in: {OUTPUT_DIR}")

if __name__ == "__main__":
    main() 