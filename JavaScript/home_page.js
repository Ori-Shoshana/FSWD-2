// JavaScript logic for handling logout, navigation, and user statistics
document.addEventListener('DOMContentLoaded', () => {
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

    const motionButton = document.getElementById('motion-button');
    motionButton.addEventListener('click', () => {
        window.location.href = 'motion_game.html';
    });

    const profileButton = document.getElementById('profile-button');
    profileButton.addEventListener('click', () => {
        window.location.href = 'profile_page.html';
    });

    // Load user data and update the UI
    const loggedInUser = localStorage.getItem(LOGGED_IN_USER_KEY);
    const userNameElement = document.getElementById('user-name'); // Safely get the user-name element

    if (userNameElement) { // Check if the element exists
        if (loggedInUser) {
            userNameElement.textContent = loggedInUser;
        } else {
            window.location.href = '/index.html'; // Redirect if no user is logged in
        }
    }

    // Initialize user statistics if not present
    let userStats = JSON.parse(localStorage.getItem(USER_STATS_KEY)) || {};
    if (!userStats[loggedInUser]) {
        userStats[loggedInUser] = {
            quizGame: { score: 0, highScore: 0 },
            motionGame: { score: 0, highScore: 0 }
        };
        localStorage.setItem(USER_STATS_KEY, JSON.stringify(userStats));
    }

    // Burger button toggle for the sidebar
    const burgerButton = document.getElementById('burger-button');
    const sidebar = document.getElementById('sidebar');

    burgerButton.addEventListener('click', () => {
        const currentRight = getComputedStyle(sidebar).getPropertyValue('right');
        if (currentRight === '0px') {
            sidebar.style.right = '-250px'; // Close the sidebar
        } else {
            sidebar.style.right = '0px'; // Open the sidebar
        }
    });
});