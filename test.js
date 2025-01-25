const { downloader } = require("./instagramVideoDownloader");
const { getUrls } = require("./reelsUrlsExtractor");
const getViewsCount = require("./viewsCount");
const login = require("./login");
// downloader("https://www.instagram.com/reel/Cja1WB1qTbo/")
//     .then((data) => console.log(data))

// getUrls("https://www.instagram.com/r6di_/reels/")

// require('dotenv').config();

// console.log(process.env.INSTAGRAM_USERNAME);

// getViewsCount();


login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);