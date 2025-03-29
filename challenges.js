import { showSection } from './navigation.js';
import { ENTRY_FEE, APP_FEE_PERCENT, CURRENCY, USER_DATA, VIEWS_TO_WIN } from './config.js';

// Render all challenges in the feed
function renderChallenges(challenges) {
  const container = document.getElementById('challenges-container');
  container.innerHTML = "";
  
  if (challenges.length === 0) {
    const noContent = document.createElement('p');
    noContent.textContent = 'No active challenges at the moment. Create the first one!';
    container.appendChild(noContent);
    return;
  }
  
  challenges.forEach(challenge => {
    const card = document.createElement('div');
    card.className = 'challenge-card';
    
    // Challenge Title
    const header = document.createElement('h3');
    header.textContent = challenge.title;
    card.appendChild(header);
    
    // Media Preview: display video or image based on uploaded type
    if (challenge.mediaType === "video") {
      const videoElem = document.createElement('video');
      videoElem.src = challenge.mediaURL;
      videoElem.controls = true;
      card.appendChild(videoElem);
    } else if (challenge.mediaType === "image") {
      const imgElem = document.createElement('img');
      imgElem.src = challenge.mediaURL;
      imgElem.alt = challenge.title;
      card.appendChild(imgElem);
    }
    
    // Challenge Details
    const infoDiv = document.createElement('div');
    infoDiv.className = 'challenge-info';
    infoDiv.innerHTML = `
      <div class="challenge-details">
        <p>Created by: ${challenge.creator}</p>
        <p>Entry Fee: $${challenge.entryFee}</p>
        <p>Prize: $${challenge.prize}</p>
        <p>Participants: ${challenge.participants}</p>
        <p>Total Prize Pool: $${challenge.totalPot}</p>
        <p>App Commission (${APP_FEE_PERCENT}%): $${((challenge.totalPot * APP_FEE_PERCENT) / 100).toFixed(2)}</p>
        <p>Winner announced when an entry reaches ${(VIEWS_TO_WIN/1000000).toFixed(1)} million views</p>
      </div>
    `;
    card.appendChild(infoDiv);
    
    // View Details Button
    const viewBtn = document.createElement('button');
    viewBtn.textContent = "View Challenge Details";
    viewBtn.addEventListener("click", () => {
      viewChallengeDetails(challenge.id, challenges);
    });
    card.appendChild(viewBtn);
    
    // Join Challenge Button
    const joinBtn = document.createElement('button');
    joinBtn.textContent = "Join Challenge";
    joinBtn.addEventListener("click", () => {
      joinChallenge(challenge.id);
    });
    card.appendChild(joinBtn);
    
    container.appendChild(card);
  });
}

// Setup challenge creation form
function setupChallengeForm(challenges, renderCallback) {
  const createForm = document.getElementById('create-challenge-form');
  const videoInput = document.getElementById('challenge-video-input');
  const previewContainer = document.getElementById('preview-container');

  if (createForm && videoInput && previewContainer) {
    // Show media preview when a file is selected
    videoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      previewContainer.innerHTML = "";
      
      if (file) {
        previewContainer.classList.remove('hidden');
        if (file.type.startsWith("video/")) {
          const videoElem = document.createElement("video");
          videoElem.src = URL.createObjectURL(file);
          videoElem.controls = true;
          previewContainer.appendChild(videoElem);
        } else if (file.type.startsWith("image/")) {
          const imgElem = document.createElement("img");
          imgElem.src = URL.createObjectURL(file);
          imgElem.alt = "Preview";
          previewContainer.appendChild(imgElem);
        }
      } else {
        previewContainer.classList.add('hidden');
      }
    });
    
    // Handle form submission for creating a new challenge
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById('challenge-title-input').value;
      const prize = parseFloat(document.getElementById('challenge-prize-input').value);
      const mediaFile = videoInput.files[0];
      
      if (!title || !prize || !mediaFile) {
        alert("Please complete all fields!");
        return;
      }
      
      const mediaType = mediaFile.type.startsWith("video/") ? "video" : "image";
      const mediaURL = URL.createObjectURL(mediaFile);
      
      // Create a new challenge object with a unique id and media details
      const challenge = {
        id: Date.now(),
        creator: USER_DATA.username,
        creatorAvatar: USER_DATA.profilePic,
        title: title,
        description: `Exciting new challenge: ${title}`,
        prize: prize,
        mediaURL: mediaURL,
        mediaType: mediaType,
        participants: 0,
        totalPot: 0,
        entryFee: ENTRY_FEE,
        entries: [],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: "active"
      };
      
      challenges.push(challenge);
      
      // Reset form and preview
      createForm.reset();
      previewContainer.innerHTML = "";
      previewContainer.classList.add('hidden');
      
      // Update the UI
      renderCallback(challenges);
      showSection('feed');
    });
  }
}

// View challenge details
function viewChallengeDetails(challengeId, challenges) {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return;
  
  const container = document.getElementById('challenge-detail-container');
  container.innerHTML = "";
  
  // Create challenge detail card
  const detailCard = document.createElement('div');
  detailCard.className = 'challenge-detail-card';
  
  // Challenge Title
  const header = document.createElement('h2');
  header.textContent = challenge.title;
  detailCard.appendChild(header);
  
  // Creator info
  const creatorInfo = document.createElement('div');
  creatorInfo.className = 'challenge-creator-info';
  creatorInfo.innerHTML = `
    <img src="${challenge.creatorAvatar}" alt="${challenge.creator}" class="creator-avatar">
    <span>Created by: ${challenge.creator}</span>
  `;
  detailCard.appendChild(creatorInfo);
  
  // Media
  if (challenge.mediaType === "video") {
    const videoElem = document.createElement('video');
    videoElem.src = challenge.mediaURL;
    videoElem.controls = true;
    detailCard.appendChild(videoElem);
  } else if (challenge.mediaType === "image") {
    const imgElem = document.createElement('img');
    imgElem.src = challenge.mediaURL;
    imgElem.alt = challenge.title;
    detailCard.appendChild(imgElem);
  }
  
  // Challenge Details
  const infoDiv = document.createElement('div');
  infoDiv.className = 'challenge-details';
  infoDiv.innerHTML = `
    <p>Entry Fee: $${challenge.entryFee}</p>
    <p>Prize: $${challenge.prize}</p>
    <p>Participants: ${challenge.participants}</p>
    <p>Total Prize Pool: $${challenge.totalPot}</p>
    <p>App Commission (${APP_FEE_PERCENT}%): $${((challenge.totalPot * APP_FEE_PERCENT) / 100).toFixed(2)}</p>
    <p>Start Date: ${new Date(challenge.startDate).toLocaleDateString()}</p>
    <p>End Date: ${new Date(challenge.endDate).toLocaleDateString()}</p>
    <p>To win: Reach ${(VIEWS_TO_WIN/1000000).toFixed(1)} million views with your entry</p>
    <p>Winners receive the prize pool minus ${APP_FEE_PERCENT}% platform commission</p>
  `;
  detailCard.appendChild(infoDiv);
  
  // Join Button
  const joinButton = document.createElement('button');
  joinButton.className = 'primary-button';
  joinButton.textContent = 'Join Challenge';
  joinButton.addEventListener('click', () => joinChallenge(challengeId));
  detailCard.appendChild(joinButton);
  
  container.appendChild(detailCard);
  
  // Display entries if any
  const entriesContainer = document.getElementById('challenge-entries-container');
  entriesContainer.innerHTML = '<h3>Challenge Entries</h3>';
  
  if (!challenge.entries || challenge.entries.length === 0) {
    entriesContainer.innerHTML += '<p>No entries yet. Be the first to participate!</p>';
  } else {
    challenge.entries.forEach(entry => {
      const entryCard = document.createElement('div');
      entryCard.className = 'entry-card';
      
      // User info
      const userInfo = document.createElement('div');
      userInfo.className = 'entry-user-info';
      userInfo.innerHTML = `
        <img src="${entry.userAvatar}" alt="${entry.username}" class="entry-user-avatar">
        <span>${entry.username}</span>
      `;
      entryCard.appendChild(userInfo);
      
      // Media
      if (entry.mediaType === "video") {
        const videoElem = document.createElement('video');
        videoElem.src = entry.mediaURL;
        videoElem.controls = true;
        entryCard.appendChild(videoElem);
      } else if (entry.mediaType === "image") {
        const imgElem = document.createElement('img');
        imgElem.src = entry.mediaURL;
        imgElem.alt = `Entry by ${entry.username}`;
        entryCard.appendChild(imgElem);
      }
      
      // Vote info
      const voteInfo = document.createElement('div');
      voteInfo.className = 'entry-vote-info';
      voteInfo.innerHTML = `<p>Votes: ${entry.votes}</p>`;
      entryCard.appendChild(voteInfo);
      
      // Vote button
      const voteButton = document.createElement('button');
      voteButton.className = 'vote-button';
      voteButton.textContent = 'Vote';
      voteButton.addEventListener('click', () => {
        entry.votes++;
        voteInfo.innerHTML = `<p>Votes: ${entry.votes}</p>`;
        voteButton.disabled = true;
        voteButton.textContent = 'Voted';
      });
      entryCard.appendChild(voteButton);
      
      entriesContainer.appendChild(entryCard);
    });
  }
  
  showSection('challenge-details');
}

// Join challenge function
function joinChallenge(challengeId) {
  // Get challenges from app.js
  const challenges = window.challenges || [];
  
  const challenge = challenges.find(c => c.id === challengeId);
  
  if (challenge) {
    // Set challenge title in entry form
    document.getElementById('entry-challenge-title').textContent = challenge.title;
    
    // Reset entry form
    document.getElementById('submit-entry-form').reset();
    document.getElementById('entry-preview-container').innerHTML = '';
    document.getElementById('entry-preview-container').classList.add('hidden');
    
    // Show entry submission section
    showSection('submit-entry');
  }
}

export { renderChallenges, setupChallengeForm, viewChallengeDetails, joinChallenge };
