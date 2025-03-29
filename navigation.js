// Simplified navigation handlers with English context
function setupNavigation(showSectionFn) {
  document.getElementById('nav-home').addEventListener('click', () => {
    showSectionFn('feed');
  });
  
  document.getElementById('nav-search').addEventListener('click', () => {
    showSectionFn('search');
  });
  
  document.getElementById('nav-create').addEventListener('click', () => {
    showSectionFn('create');
  });
  
  document.getElementById('nav-activity').addEventListener('click', () => {
    showSectionFn('activity');
  });
  
  document.getElementById('nav-profile').addEventListener('click', () => {
    showSectionFn('profile');
  });
}

// Show/hide sections based on navigation
function showSection(sectionId) {
  // Hide all sections
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
  
  // Show selected section
  const sectionMap = {
    'feed': 'feed-section',
    'search': 'search-section',
    'create': 'create-section',
    'activity': 'activity-section',
    'profile': 'profile-section',
    'challenge-details': 'challenge-details-section',
    'submit-entry': 'submit-entry-section'
  };

  const targetSectionId = sectionMap[sectionId];
  if (targetSectionId) {
    const targetSection = document.getElementById(targetSectionId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }
  }
}

export { setupNavigation, showSection };
