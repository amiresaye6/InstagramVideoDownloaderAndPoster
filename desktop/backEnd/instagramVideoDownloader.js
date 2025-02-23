const instagramGetUrl = require("instagram-url-direct");
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.downloader = async (instagramVideoUrl) => {
    try {
        let data = await instagramGetUrl(instagramVideoUrl);

        const videoUrl = data.media_details[0].url;
        const userName = data.post_info.owner_username;
        const thumbnailUrl = data.media_details[0].thumbnail; // Thumbnail URL

        // Define the downloads directory
        const downloadsDir = path.join(__dirname, 'downloads');

        // Create the downloads directory if it doesn't exist
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir);
        }

        // Generate the file name for the video
        const videoFileName = `${userName}_instagram_video_${Date.now()}.mp4`;
        const videoFilePath = path.join(downloadsDir, videoFileName);

        // Download the video (using stream)
        const videoResponse = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream',
        });

        const videoWriter = fs.createWriteStream(videoFilePath);
        videoResponse.data.pipe(videoWriter);

        // Wait for the video to finish downloading
        await new Promise((resolve, reject) => {
            videoWriter.on('finish', () => {
                console.log('Video downloaded successfully! at ', videoFilePath);
                resolve();
            });

            videoWriter.on('error', (err) => {
                console.error('Error writing video file:', err);
                reject(err);
            });
        });

        // Define the thumbnails directory
        const thumbnailsDir = path.join(downloadsDir, 'thumbnails');

        // Create the thumbnails directory if it doesn't exist
        if (!fs.existsSync(thumbnailsDir)) {
            fs.mkdirSync(thumbnailsDir);
        }

        // Generate the file name for the thumbnail
        const thumbnailFileName = `${userName}_instagram_thumbnail_${Date.now()}.jpg`;
        const thumbnailFilePath = path.join(thumbnailsDir, thumbnailFileName);

        // Download the thumbnail (without stream)
        const thumbnailResponse = await axios({
            method: 'GET',
            url: thumbnailUrl,
            responseType: 'arraybuffer', // Download as a buffer
        });

        // Save the thumbnail to disk
        fs.writeFileSync(thumbnailFilePath, thumbnailResponse.data);
        console.log('Thumbnail downloaded successfully! at ', thumbnailFilePath);

        return {
            videoFilePath: "downloads/" + videoFileName,
            thumbnailFilePath: "downloads/thumbnails/" + thumbnailFileName,
            userName,
        };
    } catch (error) {
        console.error('Error downloading video or thumbnail:', error);
    }
};