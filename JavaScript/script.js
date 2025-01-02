document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleToRegister = document.getElementById('toggle-register');
    const toggleToLogin = document.getElementById('toggle-login');

    const USERS_KEY = 'users';
    const CURRENT_PAGE_KEY = 'currentPage';
    const LOGGED_IN_USER_KEY = 'loggedInUser';

    // Utility functions to handle localStorage
    const loadUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const saveCurrentPage = (pageId) => localStorage.setItem(CURRENT_PAGE_KEY, pageId);
    const loadCurrentPage = () => localStorage.getItem(CURRENT_PAGE_KEY) || 'login-page';
    const BLOCKED_USERS_KEY = 'blockedUsers';

    const loadBlockedUsers = () => JSON.parse(localStorage.getItem(BLOCKED_USERS_KEY)) || [];
    const saveBlockedUsers = (blockedUsers) => localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blockedUsers));

    // Function to toggle between pages
    const showPage = (pageId, pushState = true) => {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
        saveCurrentPage(pageId);
        if (pushState) {
            history.pushState({ pageId }, '', `#${pageId}`);
        }
    };

    // Handle back/forward browser navigation
    window.addEventListener('popstate', (event) => {
        const pageId = event.state?.pageId || loadCurrentPage();
        showPage(pageId, false);
    });

    // Load initial state
    const users = loadUsers();
    showPage(loadCurrentPage(), false);

    let failedAttempts = 0;
    const MAX_ATTEMPTS_FOR_COOLDOWN = 3; // מספר ניסיונות לפני Cooldown
    const MAX_ATTEMPTS_FOR_LOCK = 5; // מספר ניסיונות לפני Lock לצמיתות
    const COOLDOWN_TIME = 30; // seconds

    // Handle login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const loginButton = loginForm.querySelector('button');

        const user = users.find(u => u.username === username);
        const blockedUsers = loadBlockedUsers();

        // בדיקת משתמש חסום
        if (blockedUsers.includes(username)) {
            alert('Your account is permanently blocked due to too many failed attempts.');
            return;
        }

        if (!username || !password) {
            alert('Both fields are required.');
            return;
        }

        if (!user) {
            alert('User not found. Please register first.');
        } else if (user.password !== password) {
            failedAttempts++;

            // מנגנון Cooldown
            if (failedAttempts >= MAX_ATTEMPTS_FOR_COOLDOWN && failedAttempts < MAX_ATTEMPTS_FOR_LOCK) {
                alert(`Too many failed attempts. Please wait ${COOLDOWN_TIME} seconds.`);
                startCooldown(loginButton);
                return;
            }

            // מנגנון Lock
            if (failedAttempts >= MAX_ATTEMPTS_FOR_LOCK) {
                blockedUsers.push(username); // הוספת המשתמש לרשימת החסומים
                saveBlockedUsers(blockedUsers);
                alert('Your account has been permanently blocked due to too many failed attempts.');
                return;
            }

            alert('Incorrect password.');
        } else {
            failedAttempts = 0; // איפוס ניסיונות שגויים לאחר התחברות מוצלחת
            alert(`Welcome back, ${user.username}!`);
            localStorage.setItem(LOGGED_IN_USER_KEY, user.username);
            window.location.href = 'HTML/home_page.html';
        }
    });

    // Start cooldown timer
    function startCooldown(button) {
        button.disabled = true;

        let remainingTime = COOLDOWN_TIME;
        const cooldownInterval = setInterval(() => {
            button.textContent = `Wait ${remainingTime--}s`;
            if (remainingTime < 0) {
                clearInterval(cooldownInterval);
                button.disabled = false;
                button.textContent = 'Login';
                failedAttempts = 0; // Reset failed attempts after cooldown
            }
        }, 1000);
    }

    // Handle registration form submission
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;

        if (!username || !email || !password) {
            alert('All fields are required for registration.');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert('Invalid email format.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        if (users.some(u => u.username === username)) {
            alert('Username already exists. Please try another.');
            return;
        }

        users.push({ username, email, password });
        saveUsers(users);
        alert('Registration successful! You can now log in.');
        toggleToLogin.click();
    });

    // Toggle between login and registration forms
    toggleToRegister.addEventListener('click', () => {
        showPage('register-page');
    });

    toggleToLogin.addEventListener('click', () => {
        showPage('login-page');
    });
});
