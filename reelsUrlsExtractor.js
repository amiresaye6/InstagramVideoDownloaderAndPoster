const puppeteer = require('puppeteer');
const fs = require('fs');

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports.getUrls = async (baseReelsUrl, localSave = false) => {
    const browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();

    // Load cookies if they exist
    if (fs.existsSync('cookies.json')) {
        const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
        await page.setCookie(...cookies);
        console.log('Cookies loaded from cookies.json.');
    } else {
        console.log('No cookies found. Please log in first.');
        await browser.close();
        return;
    }

    // Navigate to the base reels URL
    await page.goto(baseReelsUrl);
    await delay(2000); // Wait for the page to load

    let previousHeight;
    let scrollAttempts = 0;

    // Scroll until the end of the page
    while (true) {
        // Get the current scroll height
        previousHeight = await page.evaluate('document.body.scrollHeight');

        // Scroll down by one viewport height
        await page.evaluate('window.scrollBy(0, window.innerHeight)');
        await delay(2000); // Wait for new content to load

        // Get the new scroll height
        const newHeight = await page.evaluate('document.body.scrollHeight');

        // If the scroll height hasn't changed, we've reached the end
        if (newHeight === previousHeight) {
            console.log('Reached the end of the page.');
            break;
        }

        scrollAttempts++;
        console.log(`Scrolling for the ${scrollAttempts} time`);
    }

    // Extract reel URLs
    const reelUrls = await page.evaluate(() => {
        const urls = [];
        document.querySelectorAll('a[href*="/reel/"]').forEach((element) => {
            const href = element.getAttribute('href');
            if (href && href.includes('/reel/')) {
                urls.push(`https://www.instagram.com${href}`);
            }
        });
        return urls;
    });

    // Save the extracted URLs to a JSON file
    if (localSave) {
        fs.writeFileSync('reelsUrls.json', JSON.stringify(reelUrls, null, 2));
        console.log('Extracted Reel URLs:', reelUrls);
    }

    // Close the browser
    await browser.close();
    console.log('Done');
    return reelUrls;
};