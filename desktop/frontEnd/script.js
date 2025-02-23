// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const sidebar = document.querySelector('.sidebar');
const toggleSidebar = document.createElement('button');
toggleSidebar.className = 'toggle-sidebar-mobile';
toggleSidebar.textContent = '☰';
toggleSidebar.style.display = 'none';
document.querySelector('.header').appendChild(toggleSidebar);

// Sidebar Toggle for Mobile
toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Sidebar Navigation
const menuItems = document.querySelectorAll('.menu-item');
const dashboardCards = document.querySelector('.dashboard-cards');
const cards = document.querySelectorAll('.card');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        cards.forEach(card => card.classList.add('hidden'));
        dashboardCards.classList.add('hidden');
        const section = item.getAttribute('data-section');
        if (section === 'dashboard') {
            dashboardCards.classList.remove('hidden');
        } else {
            const cardToShow = document.querySelector(`.${section}-card`);
            if (cardToShow) cardToShow.classList.remove('hidden');
        }
        if (window.innerWidth <= 768) sidebar.classList.add('collapsed');
    });
});

// Dashboard Card Navigation
document.querySelectorAll('.dashboard-card').forEach(card => {
    card.addEventListener('click', () => {
        const section = card.getAttribute('data-section');
        menuItems.forEach(item => {
            if (item.getAttribute('data-section') === section) item.click();
        });
    });
    card.querySelector('.dashboard-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const section = card.getAttribute('data-section');
        menuItems.forEach(item => {
            if (item.getAttribute('data-section') === section) item.click();
        });
    });
});

// Login Handling
let isLoggedIn = false;
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');
const uploadLoginRequired = document.getElementById('uploadLoginRequired');
const uploadForm = document.getElementById('uploadForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.success) {
            isLoggedIn = true;
            loginStatus.textContent = 'Logged in successfully';
            loginStatus.classList.add('logged-in');
            uploadLoginRequired.style.display = 'none';
            uploadForm.classList.remove('hidden');
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// File Upload Handling
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#4f46e5';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '';
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
});

function handleFile(file) {
    dropZone.innerHTML = `Selected file: ${file.name}`;
}

// Download Form Handling
const downloadForm = document.getElementById('downloadForm');
downloadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('downloadUrl').value;
    try {
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });
        const data = await response.json();
        if (data.success) {
            alert(`Video downloaded to ${data.videoFilePath}`);
        } else {
            alert('Download failed: ' + data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Upload Form Handling
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
        alert('Please log in first!');
        return;
    }
    const reelUrl = document.getElementById('reelUrl').value;
    const caption = document.getElementById('caption').value;
    const file = fileInput.files[0];

    if (!file && !reelUrl) {
        alert('Please provide a video file or URL.');
        return;
    }

    const videoPath = file ? file.path : reelUrl; // Use file.path for local files in Electron
    const thumbnailPath = null; // Add thumbnail input if needed
    const dimensions = 'original';

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({reelUrl, videoPath, thumbnailPath, caption, dimensions }),
        });
        const data = await response.json();
        if (data.success) {
            alert('Video posted successfully!');
        } else {
            alert('Upload failed: ' + data.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

// Handle mobile responsiveness
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        toggleSidebar.style.display = 'block';
        sidebar.classList.add('collapsed');
    } else {
        toggleSidebar.style.display = 'none';
        sidebar.classList.remove('collapsed');
    }
});

if (window.innerWidth <= 768) {
    toggleSidebar.style.display = 'block';
    sidebar.classList.add('collapsed');
}