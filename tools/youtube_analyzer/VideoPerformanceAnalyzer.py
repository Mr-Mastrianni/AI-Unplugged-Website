"""
A tool to analyze video performance metrics and top comments.
"""

from pydantic import BaseModel, Field
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timezone

load_dotenv()

API_KEY = os.getenv('YOUTUBE_API_KEY')

class VideoPerformanceAnalyzer(BaseModel):
    """
    A tool to analyze video performance metrics and fetch top comments for a specific video.
    """
    
    video_id: str = Field(
        ...,
        description="The YouTube video ID to analyze (found in the video URL after 'v=')"
    )

    def run(self):
        """
        Analyzes video performance and fetches top comments.
        """
        try:
            youtube = build('youtube', 'v3', developerKey=API_KEY)

            # Get video statistics and details
            video_response = youtube.videos().list(
                part="snippet,statistics,contentDetails",
                id=self.video_id
            ).execute()

            if not video_response.get('items'):
                return "Video not found."

            video = video_response['items'][0]
            snippet = video['snippet']
            stats = video['statistics']
            
            # Calculate engagement metrics
            views = int(stats.get('viewCount', 0))
            likes = int(stats.get('likeCount', 0))
            comments = int(stats.get('commentCount', 0))
            
            engagement_rate = round((likes + comments) / views * 100, 2) if views > 0 else 0

            # Get top comments
            top_comments = []
            try:
                comments_response = youtube.commentThreads().list(
                    part="snippet",
                    videoId=self.video_id,
                    order="relevance",
                    maxResults=5
                ).execute()

                for item in comments_response.get('items', []):
                    comment = item['snippet']['topLevelComment']['snippet']
                    top_comments.append({
                        'author': comment['authorDisplayName'],
                        'text': comment['textDisplay'],
                        'like_count': comment['likeCount'],
                        'published_at': comment['publishedAt']
                    })
            except Exception as e:
                top_comments = ["Comments are disabled for this video or an error occurred while fetching comments."]

            # Calculate time-based metrics
            published_at = datetime.strptime(snippet['publishedAt'], "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)
            days_since_published = (now - published_at).days

            daily_views = round(views / max(days_since_published, 1), 2)

            # Compile the analysis
            analysis = {
                'video_title': snippet['title'],
                'published_date': snippet['publishedAt'],
                'days_online': days_since_published,
                'metrics': {
                    'views': views,
                    'likes': likes,
                    'comments': comments,
                    'average_daily_views': daily_views,
                    'engagement_rate': f"{engagement_rate}%"
                },
                'performance_indicators': {
                    'views_to_likes_ratio': round(views / max(likes, 1), 2),
                    'views_to_comments_ratio': round(views / max(comments, 1), 2),
                    'daily_engagement': round((likes + comments) / max(days_since_published, 1), 2)
                },
                'content_details': {
                    'duration': video['contentDetails']['duration'],
                    'definition': video['contentDetails']['definition'],
                    'caption': 'Available' if video['contentDetails'].get('caption') == 'true' else 'Not available'
                },
                'top_comments': top_comments
            }

            return json.dumps(analysis, indent=2)

        except Exception as e:
            return f"Error analyzing video performance: {str(e)}"

if __name__ == "__main__":
    # Test with a sample video ID
    tool = VideoPerformanceAnalyzer(
        video_id="dQw4w9WgXcQ"  # Famous video ID for testing
    )
    print(tool.run()) 