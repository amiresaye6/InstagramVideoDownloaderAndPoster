// testAutomation.js
const sendMessage = require('./sendMessage');

// Get the current date and time
const currentDate = new Date().toLocaleString();

// Send the current date and time to Telegram
sendMessage(`Current date and time: ${currentDate}`)
    .then(() => {
        console.log('Date sent successfully.');
    })
    .catch((error) => {
        console.error('Failed to send date:', error);
    });