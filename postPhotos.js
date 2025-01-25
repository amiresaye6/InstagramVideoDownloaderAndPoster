const puppeteer = require('puppeteer');
const fs = require('fs');

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  let page; // Declare page outside the try-catch block

  try {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: false });
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
    await delay(3000); // Wait for 3 seconds

    // Click the "Create" button to open the post creation modal
    const createButtonSelector = 'svg[aria-label="New post"]'; // Selector for the "Create" button
    await page.waitForSelector(createButtonSelector);
    await page.click(createButtonSelector);
    console.log('Clicked the "Create" button.');
    await delay(3000); // Wait for 3 seconds

    // Wait for the file input element to appear
    const fileInputSelector = 'input[type="file"]'; // Selector for the file input
    await page.waitForSelector(fileInputSelector);
    console.log('File input field loaded.');

    // Upload the image
    const imagePath = 'besmAllah.jpg'; // Replace with the path to your image
    const fileInput = await page.$(fileInputSelector);
    await fileInput.uploadFile(imagePath);
    console.log('Image uploaded.');
    await delay(3000); // Wait for 3 seconds

    // Wait for the crop modal to appear
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
    await delay(3000); // Wait for 3 seconds

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
    await delay(3000); // Wait for 3 seconds

    // Wait for the "Create new post" modal to appear
    const createPostModalSelector = 'div[role="dialog"][aria-label="Create new post"]';
    await page.waitForSelector(createPostModalSelector, { visible: true, timeout: 30000 });
    console.log('Create new post modal loaded.');

    // Add a caption
    const captionInputSelector = 'div[aria-label="Write a caption..."]';
    await page.waitForSelector(captionInputSelector, { visible: true, timeout: 30000 });
    console.log('Caption input field loaded.');

    const caption = "(بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ )"; // Replace with your caption
    await page.type(captionInputSelector, caption);
    console.log('Caption added.');
    await delay(3000); // Wait for 3 seconds

    // Debug: Log the HTML of the "Share" button
    const shareButtonHTML = await page.evaluate(() => {
      const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Create new post"] div[role="button"]');
      const shareButton = Array.from(buttons).find(button => button.textContent.trim() === 'Share');
      return shareButton ? shareButton.outerHTML : 'Share button not found!';
    });
    console.log('Share button HTML:', shareButtonHTML);

    // Debug: Check if the "Share" button is visible and enabled
    const isShareButtonVisible = await page.evaluate(() => {
      const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Create new post"] div[role="button"]');
      const shareButton = Array.from(buttons).find(button => button.textContent.trim() === 'Share');
      return shareButton && shareButton.offsetParent !== null; // Check if the button is visible
    });
    console.log('Is Share button visible?', isShareButtonVisible);

    const isShareButtonEnabled = await page.evaluate(() => {
      const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Create new post"] div[role="button"]');
      const shareButton = Array.from(buttons).find(button => button.textContent.trim() === 'Share');
      return shareButton && !shareButton.disabled; // Check if the button is enabled
    });
    console.log('Is Share button enabled?', isShareButtonEnabled);

    // Click the "Share" button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('div[role="dialog"][aria-label="Create new post"] div[role="button"]');
      const shareButton = Array.from(buttons).find(button => button.textContent.trim() === 'Share');
      if (shareButton) {
        shareButton.click();
      }
    });
    console.log('Clicked the "Share" button.');
    await delay(5000); // Wait for 5 seconds

    // Optional: Take a screenshot of the post confirmation
    await page.screenshot({ path: 'post_confirmation.png' });
    console.log('Screenshot of post confirmation taken.');

    // Close the browser
    await browser.close();
    console.log('Browser closed.');
  } catch (error) {
    console.error('An error occurred:', error);

    // Debug: Take a screenshot on error
    if (page) {
      await page.screenshot({ path: 'error_screenshot.png' });
      console.log('Screenshot taken on error.');
    }
  }
})();