"""
This module provides functions that help fetch data from the Youtube API

Attributes
----------
MAX_VIDEOS_PER_SEARCH_PAGE : int
    The maximum number of videos allowed per search page (a search may contain
    many results, and results are divided into pages).
"""
import googleapiclient.discovery
import googleapiclient.errors
import json


MAX_VIDEOS_PER_SEARCH_PAGE = 50

def get_api_key(credentials_file_path : str, field_name : str ='Youtube Data API v3'):
    """Reads the API key from a json-formatted credentials file

    Parameters
    ----------
    credentials_file_path : str
        The credentials file's path
    field_name : str
        The name of the JSON field that contains the API key in the file

    Returns
    -------
    str
        The API key
    """
    with open(credentials_file_path, 'r') as f:
        creds = json.load(f)
        return creds[field_name]


def get_search_pages_from_query_term(api, query, num_videos):
    """Retrieves search pages from the given Youtube API instance and query

    Parameters
    ----------
    api : googleapiclient.discovery.resource
        The Youtube API instance
    query : str
        The search term
    num_videos : int
        The number of videos to retrieve

    Returns
    list[dict]
        A list of dictionaries, each representing a search page
    """
    if query.strip() == '':
        raise ValueError('`query` can\'t be none')
    # stores search pages. each page is limited to `MAX_VIDEOS_PER_SEARCH_PAGE`
    # that is determined by the API. Currently, it's 50.
    search_pages = []
    next_page_token = None

    while num_videos > 0:
        if next_page_token:
            req = api.search().list(
                part='snippet',
                maxResults=min(MAX_VIDEOS_PER_SEARCH_PAGE, num_videos),
                q=query,
                safeSearch="strict",
                type='video',
                pageToken=next_page_token,
                fields='nextPageToken,items(id/videoId,snippet(publishedAt,title,thumbnails/high,channelId,channelTitle))'
            )
        else:
            req = api.search().list(
                part='snippet',
                maxResults=min(MAX_VIDEOS_PER_SEARCH_PAGE, num_videos),
                q=query,
                safeSearch="strict",
                type='video',
                fields='nextPageToken,items(id/videoId,snippet(publishedAt,title,thumbnails/high,channelId,channelTitle))'
            )
        response = req.execute()
        next_page_token = response['nextPageToken']
        search_pages.append(response)

        num_videos -= MAX_VIDEOS_PER_SEARCH_PAGE

    return search_pages

def get_videos_in_custom_format(api, search_pages):
    """Uses the given API instance to query a search term to retrieve
    `num_videos` videos

    The custom format consists of a JSON array, whose elements represent video
    objects. Each video object has 6 fields: title, published date, view count,
    thumbnail, channel name, channel image.

    Parameters
    ----------
    api : googleapiclient.discovery.resource
        The Youtube API instance
    query : str
        The search term
    num_videos : int
        The number of videos to retrieve

    Returns
    -------
    list[dict]
        A list of dictionaries, each representing a video and whose keys are the
        are the 6 attributes a video such as title, published date, etc. as
        mentioned above in the summary section
    """
    vids_view_count = {}    # maps video IDs to view count
    channel_imgs = {}       # maps channel IDs to channel image URLs

    for page in search_pages:
        vid_ids = [vid_dict['id']['videoId'] for vid_dict in page['items']]

        vids_details_req = api.videos().list(
            part='statistics',
            id=",".join(vid_ids),
            fields='items(id,statistics/viewCount)'
        )

        vids_details_res = vids_details_req.execute()
        for vid_details in vids_details_res['items']:
            vid_id = vid_details['id']
            vid_view_count = vid_details['statistics']['viewCount']
            vids_view_count[vid_id] = vid_view_count

    for page in search_pages:
        channel_ids = [vid_dict['snippet']['channelId'] for vid_dict in page['items']]

        channel_imgs_req = api.channels().list(
            part='snippet',
            fields='items(id,snippet(thumbnails/high))',
            id=",".join(channel_ids)
        )
        channels_details_dict = channel_imgs_req.execute()
        for channel_details in channels_details_dict['items']:
            channel_imgs[ channel_details['id'] ] = \
                channel_details['snippet']['thumbnails']['high']['url']

    vids_in_custom_format = []

    for page in search_pages:
        for vid in page['items']:
            vid_id = vid['id']['videoId']
            channel_id = vid['snippet']['channelId']
            vids_in_custom_format.append(
                {
                    'title': vid['snippet']['title'],
                    'publishDate': vid['snippet']['publishedAt'],
                    'viewCount': vids_view_count[ vid_id ],
                    'thumbnailUrl': vid['snippet']['thumbnails']['high']['url'],
                    'channelTitle': vid['snippet']['channelTitle'],
                    'channelImgUrl': channel_imgs[channel_id]
                }
            )

    return vids_in_custom_format


def main():
    API_KEY = get_api_key('C:\\Users\\Raksa\\Desktop\\Programming\\Prog-Programming-projects\\Web\\Youtube\\CREDS.json')

    VIDEOS_DUMP_LOC = 'C:\\Users\\Raksa\\Desktop\\Programming\\Prog-Programming-projects\\Web\\Youtube\\video_samples.json'
    QUERY = "How to make pasta"
    NUM_VIDS = 50

    try:
        with googleapiclient.discovery.build("youtube", "v3", developerKey=API_KEY) \
            as api:
            with open(VIDEOS_DUMP_LOC, 'w') as f:
                search_pages = get_search_pages_from_query_term(api, QUERY, NUM_VIDS)
                formatted_vids = get_videos_in_custom_format(api, search_pages)
                json.dump(formatted_vids, f, indent=2)
    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()