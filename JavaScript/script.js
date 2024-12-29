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

    // Handle login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.username === username);

        if (!username || !password) {
            alert('Both fields are required.');
            return;
        }

        if (!user) {
            alert('User not found. Please register first.');
        } else if (user.password !== password) {
            alert('Incorrect password.');
        } else {
            alert(`Welcome back, ${user.username}!`);
            localStorage.setItem(LOGGED_IN_USER_KEY, user.username);
            window.location.href = 'HTML/home_page.html';
        }
    });

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
