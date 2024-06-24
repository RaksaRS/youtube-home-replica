const MILSECONDS_IN_1_HOUR = 3600 * 1000;
const MILSECONDS_IN_1_DAY = MILSECONDS_IN_1_HOUR * 24;
const MILSECONDS_IN_1_WEEK = MILSECONDS_IN_1_DAY * 7;
const MILSECONDS_IN_1_MONTH = MILSECONDS_IN_1_DAY * 30;
const MILSECONDS_IN_1_YEAR = MILSECONDS_IN_1_DAY * 365;

const videosContainer = document.getElementById("videos");

fetch('..\\video_samples.json')
.then((res) => res.json())
.then((res) => display_videos(res))
.catch((reason) => console.error(reason));

/**
 * Retrieves the given videos' HTML code and add it to the DOM
 * @param {Array} videoObjs The list of videos to be displayed
 */
function display_videos(videoObjs) {
    for (let videoObj of videoObjs) {
        videosContainer.innerHTML += getVideoHTML(videoObj)
    }
}

/**
 * Calculates how long ago was a date time
 * @param {String} dateStr Date in a format the `Date()` constructor accepts
 * @returns A String representing the formatted date
 */
function getPrettyDate(dateStr) {
    let date = new Date(dateStr);
    let duration = Date.now() - date.getTime();
    if (duration < MILSECONDS_IN_1_DAY)
        return Math.floor(duration / MILSECONDS_IN_1_HOUR) + ' hours ago';
    else if (duration < MILSECONDS_IN_1_WEEK)
        return Math.floor(duration / MILSECONDS_IN_1_DAY) + " days ago";
    else if (duration < MILSECONDS_IN_1_MONTH)
        return Math.floor(duration / MILSECONDS_IN_1_WEEK) + " weeks ago";
    else if (duration < MILSECONDS_IN_1_YEAR)
        return Math.floor(duration / MILSECONDS_IN_1_MONTH) + " months ago";
    else
        return Math.floor(duration / MILSECONDS_IN_1_YEAR) + " years ago";
}

/**
 * Formats a number using 'K' to represent thousands and 'M" for millions.
 * @param {Number} num The view count
 * @returns A String representing the formatted number
 */
function getPrettyNumber(num) {
    if (num < 1000)
        return num;
    else if (num < 1000000)
        return Math.floor(num / 100)/10 + 'K';
    else
        return Math.floor(num / 100000)/10 + 'M';
}

/**
 * Gets the HTML code for a video object.
 * @param {Object} videoObj The video
 * @returns A String containg the HTML
 */
function getVideoHTML(videoObj) {
    return `<article class="video">
        <button>
            <div class="video-text-description">
                <h5 class="video-title">${videoObj.title}</h5>
                <p><small class="channel-name">${videoObj.channelTitle}</small></p>
                <p><small class="video-stats">
                    ${getPrettyNumber(videoObj.viewCount)} - ${getPrettyDate(videoObj.publishDate)}
                </small></p>
            </div>;
            <img class="video-thumbnail" src="${videoObj.thumbnailUrl}" alt="thumbnail">
            <img class="channel-img" src="${videoObj.channelImgUrl}" alt="channel-img">
        </button>
    </article>
    `;
}