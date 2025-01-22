const puppeteer = require('puppeteer');
const fs = require('fs');

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


module.exports = postVideo = async (videoPath, caption, dimentions_9_16 = true) => {
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
    if (dimentions_9_16) {
      try {
        await page.waitForSelector('svg[aria-label="Select crop"]', { visible: true });
        await page.click('svg[aria-label="Select crop"]');
        console.log('Button clicked successfully!');
        await delay(1000);

        await page.waitForSelector('svg[aria-label="Crop portrait icon"]', { visible: true });
        await page.click('svg[aria-label="Crop portrait icon"]');
        console.log('Button clicked successfully!');
        await delay(1000);
      } catch (error) {
        console.error('Failed to click the button:', error);
      }
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


    // this part needs modification, the caption is not being posted with the video.
    // Wait for the input field to appear
    // const inputSelector = 'div[aria-label="Write a caption..."][contenteditable="true"]';
    // await page.waitForSelector(inputSelector, { visible: true });

    // // Click the input field to focus it
    // await page.click(inputSelector);
    // await delay(1000);

    // // Type the caption
    // // await page.type(inputSelector, caption);
    // await page.type(inputSelector, "بسم الله الرحمن الرحيم");

    // // Trigger an input event to ensure the website registers the change
    // await page.evaluate((selector) => {
    //     const element = document.querySelector(selector);
    //     const event = new Event('input', { bubbles: true });
    //     element.dispatchEvent(event);
    // }, inputSelector);

    // await delay(2000); // Wait for the caption to be processed

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

    // Close the browser
    await delay(60000)
    await browser.close();
    console.log('Browser closed.');
  } catch (error) {
    console.error('An error occurred:', error);

  }
};
