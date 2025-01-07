document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const toggleToRegister = document.getElementById("toggle-register");
  const toggleToLogin = document.getElementById("toggle-login");

  const USERS_KEY = "users";
  const CURRENT_PAGE_KEY = "currentPage";
  const LOGGED_IN_USER_KEY = "loggedInUser";

  // Utility functions to handle localStorage
  const loadUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const saveUsers = (users) =>
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  const saveCurrentPage = (pageId) =>
    localStorage.setItem(CURRENT_PAGE_KEY, pageId);
  const loadCurrentPage = () =>
    localStorage.getItem(CURRENT_PAGE_KEY) || "login-page";
  const BLOCKED_USERS_KEY = "blockedUsers";

  const loadBlockedUsers = () =>
    JSON.parse(localStorage.getItem(BLOCKED_USERS_KEY)) || [];
  const saveBlockedUsers = (blockedUsers) =>
    localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blockedUsers));

  function showMessage(message, isSuccess = false) {
    const messageDiv = document.getElementById("login-message");
    messageDiv.textContent = message;
    messageDiv.className = isSuccess ? "message success" : "message";
    messageDiv.style.display = "block";
  }
  document
    .querySelectorAll("#login-username, #login-password")
    .forEach((input) => {
      input.addEventListener("input", () => {
        document.getElementById("login-message").style.display = "none";
      });
    });

  // פונקציה ליצירת Cookie
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  // פונקציה לקריאת Cookie
  function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        return value;
      }
    }
    return null;
  }

  // פונקציה לבדוק אם משתמש חסום
  function isUserBlocked(username) {
    return getCookie(`${username}_blocked`) === "true";
  }

  // Function to toggle between pages
  const showPage = (pageId, pushState = true) => {
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.add("hidden");
    });
    document.getElementById(pageId).classList.remove("hidden");
    saveCurrentPage(pageId);
    if (pushState) {
      history.pushState({ pageId }, "", `#${pageId}`);
    }
  };

  // Handle back/forward browser navigation
  window.addEventListener("popstate", (event) => {
    const pageId = event.state?.pageId || loadCurrentPage();
    showPage(pageId, false);
  });

  // Load initial state
  const users = loadUsers();
  showPage(loadCurrentPage(), false);

  let failedAttempts = 0;
  const MAX_ATTEMPTS_FOR_COOLDOWN = 3; // מספר ניסיונות לפני Cooldown
  const MAX_ATTEMPTS_FOR_LOCK = 5; // מספר ניסיונות לפני Lock לצמיתות
  const COOLDOWN_TIME = 3; // seconds

  // Handle login form submission
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const loginButton = loginForm.querySelector("button");

    const user = users.find((u) => u.username === username);

    // בדיקת חסימה עם Cookie
    if (isUserBlocked(username)) {
      showMessage(
        "Your account is blocked for 24 hours due to too many failed attempts."
      );
      return;
    }

    if (!username || !password) {
      showMessage("Both fields are required.");
      return;
    }

    if (!user) {
      showMessage("User not found. Please register first.");
    } else if (user.password !== password) {
      failedAttempts++;

      // מנגנון Cooldown
      if (
        failedAttempts >= MAX_ATTEMPTS_FOR_COOLDOWN &&
        failedAttempts < MAX_ATTEMPTS_FOR_LOCK
      ) {
        showMessage(
          `Too many failed attempts. Please wait ${COOLDOWN_TIME} seconds.`
        );
        startCooldown(loginButton);
        return;
      }

      // מנגנון Lock עם Cookie
      if (failedAttempts >= MAX_ATTEMPTS_FOR_LOCK) {
        setCookie(`${username}_blocked`, "true", 1); // חסימה ל-24 שעות
        showMessage(
          "Your account is blocked for 24 hours due to too many failed attempts."
        );
        return;
      }
      showMessage("Incorrect password.");
    } else {
      failedAttempts = 0; // איפוס הניסיונות רק בהתחברות מוצלחת
      showMessage(`Welcome back, ${user.username}! Redirecting...`, true); // Show a success message
      localStorage.setItem(LOGGED_IN_USER_KEY, user.username);

      // Add a delay before redirecting
      setTimeout(() => {
        window.location.href = "HTML/home_page.html";
      }, 1500); // 1.5 seconds delay
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
        button.textContent = "Login";
      }
    }, 1000);
  }

  // Handle registration form submission
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;

    if (!username || !email || !password) {
      alert("All fields are required for registration.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (users.some((u) => u.username === username)) {
      alert("Username already exists. Please try another.");
      return;
    }

    // Add the new user
    const newUser = { username, email, password };
    users.push(newUser);
    saveUsers(users);

    // Automatically log the user in
    localStorage.setItem(LOGGED_IN_USER_KEY, username);
    alert(`Welcome, ${username}! You are now registered and logged in.`);

    // Redirect to the home page
    window.location.href = "HTML/home_page.html";
  });

  // Toggle between login and registration forms
  toggleToRegister.addEventListener("click", () => {
    showPage("register-page");
  });

  toggleToLogin.addEventListener("click", () => {
    showPage("login-page");
  });
});
