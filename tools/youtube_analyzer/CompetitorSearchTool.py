"""
A tool to search for and analyze competing YouTube channels.
"""

from pydantic import BaseModel, Field
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv
import json

load_dotenv()

API_KEY = os.getenv('YOUTUBE_API_KEY')

class CompetitorSearchTool(BaseModel):
    """
    A tool to search for and analyze competing YouTube channels based on keywords and topics.
    """
    
    search_query: str = Field(
        ...,
        description="Keywords to search for competing channels (e.g., 'tech reviews', 'gaming news')"
    )

    max_results: int = Field(
        default=5,
        description="Maximum number of competitor channels to return (1-25)",
        ge=1,
        le=25
    )

    def run(self):
        """
        Searches for and analyzes competing YouTube channels based on the search query.
        """
        try:
            youtube = build('youtube', 'v3', developerKey=API_KEY)

            # Search for channels
            search_response = youtube.search().list(
                q=self.search_query,
                type='channel',
                part='snippet',
                maxResults=self.max_results,
                order='relevance'
            ).execute()

            if not search_response.get('items'):
                return "No channels found matching the search criteria."

            competitors = []
            for item in search_response['items']:
                channel_id = item['snippet']['channelId']
                
                # Get detailed channel information
                channel_response = youtube.channels().list(
                    part='snippet,statistics,brandingSettings,topicDetails',
                    id=channel_id
                ).execute()

                if channel_response['items']:
                    channel = channel_response['items'][0]
                    stats = channel['statistics']
                    snippet = channel['snippet']

                    competitor_data = {
                        'channel_name': snippet['title'],
                        'channel_id': channel_id,
                        'description': snippet['description'],
                        'creation_date': snippet['publishedAt'],
                        'subscriber_count': int(stats.get('subscriberCount', 0)),
                        'video_count': int(stats.get('videoCount', 0)),
                        'view_count': int(stats.get('viewCount', 0)),
                        'country': snippet.get('country', 'Not specified'),
                        'custom_url': snippet.get('customUrl', 'Not available'),
                        'keywords': channel.get('brandingSettings', {}).get('channel', {}).get('keywords', '').split(),
                        'topics': channel.get('topicDetails', {}).get('topicCategories', []),
                        'engagement_ratio': round(
                            int(stats.get('viewCount', 0)) / 
                            (int(stats.get('subscriberCount', 1)) or 1), 2
                        )
                    }
                    competitors.append(competitor_data)

            # Sort competitors by subscriber count (descending)
            competitors.sort(key=lambda x: x['subscriber_count'], reverse=True)

            return json.dumps(competitors, indent=2)

        except Exception as e:
            return f"Error searching for competitors: {str(e)}"

if __name__ == "__main__":
    # Test with sample search query
    tool = CompetitorSearchTool(
        search_query="tech reviews",
        max_results=3
    )
    print(tool.run()) 