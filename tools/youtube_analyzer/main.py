"""
Main script for the YouTube Channel Analyzer
"""

from .ChannelDemographicsTool import ChannelDemographicsTool
from .VideoFetchingTool import VideoFetchingTool
from .CompetitorSearchTool import CompetitorSearchTool
from .VideoPerformanceAnalyzer import VideoPerformanceAnalyzer
import json
from dotenv import load_dotenv
import os

load_dotenv()

def print_json(data):
    """Helper function to print JSON data in a readable format"""
    try:
        parsed = json.loads(data)
        print(json.dumps(parsed, indent=2))
    except:
        print(data)

def main():
    # Check if API key is configured
    if not os.getenv('YOUTUBE_API_KEY'):
        print("Error: YouTube API key not found. Please set the YOUTUBE_API_KEY environment variable.")
        print("\nTo set up your YouTube API key:")
        print("1. Create a .env file in the project root directory")
        print("2. Add the following line to the .env file:")
        print("   YOUTUBE_API_KEY=your_api_key_here")
        print("\nIf you don't have a YouTube API key:")
        print("1. Go to https://console.cloud.google.com/")
        print("2. Create a new project")
        print("3. Enable YouTube Data API v3")
        print("4. Create credentials (API key)")
        return

    while True:
        print("\nYouTube Channel Analyzer Menu:")
        print("1. Analyze Channel Demographics")
        print("2. Fetch Channel Videos")
        print("3. Search Competitors")
        print("4. Analyze Video Performance")
        print("5. Exit")
        
        choice = input("\nEnter your choice (1-5): ")
        
        if choice == "1":
            channel_id = input("Enter YouTube channel ID: ")
            tool = ChannelDemographicsTool(channel_id=channel_id)
            print("\nChannel Demographics:")
            print_json(tool.run())

        elif choice == "2":
            channel_id = input("Enter YouTube channel ID: ")
            sort_by = input("Sort by (date/views/rating) [default: date]: ") or "date"
            max_results = int(input("Number of videos to fetch (1-50) [default: 10]: ") or "10")
            
            tool = VideoFetchingTool(
                channel_id=channel_id,
                sort_by=sort_by,
                max_results=max_results
            )
            print("\nChannel Videos:")
            print_json(tool.run())

        elif choice == "3":
            query = input("Enter search query for competing channels: ")
            max_results = int(input("Number of competitors to find (1-25) [default: 5]: ") or "5")
            
            tool = CompetitorSearchTool(
                search_query=query,
                max_results=max_results
            )
            print("\nCompeting Channels:")
            print_json(tool.run())

        elif choice == "4":
            video_id = input("Enter YouTube video ID: ")
            tool = VideoPerformanceAnalyzer(video_id=video_id)
            print("\nVideo Performance Analysis:")
            print_json(tool.run())

        elif choice == "5":
            print("Goodbye!")
            break

        else:
            print("Invalid choice. Please try again.")

        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main() 