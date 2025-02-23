// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const sidebar = document.querySelector('.sidebar');
const toggleSidebar = document.createElement('button'); // Add toggle button dynamically for mobile
toggleSidebar.className = 'toggle-sidebar-mobile';
toggleSidebar.textContent = '☰';
toggleSidebar.style.display = 'none'; // Hidden by default on desktop
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
        // Remove active class from all items
        menuItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');

        // Hide all cards and dashboard
        cards.forEach(card => card.classList.add('hidden'));
        dashboardCards.classList.add('hidden');

        // Show the corresponding section
        const section = item.getAttribute('data-section');
        if (section === 'dashboard') {
            dashboardCards.classList.remove('hidden');
        } else {
            const cardToShow = document.querySelector(`.${section}-card`);
            if (cardToShow) {
                cardToShow.classList.remove('hidden');
            }
        }

        // Collapse sidebar on mobile after clicking
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
        }
    });
});

// Dashboard Card Navigation
document.querySelectorAll('.dashboard-card').forEach(card => {
    card.addEventListener('click', () => {
        const section = card.getAttribute('data-section');
        menuItems.forEach(item => {
            if (item.getAttribute('data-section') === section) {
                item.click(); // Simulate clicking the corresponding menu item
            }
        });
    });
    card.querySelector('.dashboard-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the card click
        const section = card.getAttribute('data-section');
        menuItems.forEach(item => {
            if (item.getAttribute('data-section') === section) {
                item.click(); // Simulate clicking the corresponding menu item
            }
        });
    });
});

// Login Handling
let isLoggedIn = false;
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');
const uploadLoginRequired = document.getElementById('uploadLoginRequired');
const uploadForm = document.getElementById('uploadForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate login (replace with actual login logic)
    isLoggedIn = true;
    loginStatus.textContent = 'Logged in successfully';
    loginStatus.classList.add('logged-in');
    uploadLoginRequired.style.display = 'none';
    uploadForm.classList.remove('hidden');
});

// File Upload Handling
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', () => {
    fileInput.click();
});

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
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    dropZone.innerHTML = `Selected file: ${file.name}`;
}

// Download Form Handling
const downloadForm = document.getElementById('downloadForm');
downloadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your download logic here
    console.log('Downloading reel:', downloadForm.downloadUrl.value);
});

// Upload Form Handling
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add your upload logic here
    console.log('Uploading content');
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

// Initial check for mobile
if (window.innerWidth <= 768) {
    toggleSidebar.style.display = 'block';
    sidebar.classList.add('collapsed');
}