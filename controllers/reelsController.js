const getViewsCount = require("../viewsCount");

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