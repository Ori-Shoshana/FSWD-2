// JavaScript logic for handling logout, navigation, and user statistics
document.addEventListener('DOMContentLoaded', () => {
    // Handle Coming Soon buttons
    const comingSoonButtons = document.querySelectorAll('.coming-soon');
    const comingSoonMessage = document.getElementById('coming-soon-message'); // Message container

    comingSoonButtons.forEach(button => {
        button.addEventListener('click', () => {
            showComingSoonMessage('Coming Soon!');
        });
    });

    function showComingSoonMessage(message) {
        comingSoonMessage.textContent = message;
        comingSoonMessage.classList.remove('hidden');

        // Hide the message after 2.5 seconds
        setTimeout(() => {
            comingSoonMessage.classList.add('hidden');
        }, 2500);
    }

    const LOGGED_IN_USER_KEY = 'loggedInUser';
    const USER_STATS_KEY = 'userStats';

    // Logout functionality
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem(LOGGED_IN_USER_KEY);
        window.location.href = '/index.html';
    });

    const quizButton = document.getElementById('quiz-button');
    quizButton.addEventListener('click', () => {
        window.location.href = 'quiz_game.html';
    });

    const pixelButton = document.getElementById('pixel-button');
    pixelButton.addEventListener('click', () => {
        window.location.href = 'motion.html';
    });

    const profileButton = document.getElementById('profile-button');
    profileButton.addEventListener('click', () => {
        window.location.href = 'profile_page.html';
    });

    // Load user data and update the UI
    const loggedInUser = localStorage.getItem(LOGGED_IN_USER_KEY);
    const userNameElement = document.getElementById('user-name'); // Safely get the user-name element

    if (userNameElement && loggedInUser) {
        userNameElement.textContent = loggedInUser;
    }

    // Initialize user statistics if not present
    let userStats = JSON.parse(localStorage.getItem(USER_STATS_KEY)) || {};
    if (loggedInUser && !userStats[loggedInUser]) {
        userStats[loggedInUser] = {
            quizGame: { score: 0, highScore: 0 },
            motionGame: { score: 0, highScore: 0, level: 1, time: 0 }
        };
        localStorage.setItem(USER_STATS_KEY, JSON.stringify(userStats));
    }

    // Burger button toggle for the sidebar
    const burgerButton = document.getElementById('burger-button');
    const sidebar = document.getElementById('sidebar');

    burgerButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
});