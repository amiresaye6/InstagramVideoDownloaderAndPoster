const { downloader } = require("./instagramVideoDownloader");
const { postVideo } = require("./postVideo");
// will be run at certin duratinos like twice a day and so on
// will automatically download all videos from a spcific user and upload them one by one,
// will send messages to telegram or watsapp for logs, errors, confirmation

const args = process.argv.slice(2);

downloader(args[0])
    .then((metaData) => {
        postVideo(metaData.fileName, metaData.userName);
    }).then(() => {
        console.log("video posted successfully");
    })
