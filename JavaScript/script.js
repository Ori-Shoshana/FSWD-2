// JavaScript logic for login and registration
document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleToRegister = document.getElementById('toggle-register');
    const toggleToLogin = document.getElementById('toggle-login');

    const USERS_KEY = 'users';
    const CURRENT_PAGE_KEY = 'currentPage';
    const LOGGED_IN_USER_KEY = 'loggedInUser';

    const loadUsers = () => {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    };

    const saveUsers = (users) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    };

    const saveCurrentPage = (pageId) => {
        localStorage.setItem(CURRENT_PAGE_KEY, pageId);
    };

    const loadCurrentPage = () => {
        return localStorage.getItem(CURRENT_PAGE_KEY) || 'login-page';
    };

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

    window.addEventListener('popstate', (event) => {
        const pageId = event.state ? event.state.pageId : loadCurrentPage();
        showPage(pageId, false);
    });

    const users = loadUsers();
    const currentPage = loadCurrentPage();

    // Show the current page
    showPage(currentPage, false);

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.username === username);

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

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        if (username && email && password) {
            const userExists = users.some(u => u.username === username);

            if (userExists) {
                alert('Username already exists. Please try another.');
            } else {
                users.push({ username, email, password });
                saveUsers(users);
                alert('Registration successful! You can now log in.');
                toggleToLogin.click();
            }
        } else {
            alert('All fields are required for registration.');
        }
    });

    toggleToRegister.addEventListener('click', () => {
        showPage('register-page');
    });

    toggleToLogin.addEventListener('click', () => {
        showPage('login-page');
    });
});