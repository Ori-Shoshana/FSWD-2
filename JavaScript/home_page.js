// JavaScript logic for handling logout and navigation
document.addEventListener('DOMContentLoaded', () => {
  const LOGGED_IN_USER_KEY = 'loggedInUser';

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
      window.location.href = 'profile.html';
  });

  // Load user data
  const loggedInUser = localStorage.getItem(LOGGED_IN_USER_KEY);
  if (loggedInUser) {
      document.getElementById('user-name').textContent = loggedInUser;
  } else {
      window.location.href = '/index.html';
  }

  // Burger button logic
  const burgerButton = document.getElementById('burger-button');
  const sidebar = document.getElementById('sidebar');
  burgerButton.addEventListener('click', () => {
      if (sidebar.style.right === '0px') {
          sidebar.style.right = '-250px';
      } else {
          sidebar.style.right = '0px';
      }
  });
});