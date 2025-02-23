const express = require('express');
const { postVideo } = require('./postVideo');
const { downloader } = require('./instagramVideoDownloader');
const login = require('./login');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Login API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const success = await login(username, password);
        res.json({ success });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Download API
app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    try {
        const result = await downloader(url);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload API
app.post('/api/upload', async (req, res) => {
    const { reelUrl, videoPath, thumbnailPath, caption, dimensions } = req.body;
    try {
        downloader(reelUrl)
            .then((metaData) => {
                postVideo(metaData.videoFilePath, metaData.thumbnailFilePath, metaData.userName, "original");
                console.log("video posted successfully", metaData.videoFilePath);
            }).then(() => {
                console.log("video posted successfully");
            })
        // const success = await postVideo(videoPath, thumbnailPath, caption, dimensions);
        res.json({message: "video posted successfully"});
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});