const questions = [
  // EASY
  {
    question: "The app must save user settings even after closing. What should you do?",
    answers: [
      "Use RAM",
      "Discard all settings",
      "Use LocalStorage or a database",
      "Ask user each time",
      "Save to clipboard"
    ],
    correct: 2,
    difficulty: "easy"
  },
  {
    question: "App should show a message after data upload completes.",
    answers: [
      "Show 'Upload complete!' on screen",
      "Do nothing",
      "Delete all data",
      "Reload page"
    ],
    correct: 0,
    difficulty: "easy"
  },
  {
    question: "Game must give points for correct answers.",
    answers: [
      "Do not store points",
      "Always start from 0",
      "Increase score and store locally",
      "Only show stars",
      "Let player choose score"
    ],
    correct: 2,
    difficulty: "easy"
  },
  {
    question: "Audio should only play after user interaction.",
    answers: [
      "Play on page load",
      "Play after user clicks",
      "Play after 1 minute",
      "Never play"
    ],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "Show question only after login.",
    answers: [
      "Show to everyone",
      "Show after authentication check",
      "Hide using CSS",
      "Ask admin",
      "Require email confirmation"
    ],
    correct: 1,
    difficulty: "easy"
  },

  // MEDIUM
  {
    question: "How to reduce JS load time?",
    answers: [
      "Load all scripts together",
      "Use code splitting",
      "Add delays",
      "Use jQuery",
      "Inline everything in HTML"
    ],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "How to securely allow password reset?",
    answers: [
      "Send plain password",
      "Use a one-time token link",
      "Let user guess",
      "Show it on screen"
    ],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "User progress should continue after reload.",
    answers: [
      "Save question index to localStorage",
      "Start over",
      "Prompt user manually",
      "Disable reload",
      "Store progress in cookies"
    ],
    correct: 0,
    difficulty: "medium"
  },
  {
    question: "Require secure connection for data transfer.",
    answers: [
      "Use HTTPS and encryption",
      "Use HTTP",
      "Send raw strings",
      "FTP is enough"
    ],
    correct: 0,
    difficulty: "medium"
  },
  {
    question: "App must adapt to various screen sizes.",
    answers: [
      "Use responsive design (media queries/flexbox)",
      "Fixed width",
      "Horizontal scroll only",
      "None"
    ],
    correct: 0,
    difficulty: "medium"
  },

  // HARD
  {
    question: "How to prevent SQL injection?",
    answers: [
      "Use parameterized queries or ORM",
      "Use raw input",
      "Let user write SQL",
      "Save in CSV",
      "Escape quotes manually"
    ],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "App needs to sync data across devices in real time.",
    answers: [
      "Use WebSocket or Firebase",
      "Update once a day",
      "Reload the page",
      "Send emails"
    ],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "Only logged-in users can access data.",
    answers: [
      "Use backend authentication middleware",
      "Hide on frontend",
      "Let everyone view",
      "Password in localStorage"
    ],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "App must support multiple languages.",
    answers: [
      "Use localization files with keys",
      "Write text directly",
      "One language only",
      "Google Translate",
      "Ask user to copy-paste text"
    ],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "Prevent XSS in form inputs.",
    answers: [
      "Escape input and use CSP",
      "Allow all HTML",
      "Use Base64",
      "Sanitize on render",
      "Log user input"
    ],
    correct: 0,
    difficulty: "hard"
  },  {
    question: `What will happen with this .JS code?\n\nconst x = 5;\nconst x = 10;`,
    answers: [
      "It will work correctly",
      "It will cause a SyntaxError",
      "It will override the variable",
      "It will return undefined"
    ],
    correct: 1,
    difficulty: "tricky"
  }
];

