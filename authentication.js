import { AUTH_SETTINGS } from './config.js';
import { showSection } from './navigation.js';

// Enhanced email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to find user by email
function findUserByEmail(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const userKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(AUTH_SETTINGS.STORAGE_KEY + '_'));

  return userKeys.find(key => {
    const userProfile = JSON.parse(localStorage.getItem(key));
    return userProfile.email.toLowerCase().trim() === normalizedEmail;
  });
}

function isEmailUnique(email) {
  // Validate email format first
  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return false;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUserKey = findUserByEmail(normalizedEmail);
  
  if (existingUserKey) {
    alert('An account with this email is already registered. Please use a different email.');
    return false;
  }
  
  return true;
}

// Simulated email sending function (to be replaced with actual email service)
function sendPasswordResetEmail(email, resetToken) {
  // In a real-world scenario, this would use an actual email service API
  console.log(`Password Reset Email Sent to ${email}`);
  console.log(`Reset Token: ${resetToken}`);
  
  // Store reset token with expiration
  const resetData = {
    email: email.toLowerCase().trim(),
    token: resetToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  localStorage.setItem(`reset_token_${email.toLowerCase().trim()}`, JSON.stringify(resetData));
  
  // Simulate email notification
  alert(`A password reset link has been sent to ${email}. Check your email inbox.`);
}

function generateResetToken() {
  // Generate a more secure, unique reset token
  return crypto.randomUUID(); // Modern, cryptographically secure UUID
}

function initiatePasswordReset(email) {
  // Validate email format
  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return false;
  }

  const existingUserKey = findUserByEmail(email);

  if (existingUserKey) {
    const resetToken = generateResetToken();
    sendPasswordResetEmail(email, resetToken);
    return true;
  } else {
    alert('No account found with this email address.');
    return false;
  }
}

function validateResetToken(email, token) {
  const storedResetData = localStorage.getItem(`reset_token_${email.toLowerCase().trim()}`);
  
  if (!storedResetData) return false;

  const resetData = JSON.parse(storedResetData);
  
  // Check token validity and expiration
  const isValidToken = resetData.token === token;
  const isTokenExpired = Date.now() > resetData.expiresAt;
  
  return isValidToken && !isTokenExpired;
}

function resetPassword(email, newPassword, token) {
  // Validate reset token first
  if (!validateResetToken(email, token)) {
    alert('Invalid or expired reset token.');
    return false;
  }

  // Validate password
  if (newPassword.length < AUTH_SETTINGS.MIN_PASSWORD_LENGTH || 
      newPassword.length > AUTH_SETTINGS.MAX_PASSWORD_LENGTH) {
    alert(`Password must be ${AUTH_SETTINGS.MIN_PASSWORD_LENGTH}-${AUTH_SETTINGS.MAX_PASSWORD_LENGTH} characters`);
    return false;
  }

  // Find and update user profile
  const userKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(AUTH_SETTINGS.STORAGE_KEY + '_'));

  const userKey = userKeys.find(key => {
    const userProfile = JSON.parse(localStorage.getItem(key));
    return userProfile.email.toLowerCase().trim() === email.toLowerCase().trim();
  });

  if (userKey) {
    // In a real app, you'd hash the password
    const userProfile = JSON.parse(localStorage.getItem(userKey));
    
    // Update user profile (normally, you'd store a hashed password)
    localStorage.setItem(userKey, JSON.stringify({
      ...userProfile,
      password: newPassword  // In a real app, use password hashing
    }));

    // Clear reset token
    localStorage.removeItem(`reset_token_${email.toLowerCase().trim()}`);

    alert('Password successfully reset. You can now log in with your new password.');
    return true;
  }

  return false;
}

function registerUser(username, password, email) {
  // Normalize email
  email = email.toLowerCase().trim();

  // Validate input
  if (username.length < AUTH_SETTINGS.MIN_USERNAME_LENGTH || 
      username.length > AUTH_SETTINGS.MAX_USERNAME_LENGTH) {
    alert(`Username must be ${AUTH_SETTINGS.MIN_USERNAME_LENGTH}-${AUTH_SETTINGS.MAX_USERNAME_LENGTH} characters`);
    return false;
  }

  if (password.length < AUTH_SETTINGS.MIN_PASSWORD_LENGTH || 
      password.length > AUTH_SETTINGS.MAX_PASSWORD_LENGTH) {
    alert(`Password must be ${AUTH_SETTINGS.MIN_PASSWORD_LENGTH}-${AUTH_SETTINGS.MAX_PASSWORD_LENGTH} characters`);
    return false;
  }

  // Check email uniqueness BEFORE creating the account
  if (!isEmailUnique(email)) {
    return false;
  }

  // Create user profile object with a unique key
  const userStorageKey = `${AUTH_SETTINGS.STORAGE_KEY}_${Date.now()}`;
  const userProfile = {
    username: username,
    email: email, // Store normalized email
    profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0095f6&color=fff`,
    fullName: username, 
    bio: "New to Earn Challenge", 
    joinDate: new Date().toISOString(),
    challengesCreated: 0,
    challengesParticipated: 0,
    challengesWon: 0,
    participatedChallenges: [], 
    wonChallenges: [] 
  };

  // Store user profile in localStorage with a unique key
  localStorage.setItem(userStorageKey, JSON.stringify(userProfile));
  
  return userProfile;
}

function loginUser(username, password) {
  // Normalize input (lowercase and trim)
  const normalizedInput = username.toLowerCase().trim();

  // Find user by iterating through all stored user profiles
  const userKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(AUTH_SETTINGS.STORAGE_KEY + '_'));

  for (const key of userKeys) {
    const userProfile = JSON.parse(localStorage.getItem(key));
    
    if (userProfile.username.toLowerCase().trim() === normalizedInput || 
        userProfile.email.toLowerCase().trim() === normalizedInput) {
      // In a real app, you'd check password here
      return userProfile;
    }
  }
  
  return null;
}

function getCurrentUser() {
  const userKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(AUTH_SETTINGS.STORAGE_KEY + '_'));

  if (userKeys.length > 0) {
    // Return the most recently created user profile
    const mostRecentKey = userKeys[userKeys.length - 1];
    return JSON.parse(localStorage.getItem(mostRecentKey));
  }
  
  return null;
}

function updateUserProfile(updates) {
  const userKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(AUTH_SETTINGS.STORAGE_KEY + '_'));

  if (userKeys.length > 0) {
    const mostRecentKey = userKeys[userKeys.length - 1];
    const userProfile = JSON.parse(localStorage.getItem(mostRecentKey));
    
    // Merge updates
    const updatedProfile = {
      ...userProfile,
      ...updates
    };

    localStorage.setItem(mostRecentKey, JSON.stringify(updatedProfile));
    return updatedProfile;
  }
  return null;
}

function isUserLoggedIn() {
  const userKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(AUTH_SETTINGS.STORAGE_KEY + '_'));
  return userKeys.length > 0;
}

function uploadProfilePicture(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const profilePic = event.target.result;
      const updatedProfile = updateUserProfile({ profilePic });
      resolve(updatedProfile);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

function logoutUser() {
  // Remove stored user data
  const userKeys = Object.keys(localStorage)
    .filter(key => key.startsWith(AUTH_SETTINGS.STORAGE_KEY + '_'));
  userKeys.forEach(key => localStorage.removeItem(key));
  
  // Clear any session-related data
  sessionStorage.clear();
  
  // Reset application state (if possible)
  if (window.resetAppState) {
    window.resetAppState();
  }
  
  // Show login section
  const loginSection = document.getElementById('login-section');
  if (loginSection) {
    loginSection.classList.remove('hidden');
  }
}

export { 
  registerUser, 
  loginUser, 
  logoutUser, 
  isUserLoggedIn, 
  getCurrentUser,
  updateUserProfile,
  uploadProfilePicture,
  initiatePasswordReset,
  resetPassword,
  isEmailUnique 
};
