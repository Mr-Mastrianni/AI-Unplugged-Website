#!/usr/bin/env python3
"""
Entry point script for the YouTube Channel Analyzer
"""

import sys
import os

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from tools.youtube_analyzer.main import main
    main()
except ModuleNotFoundError:
    print("Error: Could not find the YouTube analyzer module.")
    print("Make sure you're running this script from the project root directory.")
    sys.exit(1)
except ImportError as e:
    print(f"Error: Failed to import required modules: {e}")
    print("\nPlease install the required packages by running:")
    print("pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1) 