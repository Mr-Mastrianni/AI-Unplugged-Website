"""
A tool to fetch YouTube channel demographics and statistics.
"""

from pydantic import BaseModel, Field
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import os
from dotenv import load_dotenv
import json

load_dotenv()

API_KEY = os.getenv('YOUTUBE_API_KEY')

class ChannelDemographicsTool(BaseModel):
    """
    A tool to fetch YouTube channel demographics and statistics including subscriber count,
    view count, video count, and other relevant metrics.
    """
    
    channel_id: str = Field(
        ...,
        description="The YouTube channel ID to analyze. Can be found in the channel's URL."
    )

    def run(self):
        """
        Fetches and returns channel demographics using YouTube Data API v3.
        """
        try:
            # Initialize the YouTube API client
            youtube = build('youtube', 'v3', developerKey=API_KEY)

            # Get channel statistics
            request = youtube.channels().list(
                part="snippet,statistics,brandingSettings",
                id=self.channel_id
            )
            response = request.execute()

            if not response['items']:
                return "Channel not found."

            channel_data = response['items'][0]
            stats = channel_data['statistics']
            snippet = channel_data['snippet']
            branding = channel_data['brandingSettings']

            # Format the response
            demographics = {
                "channel_name": snippet['title'],
                "description": snippet['description'],
                "country": snippet.get('country', 'Not specified'),
                "creation_date": snippet['publishedAt'],
                "subscriber_count": int(stats.get('subscriberCount', 0)),
                "view_count": int(stats.get('viewCount', 0)),
                "video_count": int(stats.get('videoCount', 0)),
                "channel_language": snippet.get('defaultLanguage', 'Not specified'),
                "custom_url": snippet.get('customUrl', 'Not available'),
                "keywords": branding['channel'].get('keywords', '').split(),
                "topic_categories": channel_data.get('topicDetails', {}).get('topicCategories', [])
            }

            return json.dumps(demographics, indent=2)

        except Exception as e:
            return f"Error fetching channel demographics: {str(e)}"

if __name__ == "__main__":
    # Test with a sample channel ID (e.g., Google Developers channel)
    tool = ChannelDemographicsTool(channel_id="UC_x5XG1OV2P6uZZ5FSM9Ttw")
    print(tool.run()) 