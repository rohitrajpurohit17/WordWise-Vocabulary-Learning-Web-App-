<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: auth.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WordWise Dictionary</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap">
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous" defer></script>
</head>
<body>
  <header>
    <div class="container">
      <div class="logo">
        <h1>WordWise</h1>
      </div>
      <nav>
        <ul>
          <li><a href="#" class="active" data-section="dictionary">Dictionary</a></li>
          <li><a href="#" data-section="games">Word Games</a></li>
          <li><a href="#" data-section="about">About</a></li>
        </ul>
      </nav>
      <div class="score-display">
        <span>Total Score: <span id="total-score">0</span></span><a href="logout.php" style="margin-left: 1rem; color: white; text-decoration: underline;">Logout</a>
      </div>
    </div>
  </header>

  <main>
    <section id="dictionary" class="section active">
      <div class="container">
        <div class="search-container">
          <h2>Look up a word</h2>
          <div class="search-box">
            <input type="text" id="search-input" placeholder="Enter a word...">
            <button id="search-btn"><i class="fas fa-search"></i></button>
          </div>
        </div>
        
        <div id="result" class="result-container">
          <!-- Results will be displayed here -->
        </div>
      </div>
    </section>

    <section id="games" class="section">
      <div class="container">
        <div class="section-header">
          <h2>Games & Quizzes</h2>
          <a href="#" class="see-all">See All <i class="fas fa-chevron-right"></i></a>
        </div>
        
        <div class="games-grid">
          <div class="game-card">
            <div class="game-image quordle">
              <div class="game-logo">Quordle</div>
              <div class="game-grid">
                <div class="letter">W</div>
                <div class="letter">O</div>
                <div class="letter">R</div>
                <div class="letter">D</div>
                <div class="letter correct">Y</div>
                <div class="letter">L</div>
                <div class="letter">O</div>
                <div class="letter">V</div>
                <div class="letter">E</div>
                <div class="letter">R</div>
                <div class="letter correct">P</div>
                <div class="letter">L</div>
                <div class="letter present">A</div>
                <div class="letter present">Y</div>
                <div class="letter present">S</div>
              </div>
            </div>
            <div class="game-info">
              <p>Can you solve 4 words at once?</p>
              <button class="play-btn" data-game="word-scramble">Play</button>
            </div>
          </div>
          
          <div class="game-card">
            <div class="game-image word-match">
              <div class="game-logo">Word Match</div>
              <div class="match-grid">
                <div class="match-item">
                  <div class="match-word">Eloquent</div>
                  <div class="match-line"></div>
                  <div class="match-def">Fluent or persuasive in speaking or writing</div>
                </div>
              </div>
            </div>
            <div class="game-info">
              <p>Match words with their definitions!</p>
              <button class="play-btn" data-game="word-match">Play</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="section">
      <div class="container">
        <h2>About WordWise</h2>
        <p>WordWise is a comprehensive dictionary tool designed to help you expand your vocabulary and have fun with words. Our dictionary provides definitions, pronunciations, synonyms, and more for thousands of words.</p>
        <p>We also offer engaging word games to help you practice and improve your language skills while having fun.</p>
      </div>
    </section>
  </main>

  <!-- Game Modals -->
  <div id="word-scramble-modal" class="game-modal">
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Word Scramble</h2>
      <div class="game-container">
        <p>Unscramble the letters to form a word:</p>
        <div id="scrambled-word"></div>
        <input type="text" id="scramble-guess" placeholder="Your answer...">
        <button id="check-scramble">Check</button>
        <div id="scramble-result"></div>
        <button id="new-scramble">New Word</button>
        <button id="exit-scramble" class="exit-btn">Exit Game</button>
        <button id="reveal-scramble" class="reveal-btn">Reveal Answer</button>
      </div>
    </div>
  </div>

  <div id="word-match-modal" class="game-modal">
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Word Match</h2>
      <div class="game-container">
        <p>Match each word with its correct definition:</p>
        <div id="match-game-container">
          <div id="words-column"></div>
          <div id="definitions-column"></div>
        </div>
        <button id="check-matches">Check Matches</button>
        <div id="match-result"></div>
        <button id="new-match-game">New Game</button>
        <button id="exit-match" class="exit-btn">Exit Game</button>
        <button id="reveal-matches" class="reveal-btn">Reveal Answers</button>
      </div>
    </div>
  </div>

  <footer>
    <div class="container">
      <p>&copy; 2025 WordWise Dictionary. All rights reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
