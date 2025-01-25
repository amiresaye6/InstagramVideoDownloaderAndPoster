const getViewsCount = require("../viewsCount");
const { getUrls } = require("../reelsUrlsExtractor");

module.exports.reelsCountFunction = async (req, res) => {
    try {
        // Call the reelsCount function and await its result
        const count = await getViewsCount(req.body.accountUserName);

        // Send a success response with the count
        res.status(200).json({
            success: true,
            message: "Reels count retrieved successfully",
            data: {
                account: req.body.accountUserName,
                count: count
            }
        });
    } catch (err) {
        // Log the error for debugging
        console.error("Error in reelsCountFunction:", err);

        // Send an error response with a meaningful message
        res.status(500).json({
            success: false,
            message: "Failed to retrieve reels count",
            error: err.message // Include the error message for debugging
        });
    }
};

module.exports.getReelsUrls = async (req, res) => {
    try {
        const { reelsPageUrl } = req.body;

        const reels = await getUrls(reelsPageUrl);
        res.status(200).json({
            account: reelsPageUrl,
            reelsCount: reels.length,
            reels
        });
    } catch (err) {
        console.error("Error in getReelsUrls:", err);

        res.status(500).json({
            message: "Failed to retrieve reels urls",
            error: err.message // Include the error message for debugging
        });
    }
}