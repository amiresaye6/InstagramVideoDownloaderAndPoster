const getViewsCount = require("../viewsCount");
const { getUrls } = require("../reelsUrlsExtractor");
const { postVideo } = require("../postVideo");
const { downloader } = require("../instagramVideoDownloader");

// Helper function for consistent responses
const sendResponse = (res, status, success, message, data = null) => {
    res.status(status).json({
        success,
        message,
        data,
    });
};

module.exports.reelsCountFunction = async (req, res) => {
    try {
        const { accountUserName } = req.body;

        // Input validation
        if (!accountUserName) {
            return sendResponse(res, 400, false, "accountUserName is required");
        }

        // Call the reelsCount function and await its result
        const count = await getViewsCount(accountUserName);

        // Send a success response with the count
        sendResponse(res, 200, true, "Reels count retrieved successfully", {
            account: accountUserName,
            count,
        });
    } catch (err) {
        // Log the error for debugging
        console.error("Error in reelsCountFunction:", err);

        // Send an error response
        sendResponse(res, 500, false, "Failed to retrieve reels count", {
            error: err.message,
        });
    }
};

module.exports.getReelsUrls = async (req, res) => {
    try {
        const { reelsPageUrl } = req.body;

        // Input validation
        if (!reelsPageUrl) {
            return sendResponse(res, 400, false, "reelsPageUrl is required");
        }

        // Fetch reels URLs
        const reels = await getUrls(reelsPageUrl);

        // Send a success response
        sendResponse(res, 200, true, "Reels URLs retrieved successfully", {
            account: reelsPageUrl,
            reelsCount: reels.length,
            reels,
        });
    } catch (err) {
        // Log the error for debugging
        console.error("Error in getReelsUrls:", err);

        // Send an error response
        sendResponse(res, 500, false, "Failed to retrieve reels URLs", {
            error: err.message,
        });
    }
};

module.exports.postReel = async (req, res) => {
    try {
        const { reelUrl, dimentions, debugging } = req.body;

        // Input validation
        if (!reelUrl || !dimentions) {
            return sendResponse(res, 400, false, "reelUrl, dimentions are required");
        }
    
        if (dimentions !== "1/1" && dimentions !== "16/9" && dimentions !== "9/16" && dimentions !== "original") {
            return sendResponse(res, 400, false, "Invalid dimentions, must be one of: 1/1, 16/9, 9/16, original");
        }

        const metaData = await downloader(reelUrl);

        // Call the postVideo function to post the reel (path, caption)
        const reel = await postVideo(metaData.videoFilePath, metaData.thumbnailFilePath, metaData.userName, dimentions, debugging);

        // Check if the reel was posted successfully
        if (reel) {
            sendResponse(res, 200, true, "Post successful");
        } else {
            sendResponse(res, 400, false, "Error: Could not post this reel");
        }
    } catch (err) {
        // Log the error for debugging
        console.error("Error in postReel:", err);

        // Send an error response
        sendResponse(res, 500, false, "Failed to post reel", {
            error: err.message,
        });
    }
};
