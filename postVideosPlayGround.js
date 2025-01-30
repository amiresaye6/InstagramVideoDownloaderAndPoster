const puppeteer = require('puppeteer');
const fs = require('fs');

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const postVideo = async (videoPath, thumbnailPath, caption, dimentions = "original") => {
    let page;

    try {
        // Launch the browser
        const browser = await puppeteer.launch({ headless: false }); // set headless to false if you want to see the web page.
        page = await browser.newPage();

        // Load cookies from the file
        if (fs.existsSync('cookies.json')) {
            const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
            await page.setCookie(...cookies);
            console.log('Cookies loaded from cookies.json.');
        } else {
            console.log('No cookies found. Please log in first.');
            return;
        }

        // Navigate to Instagram's homepage
        await page.goto('https://www.instagram.com/');
        console.log('Navigated to Instagram homepage.');
        await delay(1000); // Wait for 1 second

        // Click the "Create" button to open the post creation modal
        const createButtonSelector = 'svg[aria-label="New post"]'; // Selector for the "Create" button
        await page.waitForSelector(createButtonSelector);
        await page.click(createButtonSelector);
        console.log('Clicked the "Create" button.');
        await delay(1000); // Wait for 1 second

        // Wait for the file input element to appear
        const fileInputSelector = 'input[type="file"]'; // Selector for the file input
        await page.waitForSelector(fileInputSelector);
        console.log('File input field loaded.');

        // Upload the video
        const fileInput = await page.$(fileInputSelector);
        await fileInput.uploadFile(videoPath);
        console.log('Video uploaded.');
        await delay(1000); // Wait for 1 second

        // Wait for the modal to appear after video selection
        const modalSelector = 'div._a9-v'; // Selector for the modal
        await page.waitForSelector(modalSelector, { visible: true, timeout: 30000 });
        console.log('Modal appeared after video selection.');

        // Wait for the "OK" button to appear and click it
        const okButtonSelector = 'button._acan._acap._acaq._acas._acav._aj1-._ap30'; // Selector for the "OK" button
        await page.waitForSelector(okButtonSelector, { visible: true, timeout: 30000 });
        await page.click(okButtonSelector);
        console.log('Clicked the "OK" button.');
        await delay(1000); // Wait for 1 second

        // changing video dimentions to 9/16 optional
        await page.waitForSelector('svg[aria-label="Select crop"]', { visible: true });
        await page.click('svg[aria-label="Select crop"]');
        console.log('Button clicked successfully!');
        await delay(1000);

        try {
            if (dimentions === "original") {
                await page.waitForSelector('svg[aria-label="Photo outline icon"]', { visible: true });
                await page.click('svg[aria-label="Photo outline icon"]');
                console.log('Photo outline icon Button clicked successfully!');
            } else if (dimentions === "1/1") {
                await page.waitForSelector('svg[aria-label="Crop square icon"]', { visible: true });
                await page.click('svg[aria-label="Crop square icon"]');
                console.log('Crop square icon Button clicked successfully!');
            } else if (dimentions === "16/9") {
                await page.waitForSelector('svg[aria-label="Crop landscape icon"]', { visible: true });
                await page.click('svg[aria-label="Crop landscape icon"]');
                console.log('Crop landscape icon Button clicked successfully!');
            } else if (dimentions === "9/16") {
                await page.waitForSelector('svg[aria-label="Crop portrait icon"]', { visible: true });
                await page.click('svg[aria-label="Crop portrait icon"]');
                console.log('Crop portrait icon Button clicked successfully!');
            }
            await delay(1000);
        } catch (error) {
            console.error('Failed to click the dimentions button:', error);
        }

        // Wait for the crop modal to appear (if applicable)
        const cropModalSelector = 'div[role="dialog"][aria-label="Crop"]';
        await page.waitForSelector(cropModalSelector, { visible: true, timeout: 30000 });
        console.log('Crop modal loaded.');

        // Click the first "Next" button
        await page.waitForFunction(() => {
            const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Crop"] div[role="button"]');
            const nextButton = Array.from(buttons).find(button => button.textContent.trim() === 'Next');
            return nextButton && nextButton.offsetParent !== null; // Check if the button is visible
        }, { timeout: 30000 });
        console.log('First "Next" button is present and visible.');

        await page.evaluate(() => {
            const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Crop"] div[role="button"]');
            const nextButton = Array.from(buttons).find(button => button.textContent.trim() === 'Next');
            if (nextButton) {
                nextButton.click();
            }
        });
        console.log('Clicked the first "Next" button.');
        await delay(1000); // Wait for 1 second

        // Wait for the Edit modal to appear
        const editModalSelector = 'div[role="dialog"][aria-label="Edit"]';
        await page.waitForSelector(editModalSelector, { visible: true, timeout: 30000 });
        console.log('Edit modal loaded.');

        const thumbnailInputSelector = 'input[type="file"]'; // Selector for the file input
        await page.waitForSelector(thumbnailInputSelector);
        console.log('File input field loaded.');

        // Upload the video
        const thumbnailInput = await page.$(thumbnailInputSelector);
        await thumbnailInput.uploadFile(thumbnailPath);
        console.log('thumbnail uploaded.');
        await delay(1000); // Wait for 1 second

        // Click the second "Next" button
        await page.waitForFunction(() => {
            const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Edit"] div[role="button"]');
            const nextButton = Array.from(buttons).find(button => button.textContent.trim() === 'Next');
            return nextButton && nextButton.offsetParent !== null; // Check if the button is visible
        }, { timeout: 30000 });
        console.log('Second "Next" button is present and visible.');

        await page.evaluate(() => {
            const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Edit"] div[role="button"]');
            const nextButton = Array.from(buttons).find(button => button.textContent.trim() === 'Next');
            if (nextButton) {
                nextButton.click();
            }
        });
        console.log('Clicked the second "Next" button.');
        await delay(1000); // Wait for 1 second

        // Click the "Share" button
        await page.evaluate(() => {
            const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Create new post"] div[role="button"]');
            const shareButton = Array.from(buttons).find(button => button.textContent.trim() === 'Share');
            if (shareButton) {
                shareButton.click();
            }
        });
        console.log('Clicked the "Share" button.');
        await delay(2000); // Wait for 2 seconds

        // Wait for the "Your reel has been shared" element to appear
        await page.waitForSelector('div[style="margin-bottom: 16px; margin-top: 16px;"] > div[style="opacity: 1;"] > span[dir="auto"]', { visible: true });
        console.log('Reel shared confirmation is visible.');
        await delay(1000); // Wait for 1 second

        // Close the browser
        await browser.close();
        console.log('Browser closed.');
        return true;
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

const { downloader } = require("./instagramVideoDownloader");

downloader("https://www.instagram.com/p/DFTgxfBMrrp/")
    .then((metaData) => {
        postVideo(metaData.videoFilePath, metaData.thumbnailFilePath, metaData.userName, "original");
    }).then(() => {
        console.log("video posted successfully");
    })
