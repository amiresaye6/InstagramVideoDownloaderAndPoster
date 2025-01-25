const login = require("../login");

module.exports.loginFunction = async (req, res) => {
    const { userName, password } = req.body;

    // Check if userName and password are provided
    if (!userName || !password) {
        console.log("Logging in with default saved credentials");
        // Use default credentials if none are provided
        const defaultUserName = process.env.INSTAGRAM_USERNAME;
        const defaultPassword = process.env.INSTAGRAM_PASSWORD;
        try {
            const result = await login(defaultUserName, defaultPassword); // Call the login function
            return res.status(200).json({ message: "Logged in with default credentials", result });
        } catch (error) {
            return res.status(400).json({ message: "Default login failed", error: error.message });
        }
    }

    // If userName and password are provided, use them
    try {
        const result = await login(userName, password); // Call the login function
        res.status(200).json({ message: "Login successful", result }); // Send success response
    } catch (error) {
        res.status(400).json({ message: "Login failed", error: error.message }); // Send error response
    }
};