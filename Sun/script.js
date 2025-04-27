// Import CryptoJS for encryption
import CryptoJS from 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';

// DOM Elements
const authSection = document.getElementById('auth-section');
const diarySection = document.getElementById('diary-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginTab = document.querySelector('[data-tab="login"]');
const registerTab = document.querySelector('[data-tab="register"]');
const entriesList = document.querySelector('.entries-list');
const entryEditor = document.querySelector('.entry-editor');
const newEntryBtn = document.getElementById('new-entry');
const saveEntryBtn = document.querySelector('.save-entry');
const cancelEntryBtn = document.querySelector('.cancel-entry');
const logoutBtn = document.getElementById('logout');
const entryTitle = document.querySelector('.entry-title');
const entryText = document.querySelector('.entry-text');
const moodSelect = document.querySelector('.mood-select');
const weatherSelect = document.querySelector('.weather-select');
const notificationContainer = document.createElement('div');
notificationContainer.className = 'notification-container';
document.body.appendChild(notificationContainer);

// Constants
const MIN_PASSWORD_LENGTH = 8;
const MAX_ENTRIES_PER_PAGE = 10;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// State Management
let currentUser = null;
let currentEntry = null;
let entries = [];
let autoSaveTimer = null;
let currentPage = 1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    setupAutoSave();
});

function initializeApp() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            showDiarySection();
            loadEntries();
        } catch (error) {
            showNotification('Error loading user data', 'error');
            handleLogout();
        }
    } else {
        showAuthSection();
    }
}

function setupEventListeners() {
    // Auth Event Listeners
    loginTab.addEventListener('click', () => switchAuthTab('login'));
    registerTab.addEventListener('click', () => switchAuthTab('register'));
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Diary Event Listeners
    newEntryBtn.addEventListener('click', createNewEntry);
    saveEntryBtn.addEventListener('click', saveEntry);
    cancelEntryBtn.addEventListener('click', () => {
        entryEditor.classList.add('hidden');
        clearAutoSave();
    });
    logoutBtn.addEventListener('click', handleLogout);

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });

    // Form validation
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateInput);
    });

    // Auto-save indicator
    entryText.addEventListener('input', () => {
        if (currentEntry) {
            showAutoSaveIndicator();
        }
    });
}

function setupAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }
    autoSaveTimer = setInterval(() => {
        if (currentEntry && entryText.value.trim()) {
            autoSaveEntry();
        }
    }, AUTO_SAVE_INTERVAL);
}

function clearAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
}

// Authentication Functions
function switchAuthTab(tab) {
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        showLoading('Logging in...');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username);

        if (user && verifyPassword(password, user.password)) {
            currentUser = { username };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDiarySection();
            loadEntries();
            showNotification('Login successful!', 'success');
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        showNotification(error.message || 'Login failed', 'error');
    } finally {
        hideLoading();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    try {
        validateRegistration(username, password, confirmPassword);
        showLoading('Creating account...');

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.username === username)) {
            throw new Error('Username already exists');
        }

        const hashedPassword = hashPassword(password);
        users.push({ username, password: hashedPassword });
        localStorage.setItem('users', JSON.stringify(users));

        currentUser = { username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showDiarySection();
        loadEntries();
        showNotification('Account created successfully!', 'success');
    } catch (error) {
        showNotification(error.message || 'Registration failed', 'error');
    } finally {
        hideLoading();
    }
}

function validateRegistration(username, password, confirmPassword) {
    if (!username || !password || !confirmPassword) {
        throw new Error('All fields are required');
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username can only contain letters, numbers, and underscores');
    }
}

function handleLogout() {
    try {
        clearAutoSave();
        currentUser = null;
        localStorage.removeItem('currentUser');
        showAuthSection();
        showNotification('Logged out successfully', 'success');
    } catch (error) {
        showNotification('Error during logout', 'error');
    }
}

// Diary Functions
function showAuthSection() {
    authSection.classList.remove('hidden');
    diarySection.classList.add('hidden');
}

function showDiarySection() {
    authSection.classList.add('hidden');
    diarySection.classList.remove('hidden');
}

function loadEntries() {
    try {
        const storedEntries = localStorage.getItem(`entries_${currentUser.username}`);
        if (storedEntries) {
            entries = JSON.parse(storedEntries);
            // Remove encryption for now to test loading
            entries = entries.map(entry => ({
                ...entry,
                text: entry.text // Remove decryption for now
            }));
            console.log('Entries loaded successfully:', entries);
        } else {
            entries = [];
        }
        renderEntries();
    } catch (error) {
        console.error('Error loading entries:', error);
        entries = [];
        showNotification('Error loading entries', 'error');
    }
}

function renderEntries() {
    try {
        entriesList.innerHTML = '';
        const startIndex = (currentPage - 1) * MAX_ENTRIES_PER_PAGE;
        const endIndex = startIndex + MAX_ENTRIES_PER_PAGE;
        const pageEntries = entries.slice(startIndex, endIndex);

        if (pageEntries.length === 0) {
            entriesList.innerHTML = '<div class="no-entries">No entries yet. Click "New Entry" to start writing!</div>';
            return;
        }

        pageEntries.forEach(entry => {
            const entryCard = document.createElement('div');
            entryCard.className = 'entry-card';
            
            // Format the date properly
            const entryDate = new Date(entry.date);
            const formattedDate = entryDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            entryCard.innerHTML = `
                <h3>${escapeHtml(entry.title)}</h3>
                <div class="entry-date">${formattedDate}</div>
                <div class="entry-preview">${escapeHtml(entry.text.substring(0, 100))}...</div>
                <div class="entry-meta">
                    <span><i class="fas fa-smile"></i> ${entry.mood}</span>
                    <span><i class="fas fa-cloud"></i> ${entry.weather}</span>
                </div>
            `;
            entryCard.addEventListener('click', () => editEntry(entry));
            entriesList.appendChild(entryCard);
        });

        renderPagination();
    } catch (error) {
        console.error('Error rendering entries:', error);
        showNotification('Error rendering entries', 'error');
    }
}

function renderPagination() {
    const totalPages = Math.ceil(entries.length / MAX_ENTRIES_PER_PAGE);
    if (totalPages <= 1) return;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderEntries();
        });
        pagination.appendChild(pageBtn);
    }
    
    entriesList.appendChild(pagination);
}

function createNewEntry() {
    currentEntry = null;
    entryTitle.value = '';
    entryText.value = '';
    moodSelect.value = 'happy';
    weatherSelect.value = 'sunny';
    entryEditor.classList.remove('hidden');
    setupAutoSave();
}

function editEntry(entry) {
    currentEntry = entry;
    entryTitle.value = entry.title;
    entryText.value = entry.text;
    moodSelect.value = entry.mood;
    weatherSelect.value = entry.weather;
    entryEditor.classList.remove('hidden');
    setupAutoSave();
}

function autoSaveEntry() {
    try {
        const title = entryTitle.value.trim();
        const text = entryText.value.trim();
        const mood = moodSelect.value;
        const weather = weatherSelect.value;

        if (!title || !text) return;

        const entry = {
            id: currentEntry?.id || Date.now().toString(),
            title,
            text: encryptText(text),
            mood,
            weather,
            date: currentEntry?.date || new Date().toISOString()
        };

        if (currentEntry) {
            const index = entries.findIndex(e => e.id === currentEntry.id);
            entries[index] = entry;
        } else {
            entries.unshift(entry);
        }

        const encryptedEntries = entries.map(e => ({
            ...e,
            text: encryptText(e.text)
        }));
        localStorage.setItem(`entries_${currentUser.username}`, JSON.stringify(encryptedEntries));
        
        showAutoSaveIndicator();
    } catch (error) {
        showNotification('Error auto-saving entry', 'error');
    }
}

function saveEntry() {
    try {
        const title = entryTitle.value.trim();
        const text = entryText.value.trim();
        const mood = moodSelect.value;
        const weather = weatherSelect.value;

        if (!title || !text) {
            throw new Error('Please fill in all fields');
        }

        const entry = {
            id: currentEntry?.id || Date.now().toString(),
            title,
            text: text, // Remove encryption for now to test saving
            mood,
            weather,
            date: currentEntry?.date || new Date().toISOString()
        };

        if (currentEntry) {
            const index = entries.findIndex(e => e.id === currentEntry.id);
            if (index !== -1) {
                entries[index] = entry;
            } else {
                entries.unshift(entry);
            }
        } else {
            entries.unshift(entry);
        }

        // Save to localStorage with error handling
        try {
            localStorage.setItem(`entries_${currentUser.username}`, JSON.stringify(entries));
            console.log('Entries saved successfully:', entries);
        } catch (storageError) {
            console.error('Error saving to localStorage:', storageError);
            // Fallback: Try to save a smaller number of entries
            const reducedEntries = entries.slice(0, 10);
            localStorage.setItem(`entries_${currentUser.username}`, JSON.stringify(reducedEntries));
        }

        entryEditor.classList.add('hidden');
        clearAutoSave();
        renderEntries();
        showNotification('Entry saved successfully!', 'success');
    } catch (error) {
        console.error('Error in saveEntry:', error);
        showNotification(error.message || 'Error saving entry', 'error');
    }
}

// Security Functions
function hashPassword(password) {
    const salt = CryptoJS.lib.WordArray.random(128/8);
    return CryptoJS.PBKDF2(password, salt, { keySize: 256/32 }).toString();
}

function verifyPassword(password, hashedPassword) {
    return hashPassword(password) === hashedPassword;
}

function encryptText(text) {
    const key = CryptoJS.enc.Utf8.parse(currentUser.username);
    const iv = CryptoJS.lib.WordArray.random(128/8);
    return CryptoJS.AES.encrypt(text, key, { iv }).toString();
}

function decryptText(encryptedText) {
    const key = CryptoJS.enc.Utf8.parse(currentUser.username);
    const iv = CryptoJS.lib.WordArray.random(128/8);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                        type === 'error' ? 'fa-exclamation-circle' : 
                        'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function showLoading(message) {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-message">${message}</div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.remove();
    }
}

function showAutoSaveIndicator() {
    const indicator = document.querySelector('.auto-save-indicator') || document.createElement('div');
    indicator.className = 'auto-save-indicator';
    indicator.innerHTML = '<i class="fas fa-save"></i> Auto-saving...';
    if (!document.querySelector('.auto-save-indicator')) {
        entryEditor.appendChild(indicator);
    }
    setTimeout(() => indicator.remove(), 2000);
}

function validateInput(e) {
    const input = e.target;
    if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('invalid');
    } else {
        input.classList.remove('invalid');
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
} 