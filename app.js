import { 
  PAYPAL_CLIENT_ID, 
  ENTRY_FEE, 
  APP_FEE_PERCENT, 
  CHALLENGE_TITLE, 
  CHALLENGE_PRIZE, 
  CURRENCY, 
  USER_DATA, 
  INITIAL_CHALLENGES, 
  VIEWS_TO_WIN 
} from './config.js';
import { getRedirectUrl } from './payment_redirect.js';
import { renderChallenges, setupChallengeForm, viewChallengeDetails, joinChallenge } from './challenges.js';
import { setupNavigation, showSection } from './navigation.js';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  isUserLoggedIn, 
  getCurrentUser, 
  updateUserProfile, 
  uploadProfilePicture,
  initiatePasswordReset, 
  resetPassword 
} from './authentication.js';

// State management
let currentUser = null;
let challenges = [...INITIAL_CHALLENGES];
// Make challenges globally available
window.challenges = challenges;
let currentChallengeId = null;
let userEntries = [];

document.addEventListener("DOMContentLoaded", () => {
  // Authentication Event Listeners
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');

  // Toggle between login and register forms
  showRegisterLink?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form-container').classList.add('hidden');
    document.getElementById('register-form-container').classList.remove('hidden');
  });

  showLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-form-container').classList.add('hidden');
    document.getElementById('login-form-container').classList.remove('hidden');
  });

  // Login form submission
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = loginUser(username, password);
    if (user) {
      document.getElementById('login-section').classList.add('hidden');
      initializeApp(user);
    } else {
      alert('Invalid username or password');
    }
  });

  // Registration form submission
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const user = registerUser(username, password, email);
    if (user) {
      document.getElementById('login-section').classList.add('hidden');
      initializeApp(user);
    }
  });

  // Check if user is already logged in
  if (isUserLoggedIn()) {
    const user = getCurrentUser();
    document.getElementById('login-section').classList.add('hidden');
    initializeApp(user);
  }

  // Forgot Password Link
  const forgotPasswordLink = document.getElementById('forgot-password');
  const backToLoginLink = document.getElementById('back-to-login');
  const forgotPasswordContainer = document.getElementById('forgot-password-container');
  const loginFormContainer = document.getElementById('login-form-container');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const resetPasswordForm = document.getElementById('reset-password-form');
  const resetPasswordContainer = document.getElementById('reset-password-container');

  forgotPasswordLink?.addEventListener('click', (e) => {
    e.preventDefault();
    loginFormContainer.classList.add('hidden');
    forgotPasswordContainer.classList.remove('hidden');
  });

  backToLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordContainer.classList.add('hidden');
    loginFormContainer.classList.remove('hidden');
  });

  // Send Reset Link
  forgotPasswordForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const resetEmail = document.getElementById('reset-email').value;
    
    if (initiatePasswordReset(resetEmail)) {
      forgotPasswordContainer.classList.add('hidden');
      
      // In a real app, you'd redirect to a page where user enters token
      // Here we're simulating by showing a reset form
      document.getElementById('reset-token-input').value = localStorage.getItem(`reset_token_${resetEmail}`);
      document.getElementById('reset-email-input').value = resetEmail;
      resetPasswordContainer.classList.remove('hidden');
    }
  });

  // Reset Password
  resetPasswordForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;
    const resetToken = document.getElementById('reset-token-input').value;
    const resetEmail = document.getElementById('reset-email-input').value;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (resetPassword(resetEmail, newPassword, resetToken)) {
      resetPasswordContainer.classList.add('hidden');
      loginFormContainer.classList.remove('hidden');
    }
  });
});

function initializeApp(user) {
  currentUser = user;

  // Safe element selection with fallback
  const setTextContent = (id, text) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  };

  const setImage = (id, src) => {
    const element = document.getElementById(id);
    if (element) {
      element.src = src;
    }
  };

  // Update user profile section with safety checks
  setTextContent('profile-username', user.username);
  setTextContent('profile-fullname', user.fullName || user.username);
  setTextContent('profile-bio', user.bio || '');
  setImage('profile-avatar', user.profilePic);

  // Update stats with safety checks
  setTextContent('profile-challenges-count', user.challengesCreated || 0);
  setTextContent('profile-participations-count', user.challengesParticipated || 0);
  setTextContent('profile-wins-count', user.challengesWon || 0);

  // Display user created challenges
  const profileChallenges = document.getElementById('profile-challenges');
  if (profileChallenges) {
    profileChallenges.innerHTML = '';

    const userCreatedChallenges = challenges.filter(challenge => challenge.creator === user.username);

    if (userCreatedChallenges.length === 0) {
      const noContent = document.createElement('p');
      noContent.textContent = 'You haven\'t created any challenges yet. Start now!';
      profileChallenges.appendChild(noContent);
    } else {
      userCreatedChallenges.forEach(challenge => {
        const challengeElement = document.createElement('div');
        challengeElement.className = 'profile-challenge';

        // Media preview
        if (challenge.mediaType === 'video') {
          const video = document.createElement('video');
          video.src = challenge.mediaURL;
          video.controls = true;
          challengeElement.appendChild(video);
        } else {
          const img = document.createElement('img');
          img.src = challenge.mediaURL;
          img.alt = challenge.title;
          challengeElement.appendChild(img);
        }

        // Challenge info
        const infoDiv = document.createElement('div');
        infoDiv.className = 'profile-challenge-info';
        infoDiv.innerHTML = `
          <h4>${challenge.title}</h4>
          <p>Prize: $${challenge.prize}</p>
          <p>Participants: ${challenge.participants}</p>
        `;
        challengeElement.appendChild(infoDiv);

        profileChallenges.appendChild(challengeElement);
      });
    }
  }

  // Profile Picture Upload - add safety checks
  const profilePicInput = document.getElementById('profile-pic-upload');
  const changeProfilePicBtn = document.getElementById('change-profile-pic');
  
  if (changeProfilePicBtn) {
    changeProfilePicBtn.addEventListener('click', () => {
      if (profilePicInput) {
        profilePicInput.click();
      }
    });
  }

  if (profilePicInput) {
    profilePicInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const updatedUser = await uploadProfilePicture(file);
          const profileAvatar = document.getElementById('profile-avatar');
          if (profileAvatar) {
            profileAvatar.src = updatedUser.profilePic;
          }
        } catch (error) {
          console.error('Profile picture upload failed', error);
          alert('Failed to upload profile picture');
        }
      }
    });
  }

  // Profile Edit Functionality
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const profileEditForm = document.getElementById('profile-edit-form');

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      const profileView = document.getElementById('profile-view');
      const profileEdit = document.getElementById('profile-edit');
      
      if (profileView && profileEdit) {
        profileView.classList.add('hidden');
        profileEdit.classList.remove('hidden');
        
        // Populate edit form
        const editFullname = document.getElementById('edit-fullname');
        const editBio = document.getElementById('edit-bio');
        
        if (editFullname && editBio) {
          editFullname.value = user.fullName || user.username;
          editBio.value = user.bio || '';
        }
      }
    });
  }

  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', () => {
      const editFullname = document.getElementById('edit-fullname');
      const editBio = document.getElementById('edit-bio');
      const profileView = document.getElementById('profile-view');
      const profileEdit = document.getElementById('profile-edit');
      
      if (editFullname && editBio && profileView && profileEdit) {
        const fullName = editFullname.value;
        const bio = editBio.value;

        const updatedProfile = updateUserProfile({
          fullName,
          bio
        });

        if (updatedProfile) {
          const profileFullname = document.getElementById('profile-fullname');
          const profileBio = document.getElementById('profile-bio');
          
          if (profileFullname && profileBio) {
            profileFullname.textContent = fullName;
            profileBio.textContent = bio;
          }
          
          profileView.classList.remove('hidden');
          profileEdit.classList.add('hidden');
        }
      }
    });
  }

  // Setup logout button
  function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        logoutUser();
      });
    }
  }

  setupLogoutButton();

  // Optional: Add a global reset function
  window.resetAppState = () => {
    // Reset challenges and user-related global variables
    challenges = [...INITIAL_CHALLENGES];
    window.challenges = challenges;
    currentUser = null;
    currentChallengeId = null;
    userEntries = [];

    // Reset UI elements
    const sections = [
      'feed-section', 
      'search-section', 
      'create-section', 
      'activity-section', 
      'profile-section', 
      'challenge-details-section', 
      'submit-entry-section'
    ];

    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        element.classList.add('hidden');
      }
    });

    // Clear challenge containers
    const challengesContainer = document.getElementById('challenges-container');
    if (challengesContainer) {
      challengesContainer.innerHTML = '';
    }
  };

  // Rest of the existing code for rendering challenges, etc.
  setupNavigation(showSection);
  renderChallenges(INITIAL_CHALLENGES);
  setupChallengeForm(INITIAL_CHALLENGES, renderChallenges);

  // Handle submit entry form
  const entryForm = document.getElementById('submit-entry-form');
  const videoInput = document.getElementById('entry-video-input');
  const previewContainer = document.getElementById('entry-preview-container');

  if (videoInput && previewContainer && entryForm) {
    // Video input event listener remains the same
    videoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      previewContainer.innerHTML = '';

      if (file) {
        previewContainer.classList.remove('hidden');
        if (file.type.startsWith('video/')) {
          const videoElem = document.createElement('video');
          videoElem.src = URL.createObjectURL(file);
          videoElem.controls = true;
          previewContainer.appendChild(videoElem);
        } else if (file.type.startsWith('image/')) {
          const imgElem = document.createElement('img');
          imgElem.src = URL.createObjectURL(file);
          imgElem.alt = 'Preview';
          previewContainer.appendChild(imgElem);
        }
      } else {
        previewContainer.classList.add('hidden');
      }
    });

    // Rest of the entry form submission logic
    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const mediaFile = videoInput.files[0];
      if (!mediaFile) {
        alert('Please upload a video or image!');
        return;
      }

      // Store the entry data temporarily
      const entryData = {
        challengeId: currentChallengeId,
        mediaFile: mediaFile,
        mediaType: mediaFile.type.startsWith('video/') ? 'video' : 'image',
        mediaURL: URL.createObjectURL(mediaFile)
      };

      // Store the entry temporarily until payment is complete
      sessionStorage.setItem('pendingEntry', JSON.stringify(entryData));

      // Show PayPal form
      document.getElementById('paypal-fee-display').textContent = ENTRY_FEE;
      showPayPalPayment(currentChallengeId);
    });
  }
}

// Helper function to create challenge cards
function createChallengeCard(challenge, entry, isWinner = false) {
  const card = document.createElement('div');
  card.className = 'profile-challenge';
  
  const media = document.createElement(entry.mediaType === 'video' ? 'video' : 'img');
  media.src = entry.mediaURL;
  if (entry.mediaType === 'video') media.controls = true;
  card.appendChild(media);

  const info = document.createElement('div');
  info.className = 'profile-challenge-info';
  info.innerHTML = `
    <h4>${challenge.title}</h4>
    <p>Prize: $${challenge.prize}</p>
    <p>Votes: ${entry.votes}</p>
    ${isWinner ? '<p class="winner-badge">🏆 Winner!</p>' : ''}
  `;
  card.appendChild(info);

  return card;
}

// Show PayPal payment modal with direct form
function showPayPalPayment(challengeId) {
  const paypalContainer = document.getElementById('paypal-container');
  const paypalButtonContainer = document.getElementById('paypal-button-container');

  paypalContainer.classList.remove('hidden');

  // Create order ID
  const orderId = Date.now();
  currentChallengeId = challengeId;

  const redirectUrl = getRedirectUrl();

  // Create PayPal form matching the specified template
  paypalButtonContainer.innerHTML = `
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" name="Paypal">
      <input type="hidden" name="cmd" value="_xclick">
      <input type="hidden" name="business" value="lippo.f@libero.it">
      <input type="hidden" name="invoice" value="${orderId}">
      <input type="hidden" name="item_name" value="Challenge Entry #${orderId}">
      <input type="hidden" name="currency_code" value="EUR">
      <input type="hidden" name="amount" value="5.00">
      <input type="hidden" name="return" value="${redirectUrl}">
      <input type="hidden" name="cancel_return" value="${redirectUrl}">
      <input type="hidden" name="rm" value="2">
      <input type="hidden" name="lc" value="IT">
      <input type="submit" name="Go" value="Pay with PayPal" class="primary-button">
    </form>
  `;
}

function hidePayPalPayment() {
  document.getElementById('paypal-container').classList.add('hidden');
}

// Handle successful payment
function handleSuccessfulPayment(details) {
  // Find the challenge
  const challenge = challenges.find(c => c.id === currentChallengeId);

  if (challenge) {
    // Update challenge stats
    challenge.participants++;
    challenge.totalPot += ENTRY_FEE;

    // Get the pending entry data
    const pendingEntryJson = sessionStorage.getItem('pendingEntry');
    if (pendingEntryJson) {
      const pendingEntry = JSON.parse(pendingEntryJson);

      // Create entry object
      const entry = {
        id: Date.now(),
        challengeId: currentChallengeId,
        username: currentUser.username,
        userAvatar: currentUser.profilePic,
        mediaType: pendingEntry.mediaType,
        mediaURL: pendingEntry.mediaURL,
        timestamp: new Date().toISOString(),
        votes: 0,
        views: 0, 
        hasWon: false 
      };

      // Add entry to the challenge
      if (!challenge.entries) challenge.entries = [];
      challenge.entries.push(entry);

      // Add to user entries
      userEntries.push(entry);

      // Update user stats
      currentUser.challengesParticipated++;

      // Clean up
      sessionStorage.removeItem('pendingEntry');

      // Re-render challenges
      renderChallenges(challenges);

      // Show success message
      alert('Thank you! Your participation has been registered successfully.');

      // Return to challenges list
      showSection('feed');
    }
  }

  hidePayPalPayment();
}

// Check for winners (call this periodically or when views are updated)
function checkForWinners(challenges) {
  challenges.forEach(challenge => {
    if (challenge.entries && challenge.entries.length > 0) {
      challenge.entries.forEach(entry => {
        // If entry has 1M+ views and hasn't already won
        if (entry.views >= VIEWS_TO_WIN && !entry.hasWon) {
          // Mark as winner
          entry.hasWon = true;

          // Calculate prize (total pot minus app commission)
          const netPrize = challenge.totalPot * (1 - APP_FEE_PERCENT/100);

          // Announce winner (in real app, this would notify the user)
          console.log(`Congratulations! ${entry.username} has won challenge "${challenge.title}" with ${entry.views} views!`);
          console.log(`Prize amount: $${netPrize.toFixed(2)} (after ${APP_FEE_PERCENT}% platform commission)`);

          // In a real app, you would initiate a PayPal transfer to the winner here
        }
      });
    }
  });
}

// Export state and functions needed by other modules
export { challenges, currentUser, currentChallengeId, showSection, checkForWinners, initializeApp, createChallengeCard };
