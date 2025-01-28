const { downloader } = require("./instagramVideoDownloader");
const { getUrls } = require("./reelsUrlsExtractor");
const getViewsCount = require("./viewsCount");

// downloader("https://www.instagram.com/reel/Cja1WB1qTbo/")
//     .then((data) => console.log(data))

getUrls("https://www.instagram.com/qura.n___91/reels/", true)

// require('dotenv').config();

// console.log(process.env.INSTAGRAM_USERNAME);

// getViewsCount("fadhakkir_quran");

