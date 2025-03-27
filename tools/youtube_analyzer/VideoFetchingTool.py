"""
A tool to fetch and sort videos from a YouTube channel.
"""

from pydantic import BaseModel, Field
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv
import json
from typing import Literal

load_dotenv()

API_KEY = os.getenv('YOUTUBE_API_KEY')

class VideoFetchingTool(BaseModel):
    """
    A tool to fetch videos from a YouTube channel with various sorting options.
    """
    
    channel_id: str = Field(
        ...,
        description="The YouTube channel ID to fetch videos from."
    )
    
    sort_by: Literal['date', 'views', 'rating'] = Field(
        default='date',
        description="Sort videos by: 'date' (newest first), 'views' (most viewed first), or 'rating' (highest rated first)"
    )
    
    max_results: int = Field(
        default=10,
        description="Maximum number of videos to fetch (1-50)",
        ge=1,
        le=50
    )

    def run(self):
        """
        Fetches videos from the specified channel with the given sorting options.
        """
        try:
            youtube = build('youtube', 'v3', developerKey=API_KEY)

            # First, get the channel's upload playlist ID
            channel_response = youtube.channels().list(
                part="contentDetails",
                id=self.channel_id
            ).execute()

            if not channel_response['items']:
                return "Channel not found."

            uploads_playlist_id = channel_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']

            # Get videos from the uploads playlist
            videos_request = youtube.playlistItems().list(
                part="snippet,contentDetails",
                playlistId=uploads_playlist_id,
                maxResults=50  # Fetch maximum allowed to sort properly
            )

            videos = []
            while videos_request and len(videos) < self.max_results:
                videos_response = videos_request.execute()
                
                # Get detailed info for each video
                video_ids = [item['contentDetails']['videoId'] for item in videos_response['items']]
                video_stats = youtube.videos().list(
                    part="statistics",
                    id=','.join(video_ids)
                ).execute()

                # Combine video info with statistics
                for video_item, stats_item in zip(videos_response['items'], video_stats['items']):
                    video_data = {
                        'title': video_item['snippet']['title'],
                        'video_id': video_item['contentDetails']['videoId'],
                        'published_at': video_item['snippet']['publishedAt'],
                        'description': video_item['snippet']['description'],
                        'thumbnail_url': video_item['snippet']['thumbnails']['default']['url'],
                        'view_count': int(stats_item['statistics'].get('viewCount', 0)),
                        'like_count': int(stats_item['statistics'].get('likeCount', 0)),
                        'comment_count': int(stats_item['statistics'].get('commentCount', 0))
                    }
                    videos.append(video_data)

                videos_request = youtube.playlistItems().list_next(videos_request, videos_response)

            # Sort videos based on the specified criteria
            if self.sort_by == 'views':
                videos.sort(key=lambda x: x['view_count'], reverse=True)
            elif self.sort_by == 'rating':
                videos.sort(key=lambda x: x['like_count'], reverse=True)
            # For 'date', videos are already sorted by default (newest first)

            # Return only the requested number of videos
            return json.dumps(videos[:self.max_results], indent=2)

        except Exception as e:
            return f"Error fetching videos: {str(e)}"

if __name__ == "__main__":
    # Test with a sample channel ID (e.g., Google Developers channel)
    tool = VideoFetchingTool(
        channel_id="UC_x5XG1OV2P6uZZ5FSM9Ttw",
        sort_by="views",
        max_results=5
    )
    print(tool.run()) 