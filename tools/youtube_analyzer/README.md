# YouTube Channel Analyzer

A comprehensive tool suite for analyzing YouTube channels, videos, and competitors using the YouTube Data API v3.

## Features

- Channel Demographics Analysis
- Video Performance Metrics
- Competitor Research
- Video Analytics with Top Comments

## Prerequisites

1. Python 3.7 or higher
2. YouTube Data API key
3. Required Python packages (installed via pip)

## Setup Instructions

1. Clone the repository or copy the tools directory to your project.

2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your YouTube API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable YouTube Data API v3
   - Create credentials (API key)
   - Create a `.env` file in your project root and add:
     ```
     YOUTUBE_API_KEY=your_api_key_here
     ```

## Usage

1. Run the main script:
   ```bash
   python main.py
   ```

2. Choose from the available options:
   - Analyze Channel Demographics
   - Fetch Channel Videos
   - Search Competitors
   - Analyze Video Performance

### Finding Channel and Video IDs

- **Channel ID**: 
  - Go to the channel's YouTube page
  - The ID is in the URL: `youtube.com/channel/[CHANNEL_ID]`
  - For custom URLs, use the channel demographics tool with the username

- **Video ID**:
  - Open the video on YouTube
  - The ID is in the URL after `v=`: `youtube.com/watch?v=[VIDEO_ID]`

## Example Usage

1. Analyzing a channel:
   ```
   Enter YouTube channel ID: UC_x5XG1OV2P6uZZ5FSM9Ttw
   ```

2. Fetching videos:
   ```
   Enter YouTube channel ID: UC_x5XG1OV2P6uZZ5FSM9Ttw
   Sort by: views
   Number of videos: 10
   ```

3. Searching competitors:
   ```
   Enter search query: tech reviews
   Number of competitors: 5
   ```

4. Analyzing a video:
   ```
   Enter video ID: dQw4w9WgXcQ
   ```

## API Quotas

The YouTube Data API has usage quotas:
- 10,000 units per day (free tier)
- Different operations cost different amounts of quota
- Quota resets daily at midnight Pacific Time

## Error Handling

- If you see an API error, check:
  1. Your API key is correctly set in `.env`
  2. The API key has YouTube Data API access enabled
  3. You haven't exceeded your daily quota
  4. The channel/video ID is correct

## Contributing

Feel free to submit issues and enhancement requests! 