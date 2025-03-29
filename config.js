export const PAYPAL_CLIENT_ID = "AQfxBbXVLTxpOFZYK9yLNmQoAy33mh3UUXoqOVxzDjkjJnPtjcWo-H_OsYI6TpCUYrRmX3pFEJXFgq_U";
export const PAYPAL_EMAIL = "lippo.f@libero.it";
export const ENTRY_FEE = 5;
export const APP_FEE_PERCENT = 10;
export const CHALLENGE_TITLE = "Go Viral Challenge";
export const CHALLENGE_PRIZE = 100;
export const CURRENCY = "EUR";
export const VIEWS_TO_WIN = 1000000; // 1 million views to win

export const USER_DATA = {
  username: "challenge_creator",
  fullName: "Challenge Creator",
  bio: "Create viral challenges and showcase talent worldwide!",
  profilePic: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E",
  challengesCreated: 0,
  challengesParticipated: 0,
  challengesWon: 0
};

export const INITIAL_CHALLENGES = [
  {
    id: 1,
    creator: "viral_creator",
    creatorAvatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230095f6'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E",
    title: "Best Mirror Effect Video Wins $100",
    description: "Create a video using the most creative mirror effect! The winner will be chosen by the community.",
    mediaType: "video",
    mediaURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' fill='%23f8c291'%3E%3Crect width='800' height='600' fill='%23f8c291'/%3E%3Ccircle cx='400' cy='500' r='80' fill='%23e55039'/%3E%3Crect x='0' y='400' width='800' height='200' fill='%2378e08f'/%3E%3Cpath d='M0,400 Q200,350 400,400 T800,400' fill='%230a3d62'/%3E%3C/svg%3E",
    prize: 100,
    entryFee: 5,
    participants: 45,
    totalPot: 225,
    entries: [],
    startDate: "2023-10-01",
    endDate: "2023-11-01",
    status: "active"
  },
  {
    id: 2,
    creator: "dance_master",
    creatorAvatar: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e84393'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E",
    title: "Dance Challenge - Best Choreography Wins $200",
    description: "Show off your dance skills! Create an original 30-second choreography.",
    mediaType: "video",
    mediaURL: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800' fill='%23f6b93b'%3E%3Ccircle cx='400' cy='400' r='280' fill='%23e58e26'/%3E%3Ccircle cx='400' cy='400' r='230' fill='%23f8c291'/%3E%3Crect x='200' y='395' width='400' height='10' fill='%23e55039'/%3E%3Crect x='250' y='370' width='10' height='60' fill='%23e55039'/%3E%3Crect x='350' y='370' width='10' height='60' fill='%23e55039'/%3E%3Crect x='450' y='370' width='10' height='60' fill='%23e55039'/%3E%3Crect x='550' y='370' width='10' height='60' fill='%23e55039'/%3E%3C/svg%3E",
    prize: 200,
    entryFee: 5,
    participants: 78,
    totalPot: 390,
    entries: [],
    startDate: "2023-09-15",
    endDate: "2023-10-15",
    status: "active"
  }
];

// Add user authentication configuration
export const AUTH_SETTINGS = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 30,
  STORAGE_KEY: 'earnChallenge_userProfile'
};
