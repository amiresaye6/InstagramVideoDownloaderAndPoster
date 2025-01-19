# Instagram Video Downloader and Poster

This repository contains a Node.js script that allows you to download Instagram videos and post videos to Instagram using Puppeteer. The script is divided into two main functionalities:

1. **Instagram Video Downloader**: Downloads Instagram videos using the `instagram-url-direct` package.
2. **Instagram Video Poster**: Automates the process of posting videos to Instagram using Puppeteer.

---

## Features

- **Download Instagram Videos**: Download videos from Instagram by providing the video URL.
- **Post Videos to Instagram**: Automate the process of posting videos to Instagram with captions.
- **Cookie Management**: Save and load Instagram session cookies to avoid repeated logins.

---

## Prerequisites

Before running the script, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amiresaye6/socialMediaDynamicAgent.git
   cd socialMediaDynamicAgent
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Create a `cookies.json` file in the root directory with your Instagram session cookies:
    - You can use browser extensions like [EditThisCookie](https://www.editthiscookie.com/) to export your cookies.

    - you can run this command to automatically login and store the cookies in `cookies.json`
        ```bash
        node login.js
        ```

---

## Usage

### 1. Download Instagram Videos

To download an Instagram video, use the `downloader` function:

```javascript
const { downloader } = require('./path-to-your-script');

(async () => {
  const videoUrl = 'https://www.instagram.com/p/VIDEO_ID/';
  const result = await downloader(videoUrl);
  console.log('Downloaded video:', result.fileName);
})();
```

- The video will be saved in the `downloads` directory with a filename in the format: `username_instagram_video_TIMESTAMP.mp4`.

---

### 2. Post Videos to Instagram

To post a video to Instagram, use the `postVideo` function:

```javascript
const { postVideo } = require('./path-to-your-script');

(async () => {
  const videoPath = 'path/to/your/video.mp4';
  const caption = 'Your caption here';
  await postVideo(videoPath, caption);
  console.log('Video posted successfully!');
})();
```

- Ensure the `cookies.json` file contains valid Instagram session cookies.
- The script will upload the video, add a caption, and post it to your Instagram account.

---

## Configuration

- **Cookies**: Save your Instagram session cookies in `cookies.json` to avoid logging in every time.
- **Video Path**: Provide the correct path to the video you want to upload.
- **Caption**: Customize the caption for your Instagram post.

---

## Notes

- **Headless Mode**: The script runs in headless mode by default. You can set `headless: false` in the Puppeteer launch options to see the browser window.
- **Error Handling**: The script includes error handling and will take a screenshot if an error occurs during the posting process.

---

## Dependencies

- [axios](https://www.npmjs.com/package/axios): For making HTTP requests.
- [instagram-url-direct](https://www.npmjs.com/package/instagram-url-direct): For extracting direct video URLs from Instagram.
- [puppeteer](https://www.npmjs.com/package/puppeteer): For automating the Instagram posting process.
- [fs](https://nodejs.org/api/fs.html): For file system operations.
- [path](https://nodejs.org/api/path.html): For handling file paths.

---

## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Disclaimer

This project is for educational purposes only. Use it responsibly and ensure you comply with Instagram's terms of service.