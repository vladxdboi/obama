let filteredQuestions = [];
let currentQuestion = 0;
let score = 0;
let highScore = 0;

// ======================
// 🔐 Login un Reģistrācija
// ======================

function renderLoginPage() {
  document.getElementById("app").innerHTML = `
    <div class="screen-wrapper">
      <div class="login-container">
        <h2 class="login-title">WDYM?</h2>
        <label class="login-label" for="username">Name</label>
        <input type="text" id="username" class="login-input" placeholder="Enter your name" />
        <label class="login-label" for="password">Password</label>
        <input type="password" id="password" class="login-input" placeholder="Enter your password" />
        <div class="login-buttons">
          <button class="login-btn" onclick="handleAuth('login')">LOGIN</button>
          <button class="login-btn" onclick="handleAuth('register')">REGISTER</button>
        </div>
      </div>
    </div>
  `;
}

function handleAuth(mode) {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (mode === "register") {
    if (users[username]) {
      alert("Username already exists.");
      return;
    }
    users[username] = { password, highScore: 0 };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registered! Please log in.");
    return;
  }

  if (users[username] && users[username].password === password) {
    localStorage.setItem("currentUser", username);
    highScore = users[username].highScore || 0;
    renderDifficultyPage();
  } else {
    alert("Invalid credentials.");
  }
}

// ======================
// 🎚️ Grūtības izvēle
// ======================

function renderDifficultyPage() {
  document.getElementById("app").innerHTML = `
    <div class="screen-wrapper">
      <div class="difficulty-container">
        <div class="difficulty-header">
          <h2>WDYM?</h2>
          <div class="menu-icon" onclick="toggleMenu()">
            <div></div><div></div><div></div>
          </div>
        </div>
        <button class="difficulty-btn easy" onclick="startGame('easy')">EASY</button>
        <button class="difficulty-btn medium" onclick="startGame('medium')">MEDIUM</button>
        <button class="difficulty-btn hard" onclick="startGame('hard')">HARD</button>
      </div>
    </div>
    ${getPopupMenuHTML()}
  `;
}

function toggleMenu() {
  const menu = document.getElementById("popup-menu");
  menu.classList.toggle("hidden");
  document.getElementById("menu-info").innerHTML = '';
}

function showMenuContent(type) {
  const info = document.getElementById("menu-info");
  let content = "";

  switch (type) {
    case 'how':
      content = "<p>Answer correctly to score. One wrong answer ends the game!</p>";
      break;
    case 'faq':
      content = "<p><strong>Q:</strong> Can I retry?<br><strong>A:</strong> No.</p>";
      break;
    case 'leaderboard':
      showLeaderboard();
      return;
    case 'about':
      content = "<p>This is a university student group project.</p>";
      break;
    default:
      content = "<p>No content available.</p>";
  }

  info.innerHTML = `<div class="info-box">${content}</div>`;
}

function getPopupMenuHTML() {
  return `
    <div id="popup-menu" class="popup-menu hidden">
      <div class="popup-content">
        <div class="popup-header">
          <h3>Menu</h3>
          <span class="popup-close" onclick="toggleMenu()">×</span>
        </div>
        <hr />
        <button class="popup-btn" onclick="showMenuContent('how')">How to play?</button>
        <button class="popup-btn" onclick="showMenuContent('faq')">FAQ</button>
        <button class="popup-btn" onclick="showMenuContent('leaderboard')">Leaderboard</button>
        <button class="popup-btn" onclick="showMenuContent('about')">About</button>
        <div id="menu-info" class="menu-info"></div>
      </div>
    </div>
  `;
}

// ======================
// 🧠 Spēles loģika
// ======================

function startGame(difficulty) {
  const username = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  highScore = users[username]?.highScore || 0;

  filteredQuestions = questions.filter(q => q.difficulty === difficulty);
  currentQuestion = 0;
  score = 0;
  renderQuizPage();
}

function renderQuizPage() {
  const q = filteredQuestions[currentQuestion];
  if (!q) return renderNoMoreQuestionsScreen();

  const answersHTML = q.answers.map((a, i) =>
    `<button class="quiz-answer-btn" onclick="checkAnswer(${i})">${a}</button>`
  ).join("");

  document.getElementById("app").innerHTML = `
    <div class="screen-wrapper">
      <div class="quiz-container">
        <p class="quiz-question">${q.question}</p>
        <div class="quiz-answers-outer">
          <div class="fade-top"></div>
          <div class="quiz-answers-wrapper">
            <div class="quiz-answers">${answersHTML}</div>
          </div>
          <div class="fade-bottom"></div>
        </div>
      </div>
    </div>
  `;
}

function checkAnswer(index) {
  const q = filteredQuestions[currentQuestion];
  if (index === q.correct) {
    const pts = q.difficulty === "easy" ? 100 : q.difficulty === "medium" ? 150 : 200;
    score += pts;

    const username = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (score > (users[username]?.highScore || 0)) {
      users[username].highScore = score;
      localStorage.setItem("users", JSON.stringify(users));
    }

    renderCorrectAnswerScreen(pts);
  } else {
    renderLoseScreen();
  }
}

function renderCorrectAnswerScreen(pointsEarned) {
  const levels = [300, 600, 1000];
  const images = ["bronze", "silver", "gold"];
  const level = levels.findIndex(p => score < p);
  const maxed = level === -1;
  const img = `data/${maxed ? "gold" : images[level]}.png`;

  const pointsToNext = maxed ? 0 : levels[level] - score;

  document.getElementById("app").innerHTML = `
    <div class="screen-wrapper">
      <div class="win-screen">
        <h2>WDYM?</h2>
        <div class="level-image-container">
          <img src="${img}" class="level-badge" />
        </div>
        <p class="score-label">Your current score</p>
        <div class="score-box green">${score} points</div>
        <p class="score-label">${maxed ? "You have reached the maximum level" : "Remaining points for next level"}</p>
        ${!maxed ? `<div class="score-box yellow">${pointsToNext} points</div>` : ""}
        <button class="next-btn" onclick="nextQuestion()">Nākamais jautājums</button>
      </div>
    </div>
  `;
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= filteredQuestions.length) {
    renderNoMoreQuestionsScreen();
  } else {
    renderQuizPage();
  }
}

function renderLoseScreen() {
  document.getElementById("app").innerHTML = `
    <div class="screen-wrapper">
      <div class="lose-screen">
        <h2>WDYM?</h2>
        <div class="wrong-icon">✖</div>
        <p class="lose-message">Womp womp!</p>
        <p class="no-points">No points this time!</p>
        <div class="lose-buttons">
          <button class="new-game-btn" onclick="restartSameDifficulty()">NEW GAME</button>
          <div class="menu-icon lose-menu-icon" onclick="toggleMenu()">
            <div></div><div></div><div></div>
          </div>
        </div>
      </div>
    </div>
    ${getPopupMenuHTML(true)}
  `;
}

function renderNoMoreQuestionsScreen() {
  document.getElementById("app").innerHTML = `
    <div class="screen-wrapper">
      <div class="lose-screen yellow-bg">
        <h2>WDYM?</h2>
        <div class="wrong-icon">✔</div>
        <p class="lose-message">Jūs esat izgājis cauri visiem šīs grūtības jautājumiem.</p>
        <p class="no-points">Gaidiet nākamo spēles versiju ar vairāk jautājumiem :)</p>
        <div class="lose-buttons">
          <button class="new-game-btn" onclick="renderDifficultyPage()">HOME</button>
        </div>
      </div>
    </div>
    ${getPopupMenuHTML(true)}
  `;
}

// ======================
// 🏆 Leaderboard
// ======================

function showLeaderboard() {
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  const data = Object.entries(users)
    .map(([name, user]) => ({ name, score: user.highScore || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const entries = data.map(p => `<div class="leaderboard-entry"><span>${p.name}</span><span>${p.score}</span></div>`).join("");
  const current = localStorage.getItem("currentUser");
  const currentScore = users[current]?.highScore || 0;

  document.getElementById("app").innerHTML = `
    <div class="screen-wrapper">
      <div class="leaderboard-screen">
        <h2>WDYM?</h2>
        <div class="leaderboard-wrapper">
          <div class="fade-top"></div>
          <div class="leaderboard-scroll">${entries}</div>
          <div class="fade-bottom"></div>
        </div>
        <p class="user-high-score-label">Your high score:</p>
        <div class="user-high-score-box">${currentScore}</div>
        <button class="home-btn" onclick="renderDifficultyPage()">HOME</button>
      </div>
    </div>
  `;
}

renderLoginPage();
