conspuppeteer = require('puppeteer');
const fs = require('fs');

// Helper function to introduce delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports.getUrls = async (baseReelsUrl) => {
    const browser = await puppeteer.launch({ headless: false });

    let page = await browser.newPage();

    if (fs.existsSync('cookies.json')) {
        const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
        await page.setCookie(...cookies);
        console.log('Cookies loaded from cookies.json.');
    } else {
        console.log('No cookies found. Please log in first.');
        return;
    }

    await page.goto(baseReelsUrl);
    let i = 0

    while (i++ < 10) {
        await delay(1000)
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight); // Scroll down by one viewport height
        });
        console.log(`scrolling for the ${i} time`);

    }
    await delay(5000)
    const html = await page.content();
    fs.writeFileSync('fetched_html.html', html);

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
    fs.writeFileSync('reelsUrls.json', JSON.stringify(reelUrls, null, 2));
    console.log('Extracted Reel URLs:', reelUrls);
    browser.close()
    console.log("done");

}
