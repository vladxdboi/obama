let filteredQuestions = [];
let currentQuestion = 0;
let score = 0;
let highScore = 0;
let lastDifficulty = null;
let answeredCorrectly = [];


//Login un Reģistrācija

function renderLoginPage(){
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

function handleAuth(mode){
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if(!username || !password){
    alert("Please enter both username and password.");
    return;}


  const users = JSON.parse(localStorage.getItem("users") || "{}");


  if(mode === "register"){
    if(users[username]){
      alert("Username already exists.");
      return;
    }
    users[username] = { password, highScore:0 };
    localStorage.setItem("users",JSON.stringify(users));
    alert("Registered! Please log in.");
    return;
  }

  if(users[username] && users[username].password === password){
    localStorage.setItem("currentUser", username);
    highScore = users[username].highScore || 0;
    renderDifficultyPage();}
	else{alert("Invalid credentials.");}
}

// difficulty selector
function renderDifficultyPage(){
  document.getElementById("app").innerHTML = `
    <div class="screen-wrapper">
      <div class="difficulty-container">
        <div class="difficulty-header">
          <h2>Select Difficulty</h2>
          <div class="menu-icon" onclick="toggleMenu()">
            <div></div><div></div><div></div>
          </div>
        </div>
        <button class="difficulty-btn easy" onclick="startGame('easy')">EASY</button>
        <button class="difficulty-btn medium" onclick="startGame('medium')">MEDIUM</button>
        <button class="difficulty-btn hard" onclick="startGame('hard')">HARD</button>
        <button class="difficulty-btn tricky" onclick="startGame('tricky')">TRICKY</button> <!-- Jaunā poga -->
      </div>
    </div>
    ${getPopupMenuHTML(false)}
  `;
}


function toggleMenu(){
  const menu = document.getElementById("popup-menu");
  if(!menu) return; 
  menu.classList.toggle("hidden");
  
  if(menu.classList.contains("hidden")){
    document.getElementById("menu-info").innerHTML = '';}
}


function showMenuContent(type){
  const info = document.getElementById("menu-info");
  let content = "";


  switch (type){
    case 'how':
      content = "<p>Read the requirement and select the most appropriate implementation from the given options. Each correct answer earns you points, and the amount depends on the selected difficulty level. One wrong answer ends the game. Progress through ranks by scoring higher, and see how you compare with others on the global leaderboard.</p>";
      break;
    case 'faq':
      content = "<p><strong>Q:</strong> Do i have a set attempt ammount?<br><strong>A:</strong> No - you keep playing until you get all questions correct</p>";
      break;
    case 'leaderboard':
      showLeaderboard();
      return;
    case 'about':
      content = "<p>Grupas dalībnieki:<br><br>Dāniels Plaunovs, 221RDB422<br>Mārtiņš Nikiforovs, 221RDB386<br>Vladislavs Senevičs, 221RDB453<br>Kristiāns Šneiders, 221RDB042<br>Haralds Štrombergs 221RDB307<br>Rūdolfs Saukums 221RDB085<br>Kristaps Skudra 161REB074</p>";
      break;
    case 'home':
      renderDifficultyPage();
      return;
	  
	  
    default:
      content = "<p>No content available.</p>";
  }

  info.classList.remove('visible'); // Sākumā noņem
  setTimeout(() =>{
    info.innerHTML = `<div class="info-box">${content}</div>`;
    info.classList.add('visible'); // Tad pievieno ar pāreju
  }, 10);}


function getPopupMenuHTML(showHomeButton = false){
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
        ${showHomeButton ? `<button class="popup-btn" onclick="showMenuContent('home')">Home</button>` : ""}
        <div id="menu-info" class="menu-info"></div>
      </div>
    </div>
  `;
}

//Spēles logic

function startGame(difficulty){
  const username = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  highScore = users[username]?.highScore || 0;

  lastDifficulty = difficulty;
  answeredCorrectly = [];

  filteredQuestions = questions.filter(q => q.difficulty === difficulty);
  currentQuestion=0;
  score=0;
  renderQuizPage();
}


function renderQuizPage(){
  const q = filteredQuestions[currentQuestion];
  if(!q) return renderNoMoreQuestionsScreen();

  const answersHTML = q.answers.map((a, i) =>
    `<button class="quiz-answer-btn" onclick="checkAnswer(${i})">${a}</button>`).join("");

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

function checkAnswer(index){
  const q = filteredQuestions[currentQuestion];
  if(index === q.correct){
    answeredCorrectly.push(q);

    const pts = q.difficulty === "easy" ? 100 : q.difficulty === "medium" ? 150 : 200;
    score += pts;

    const username = localStorage.getItem("currentUser");
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if(score > (users[username]?.highScore || 0)){
      users[username].highScore = score;
      localStorage.setItem("users", JSON.stringify(users));
    }

    renderCorrectAnswerScreen(pts);}
	else{renderLoseScreen();}
}


function renderCorrectAnswerScreen(pointsEarned){
  const levels =[300, 600, 1000];
  const images =["bronze", "silver", "gold"];
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
        <button class="next-btn" onclick="nextQuestion()">Next question.</button>
      </div>
    </div>
  `;
}

function nextQuestion(){
  currentQuestion++;
  if(currentQuestion >= filteredQuestions.length){
    renderNoMoreQuestionsScreen();}
	else {renderQuizPage();}
}

function renderLoseScreen(){
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

function renderNoMoreQuestionsScreen(){
  document.getElementById("app").innerHTML = `
    <div class="screen-wrapper">
      <div class="lose-screen yellow-bg">
        <h2>WDYM?</h2>
        <div class="wrong-icon">✔</div>
        <p class="lose-message">You have answered each question in this difficulty level.</p>
        <p class="no-points">More questions coming soon - stay tuned... :)</p>
        <div class="lose-buttons">
          <button class="new-game-btn" onclick="renderDifficultyPage()">HOME</button>
        </div>
      </div>
    </div>
    ${getPopupMenuHTML(true)}
  `;
}

function restartSameDifficulty(){
  if(!lastDifficulty) 
  {renderDifficultyPage();
    return;}

  // fetcho jautājumus atkarībā no grūtības līmeņa un "vecos" atmet
  const remaining = questions
    .filter(q => q.difficulty === lastDifficulty && !answeredCorrectly.includes(q));

  if(remaining.length === 0){
    renderNoMoreQuestionsScreen();
    return;
  }

  // shufle atlikušajiem jaut.
  filteredQuestions = remaining.sort(() => Math.random()-0.5);
  currentQuestion=0;
  score=0;
  renderQuizPage();
}


//leaderboard

function showLeaderboard(){
  const users = JSON.parse(localStorage.getItem("users")||"{}");
  const data = Object.entries(users)
  
    .map(([name, user]) => ({ name, score: user.highScore ||0}))
    .sort((a, b) => b.score - a.score)
    .slice(0,10);

  const entries = data.map(p => `<div class="leaderboard-entry"><span>${p.name}</span><span>${p.score}</span></div>`).join("");
  const current = localStorage.getItem("currentUser");
  const currentScore= users[current]?.highScore || 0;

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
