const puppeteer = require('puppeteer');
const fs = require('fs');

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


module.exports.postVideo = async (videoPath, caption) => {
  let page;

  try {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true }); // set headless to false if you want to see the web page.
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

    // Wait for the video processing to complete
    // const videoProcessingSelector = 'div[aria-label="Video processing"]'; // Selector for the video processing indicator
    // await page.waitForSelector(videoProcessingSelector, { visible: true, timeout: 30000 });
    // console.log('Video processing started.');

    // Wait for the video processing to finish
    // await page.waitForFunction(() => {
    //   const processingIndicator = document.querySelector('div[aria-label="Video processing"]');
    //   return !processingIndicator; // Wait until the processing indicator disappears
    // }, { timeout: 300000 }); // Wait up to 5 minutes for video processing
    // console.log('Video processing completed.');

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

    // Wait for the "Create new post" modal to appear
    const createPostModalSelector = 'div[role="dialog"][aria-label="Create new post"]';
    await page.waitForSelector(createPostModalSelector, { visible: true, timeout: 30000 });
    console.log('Create new post modal loaded.');

    // Add a caption
    const captionInputSelector = 'div[aria-label="Write a caption..."]';
    await page.waitForSelector(captionInputSelector, { visible: true, timeout: 30000 });
    console.log('Caption input field loaded.');


    // Set the caption using JavaScript
    await page.evaluate((selector, caption) => {
      const captionInput = document.querySelector(selector);
      if (captionInput) {
        // Set the caption text
        captionInput.textContent = caption;

        // Trigger input, change, and blur events
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });
        const blurEvent = new Event('blur', { bubbles: true });

        captionInput.dispatchEvent(inputEvent);
        captionInput.dispatchEvent(changeEvent);
        captionInput.dispatchEvent(blurEvent);

        console.log('Caption set and events triggered.');
      } else {
        console.error('Caption input field not found!');
      }
    }, captionInputSelector, caption);

    await delay(1000); // Wait for 1 second to ensure the caption is processed

    // Debug: Log the value of the caption input field
    const captionValue = await page.evaluate((selector) => {
      const captionInput = document.querySelector(selector);
      return captionInput ? captionInput.textContent : 'Caption input not found!';
    }, captionInputSelector);
    console.log('Caption value after setting:', captionValue);

    // Click the "Share" button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Create new post"] div[role="button"]');
      const shareButton = Array.from(buttons).find(button => button.textContent.trim() === 'Share');
      if (shareButton) {
        shareButton.click();
      }
    });
    console.log('Clicked the "Share" button.');
    await delay(2000); // Wait for 5 seconds

    // Optional: Take a screenshot of the post confirmation
    // await page.screenshot({ path: 'post_confirmation.png' });
    // console.log('Screenshot of post confirmation taken.');

    // Close the browser
    await delay(60000)
    await browser.close();
    console.log('Browser closed.');
  } catch (error) {
    console.error('An error occurred:', error);

    // Debug: Take a screenshot on error
    // if (page) {
    //   await page.screenshot({ path: 'error_screenshot.png' });
    //   console.log('Screenshot taken on error.');
    // }
  }
};