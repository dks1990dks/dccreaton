

document.addEventListener("DOMContentLoaded", () => {
  // Switching between Login and Register Forms
  document.getElementById("login-btn")?.addEventListener("click", () => {
    document.getElementById("login-form").classList.add("active");
    document.getElementById("register-form").classList.remove("active");
  });

  document.getElementById("register-btn")?.addEventListener("click", () => {
    document.getElementById("register-form").classList.add("active");
    document.getElementById("login-form").classList.remove("active");
  });

   // Forgot Password Modal Logic
   const forgotPasswordLink = document.getElementById("forgot-password-link");
   const forgotPasswordModal = document.getElementById("forgot-password-modal");
   const closeForgotPasswordModal = document.getElementById("close-forgot-password-modal");
   
   forgotPasswordLink?.addEventListener("click", (event) => {
     event.preventDefault();
     
     // Show forgot password modal
     if (forgotPasswordModal) {
       forgotPasswordModal.style.display = "flex"; // Ensure modal is visible
     }
   });
   
   closeForgotPasswordModal?.addEventListener("click", () => {
     // Hide the modal when clicking the close button
     if (forgotPasswordModal) {
       forgotPasswordModal.style.display = "none";
     }
   });
   
   // Close modal if clicked outside
   window.addEventListener("click", (event) => {
     if (event.target === forgotPasswordModal) {
       forgotPasswordModal.style.display = "none"; // Close modal if clicked outside
     }
   });
   
  // Login Modal Close
  const loginModal = document.getElementById("login-modal");
  const closeLoginModal = document.getElementById("close-modal");

  closeLoginModal?.addEventListener("click", () => {
    if (loginModal) {
      loginModal.style.display = "none"; // Hide the Login modal
    }
  });

  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none"; // Hide if clicking outside the modal
    }
  });
});

const userNav = document.getElementById("user-nav");
const API_URL = "https://dc-1-fqlb.onrender.com"; // Replace with your backend URL

// Decode JWT and return user info
function getUserFromToken() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return payload; // { id, email, name, etc. }
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}

// Save JWT to localStorage
function saveToken(token) {
  localStorage.setItem("jwtToken", token);
}

// Update navigation based on login status
function updateNav() {
  const user = getUserFromToken();
  const userNav = document.getElementById("user-nav");

  if (!userNav) return; // Ensure `userNav` exists

  if (user) {
    // User is logged in
    userNav.innerHTML = `
      <a href="#" id="my-account-link">My Account</a>
      <ul class="dropdown-menu">
        <li><a href="myaccount.html">Account</a></li>
        <li><a href="#" id="logout-link">Logout</a></li>
      </ul>
    `;
  
    const myAccountLink = document.getElementById("my-account-link");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const logoutLink = document.getElementById("logout-link");
  
    // Toggle dropdown on click of My Account link
    myAccountLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default behavior (e.g., navigating)
  
      // Toggle the visibility of the dropdown menu
      if (dropdownMenu.style.display === "none" || dropdownMenu.style.display === "") {
        dropdownMenu.style.display = "block"; // Show the dropdown
      } else {
        dropdownMenu.style.display = "none"; // Hide the dropdown
      }
    });
  
    // Close dropdown if clicking outside
    document.addEventListener("click", (event) => {
      if (
        dropdownMenu &&
        !myAccountLink.contains(event.target) &&
        !dropdownMenu.contains(event.target)
      ) {
        dropdownMenu.style.display = "none"; // Hide the dropdown
      }
    });
    

  
    // Logout functionality
    if (logoutLink) {
      logoutLink.addEventListener("click", () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userCart"); // Clear cart if needed

        alert("You have successfully logged out.");
        window.location.reload();
      });
    }
  } else {
    // User is not logged in
    userNav.innerHTML = `<a href="#" id="login-link">Login</a>`;
    const loginLink = document.getElementById("login-link");

    if (loginLink) {
      loginLink.addEventListener("click", () => {
        const loginModal = document.getElementById("login-modal");
        if (loginModal) loginModal.style.display = "block";
      });
    }
  }
}

// Login functionality
document.getElementById("login-submit")?.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.userId && data.token) {
      // Successful login
      localStorage.setItem("userId", data.userId);
      saveToken(data.token);
      alert("Login successful!");
      const loginModal = document.getElementById("login-modal");
      if (loginModal) loginModal.style.display = "none";
      window.location.reload();
    } else {
      alert(`Login failed: ${data.message || "Invalid credentials."}`);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred. Please try again.");
  }
});

// Register functionality
document.getElementById("register-submit")?.addEventListener("click", async () => {
  const fullName = document.getElementById("register-name").value.trim(); // Use fullName
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!fullName || !email || !password) {
    alert("All fields are required.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }), // Send fullName
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful!");
      const loginModal = document.getElementById("login-modal");
      if (loginModal) loginModal.style.display = "none";
      window.location.reload();
    } else {
      alert(`Registration failed: ${data.message || "Invalid input."}`);
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred. Please try again.");
  }
});

// Show Forgot Password Modal
document.getElementById('forgot-password-link')?.addEventListener('click', () => {
  const forgotPasswordModal = document.getElementById('forgot-password-modal');
  if (forgotPasswordModal) forgotPasswordModal.style.display = 'block';
});

// Submit Forgot Password Request
document.getElementById('reset-password-submit')?.addEventListener('click', async () => {
  const email = document.getElementById('reset-email').value.trim();

  if (!email) {
    alert('Please enter your email.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Reset link sent to your email.');
      document.getElementById('forgot-password-modal').style.display = 'none';
    } else {
      alert(`Error: ${data.message || 'Failed to send reset link.'}`);
    }
  } catch (error) {
    console.error('Error during forgot password:', error);
    alert('An error occurred. Please try again.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Open the Forgot Password Modal
  document.getElementById('forgot-password-link')?.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    if (forgotPasswordModal) {
      forgotPasswordModal.style.display = 'block'; // Show the Forgot Password modal
    } else {
      console.error('Forgot Password Modal not found!');
    }
  });

  // Close the Forgot Password Modal
  document.getElementById('close-forgot-password-modal')?.addEventListener('click', () => {
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    if (forgotPasswordModal) {
      forgotPasswordModal.style.display = 'none'; // Hide the Forgot Password modal
    }
  });

  // Close modal when clicking outside of it
  window.addEventListener('click', (event) => {
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    if (event.target === forgotPasswordModal) {
      forgotPasswordModal.style.display = 'none'; // Hide modal
    }
  });
});



// Update navigation on page load
document.addEventListener("DOMContentLoaded", updateNav);
