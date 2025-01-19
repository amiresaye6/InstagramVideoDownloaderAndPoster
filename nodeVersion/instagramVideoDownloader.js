const instagramGetUrl = require("instagram-url-direct");
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.downloader = async (instagramVideoUrl) => {
    try {
        let data = await instagramGetUrl(instagramVideoUrl);

        const videoUrl = data.media_details[0].url;
        const userName = data.post_info.owner_username;

        // // Download the video
        const response = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream',
        });

        // Define the downloads directory
        const downloadsDir = path.join(__dirname, 'downloads');

        // Create the downloads directory if it doesn't exist
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir);
        }

        // Generate the file name
        const fileName = `${userName}_instagram_video_${Date.now()}.mp4`;

        // Define the output file path inside the downloads directory
        const outputFilePath = path.join(downloadsDir, fileName);

        // Create a write stream and pipe the response data to it
        const writer = fs.createWriteStream(outputFilePath);
        response.data.pipe(writer);

        writer.on('finish', () => {
            console.log('Video downloaded successfully! at ', outputFilePath);
        });

        writer.on('error', (err) => {
            console.error('Error writing video file:', err);
        });
        return { fileName: "downloads/" + fileName, userName };
    } catch (error) {
        console.error('Error downloading video:', error);
    }
}