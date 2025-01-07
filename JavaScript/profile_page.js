document.addEventListener('DOMContentLoaded', () => {
  const LOGGED_IN_USER_KEY = 'loggedInUser';
  const USER_STATS_KEY = 'userStats';

  const loggedInUser = localStorage.getItem(LOGGED_IN_USER_KEY);
  // take the users from the local storage and parse it to an array of objects
  const users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
  const userStats = JSON.parse(localStorage.getItem(USER_STATS_KEY)) || {};

  if (loggedInUser && userStats[loggedInUser]) {
      document.getElementById('user-name').textContent = loggedInUser;
      // the user with username: ${loggedInUser} is logged in
      document.getElementById('user-email').textContent = users.find(user => user.username === loggedInUser).email;

      document.getElementById('quiz-high-score').textContent = userStats[loggedInUser].quizGame.highScore;
      document.getElementById('quiz-best-time').textContent = userStats[loggedInUser].quizGame.bestTime || 'N/A';

      document.getElementById('motion-high-score').textContent = userStats[loggedInUser].motionGame.highScore;
      document.getElementById('motion-best-time').textContent = userStats[loggedInUser].motionGame.time || 'N/A';
  } else {
      window.location.href = '/index.html'; // Redirect if no user is logged in
  }
});