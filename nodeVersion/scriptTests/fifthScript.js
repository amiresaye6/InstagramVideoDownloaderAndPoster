const puppeteer = require('puppeteer');
const fs = require('fs');

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

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
  const cropModalSelector = 'div[aria-label="Crop"][role="dialog"]'; // Selector for the crop modal
  await page.waitForSelector(cropModalSelector);
  console.log('Crop modal loaded.');

  // Wait for the "Next" button to appear
  const nextButtonSelector = 'div[role="button"] >> text="Next"'; // Selector for the "Next" button
  await page.waitForSelector(nextButtonSelector, { timeout: 10000 }); // Wait up to 10 seconds
  console.log('Next button found.');

  // Debug: Log the "Next" button's HTML
  const nextButton = await page.$(nextButtonSelector);
  if (nextButton) {
    console.log('Next button HTML:', await nextButton.evaluate(el => el.outerHTML));
  } else {
    console.log('Next button not found!');
  }

  // Click the "Next" button
  await delay(3000); // Wait for 3 seconds
  await page.click(nextButtonSelector);
  console.log('Clicked the "Next" button.');
  await delay(3000); // Wait for 3 seconds

  // Wait for the edit modal to appear
  const editModalSelector = 'div[aria-label="Edit"][role="dialog"]'; // Selector for the edit modal
  await page.waitForSelector(editModalSelector);
  console.log('Edit modal loaded.');

  // Click the "Next" button again to proceed
  await page.waitForSelector(nextButtonSelector);
  await page.click(nextButtonSelector);
  console.log('Clicked the "Next" button again.');
  await delay(3000); // Wait for 3 seconds

  // Wait for the caption input field to appear
  const captionInputSelector = 'textarea[aria-label="Write a caption…"]'; // Selector for the caption input
  await page.waitForSelector(captionInputSelector);
  console.log('Caption input field loaded.');

  // Add a caption (optional)
  const caption = "(بِسْمِ اللهِ الرَّحْمنِ الرَّحِيمِ )"; // Replace with your caption
  await page.type(captionInputSelector, caption);
  console.log('Caption added.');
  await delay(2000); // Wait for 2 seconds

  // Wait for the final post creation modal to appear
  const postCreationModalSelector = 'div[aria-label="Create new post"][role="dialog"]'; // Selector for the final modal
  await page.waitForSelector(postCreationModalSelector);
  console.log('Final post creation modal loaded.');

  // Click the "Share" button to post the image
  const shareButtonSelector = 'div[role="button"]:has-text("Share")'; // Selector for the "Share" button
  await page.waitForSelector(shareButtonSelector);
  await page.click(shareButtonSelector);
  console.log('Clicked the "Share" button.');
  await delay(5000); // Wait for 5 seconds

  // Optional: Take a screenshot of the post confirmation
  await page.screenshot({ path: 'instagram_post_confirmation.png' });
  console.log('Screenshot of post confirmation taken.');

  // Close the browser
  await browser.close();
  console.log('Browser closed.');
})();