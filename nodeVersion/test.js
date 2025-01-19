const { downloader } = require("./instagramVideoDownloader");
const { getUrls } = require("./reelsUrlsExtractor");
// downloader("https://www.instagram.com/reel/Cja1WB1qTbo/")
//     .then((data) => console.log(data))

getUrls("https://www.instagram.com/r6di_/reels/")