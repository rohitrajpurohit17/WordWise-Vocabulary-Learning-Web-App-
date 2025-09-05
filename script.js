document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  const navLinks = document.querySelectorAll("nav ul li a")
  const sections = document.querySelectorAll(".section")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links and sections
      navLinks.forEach((link) => link.classList.remove("active"))
      sections.forEach((section) => section.classList.remove("active"))

      // Add active class to clicked link
      this.classList.add("active")

      // Show corresponding section
      const sectionId = this.getAttribute("data-section")
      document.getElementById(sectionId).classList.add("active")
    })
  })

  // Dictionary functionality
  const searchInput = document.getElementById("search-input")
  const searchBtn = document.getElementById("search-btn")
  const resultContainer = document.getElementById("result")

  searchBtn.addEventListener("click", searchWord)
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchWord()
    }
  })

  function searchWord() {
    const word = searchInput.value.trim()
    if (word === "") return

    // Show loading
    resultContainer.innerHTML = '<div class="loading">Searching...</div>'
    resultContainer.classList.add("active")

    // Fetch from Free Dictionary API
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Word not found")
        }
        return response.json()
      })
      .then((data) => displayResult(data))
      .catch((error) => {
        resultContainer.innerHTML = `
          <div class="error-message">
            <p>${error.message === "Word not found" ? "No definitions found for this word." : "An error occurred. Please try again."}</p>
          </div>
        `
      })
  }

  function displayResult(data) {
    const wordData = data[0]

    let audioSrc = ""
    if (wordData.phonetics) {
      for (const phonetic of wordData.phonetics) {
        if (phonetic.audio) {
          audioSrc = phonetic.audio
          break
        }
      }
    }

    let html = `
      <div class="word-header">
        <div>
          <h2 class="word-title">${wordData.word}</h2>
          <span class="phonetic">${wordData.phonetic || ""}</span>
        </div>
        ${audioSrc ? `<button class="audio-btn" onclick="playAudio('${audioSrc}')"><i class="fas fa-volume-up"></i></button>` : ""}
      </div>
      <div class="meanings">
    `

    wordData.meanings.forEach((meaning) => {
      html += `
        <div class="meaning">
          <h3 class="part-of-speech">${meaning.partOfSpeech}</h3>
          <div class="definitions">
      `

      meaning.definitions.forEach((def) => {
        html += `
          <div class="definition">
            <p>${def.definition}</p>
            ${def.example ? `<p class="example">"${def.example}"</p>` : ""}
          </div>
        `
      })

      html += `</div>`

      if (meaning.synonyms && meaning.synonyms.length > 0) {
        html += `
          <div class="synonyms">
            <p>Synonyms: </p>
            ${meaning.synonyms.map((syn) => `<span onclick="searchNewWord('${syn}')">${syn}</span>`).join("")}
          </div>
        `
      }

      if (meaning.antonyms && meaning.antonyms.length > 0) {
        html += `
          <div class="antonyms">
            <p>Antonyms: </p>
            ${meaning.antonyms.map((ant) => `<span onclick="searchNewWord('${ant}')">${ant}</span>`).join("")}
          </div>
        `
      }

      html += `</div>`
    })

    html += `</div>`

    resultContainer.innerHTML = html

    // Add audio play function to window object
    window.playAudio = (src) => {
      const audio = new Audio(src)
      audio.play()
    }

    // Add search new word function to window object
    window.searchNewWord = (word) => {
      searchInput.value = word
      searchWord()
    }
  }

  // Word Scramble Game
  const playBtns = document.querySelectorAll(".play-btn")
  const gameModals = document.querySelectorAll(".game-modal")
  const closeModals = document.querySelectorAll(".close-modal")

  // Words for the scramble game
  const scrambleWords = [
    { word: "dictionary", hint: "A book that contains words and their meanings" },
    { word: "vocabulary", hint: "The words that a person knows or uses" },
    { word: "language", hint: "A system of communication used by a country or community" },
    { word: "synonym", hint: "A word having the same or nearly the same meaning as another" },
    { word: "antonym", hint: "A word opposite in meaning to another" },
    { word: "definition", hint: "A statement of the exact meaning of a word" },
    { word: "grammar", hint: "The rules of how words are used in a language" },
    { word: "pronunciation", hint: "The way in which a word is pronounced" },
    { word: "thesaurus", hint: "A book of synonyms and antonyms" },
    { word: "phrase", hint: "A group of words that have a particular meaning when used together" },
  ]

  // Word pairs for the match game
  const wordPairs = [
    { word: "Eloquent", definition: "Fluent or persuasive in speaking or writing" },
    { word: "Ephemeral", definition: "Lasting for a very short time" },
    { word: "Ubiquitous", definition: "Present, appearing, or found everywhere" },
    { word: "Pernicious", definition: "Having a harmful effect, especially in a gradual or subtle way" },
    { word: "Gregarious", definition: "Fond of company; sociable" },
    { word: "Pragmatic", definition: "Dealing with things sensibly and realistically" },
    { word: "Quintessential", definition: "Representing the most perfect example of a quality or class" },
    { word: "Sycophant", definition: "A person who acts obsequiously toward someone to gain advantage" },
  ]

  let currentScrambleWord = ""
  let selectedWordCard = null
  let selectedDefCard = null
  let matchPairs = []

  // Score tracking
  let totalScore = 0
  const scoreDisplay = document.getElementById("total-score")

  // Function to update score
  function updateScore(points) {
    totalScore += points
    scoreDisplay.textContent = totalScore
    // Save score to localStorage
    localStorage.setItem("dictionaryScore", totalScore)
  }

  // Load saved score if exists
  if (localStorage.getItem("dictionaryScore")) {
    totalScore = Number.parseInt(localStorage.getItem("dictionaryScore"))
    scoreDisplay.textContent = totalScore
  }

  playBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const gameType = this.getAttribute("data-game")
      const modal = document.getElementById(`${gameType}-modal`)
      modal.style.display = "flex"

      if (gameType === "word-scramble") {
        startScrambleGame()
      } else if (gameType === "word-match") {
        startMatchGame()
      }
    })
  })

  closeModals.forEach((close) => {
    close.addEventListener("click", function () {
      const modal = this.closest(".game-modal")
      modal.style.display = "none"
    })
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    gameModals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none"
      }
    })
  })

  // Word Scramble Game Functions
  function startScrambleGame() {
    const randomIndex = Math.floor(Math.random() * scrambleWords.length)
    const wordObj = scrambleWords[randomIndex]
    currentScrambleWord = wordObj.word

    const scrambledWord = scrambleWord(currentScrambleWord)
    document.getElementById("scrambled-word").textContent = scrambledWord
    document.getElementById("scramble-guess").value = ""
    document.getElementById("scramble-result").textContent = ""
    document.getElementById("scramble-result").className = ""

    // Add hint
    const gameContainer = document.querySelector("#word-scramble-modal .game-container")
    const hintElement = document.createElement("p")
    hintElement.textContent = `Hint: ${wordObj.hint}`
    hintElement.style.fontStyle = "italic"
    hintElement.style.marginBottom = "1rem"

    // Remove previous hint if exists
    const previousHint = gameContainer.querySelector("p:nth-child(2)")
    if (previousHint) {
      gameContainer.removeChild(previousHint)
    }

    gameContainer.insertBefore(hintElement, document.getElementById("scrambled-word"))
  }

  function scrambleWord(word) {
    const wordArray = word.split("")
    for (let i = wordArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]]
    }
    return wordArray.join("")
  }

  document.getElementById("check-scramble").addEventListener("click", checkScrambleGuess)
  document.getElementById("scramble-guess").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      checkScrambleGuess()
    }
  })

  function checkScrambleGuess() {
    const guess = document.getElementById("scramble-guess").value.trim().toLowerCase()
    const resultElement = document.getElementById("scramble-result")

    if (guess === currentScrambleWord) {
      resultElement.textContent = "Correct! Well done! +10 points"
      resultElement.className = "success"
      updateScore(10)
    } else {
      resultElement.textContent = "Incorrect. Try again!"
      resultElement.className = "error"
    }
  }

  document.getElementById("new-scramble").addEventListener("click", startScrambleGame)

  document.getElementById("reveal-scramble").addEventListener("click", () => {
    document.getElementById("scramble-guess").value = currentScrambleWord
    document.getElementById("scramble-result").textContent = "Answer revealed! No points awarded."
    document.getElementById("scramble-result").className = ""
  })

  document.getElementById("exit-scramble").addEventListener("click", () => {
    document.getElementById("word-scramble-modal").style.display = "none"
  })

  // Word Match Game Functions
  function startMatchGame() {
    // Get random word pairs
    matchPairs = getRandomItems(wordPairs, 5)

    const wordsColumn = document.getElementById("words-column")
    const defsColumn = document.getElementById("definitions-column")

    wordsColumn.innerHTML = ""
    defsColumn.innerHTML = ""

    // Create shuffled arrays
    const words = matchPairs.map((pair) => pair.word)
    const definitions = matchPairs.map((pair) => pair.definition)

    // Shuffle definitions
    shuffleArray(definitions)

    // Create word cards
    words.forEach((word) => {
      const wordCard = document.createElement("div")
      wordCard.className = "match-card word-card"
      wordCard.textContent = word
      wordCard.addEventListener("click", function () {
        if (selectedWordCard) {
          selectedWordCard.classList.remove("selected")
        }
        this.classList.add("selected")
        selectedWordCard = this

        checkForMatch()
      })
      wordsColumn.appendChild(wordCard)
    })

    // Create definition cards
    definitions.forEach((def) => {
      const defCard = document.createElement("div")
      defCard.className = "match-card def-card"
      defCard.textContent = def
      defCard.addEventListener("click", function () {
        if (selectedDefCard) {
          selectedDefCard.classList.remove("selected")
        }
        this.classList.add("selected")
        selectedDefCard = this

        checkForMatch()
      })
      defsColumn.appendChild(defCard)
    })

    document.getElementById("match-result").textContent = ""
    document.getElementById("match-result").className = ""
  }

  function checkForMatch() {
    if (selectedWordCard && selectedDefCard) {
      // Find the correct pair
      const selectedWord = selectedWordCard.textContent
      const selectedDef = selectedDefCard.textContent

      const isMatch = matchPairs.some((pair) => pair.word === selectedWord && pair.definition === selectedDef)

      if (isMatch) {
        // Correct match
        selectedWordCard.style.backgroundColor = "#2ecc71"
        selectedDefCard.style.backgroundColor = "#2ecc71"
        selectedWordCard.style.color = "white"
        selectedDefCard.style.color = "white"

        // Disable the matched cards
        selectedWordCard.style.pointerEvents = "none"
        selectedDefCard.style.pointerEvents = "none"

        // Reset selection
        selectedWordCard = null
        selectedDefCard = null

        // Add points for correct match
        updateScore(5)

        // Check if all pairs are matched
        const remainingCards = document.querySelectorAll('.match-card:not([style*="pointer-events: none"])')
        if (remainingCards.length === 0) {
          document.getElementById("match-result").textContent = "Congratulations! You matched all the words!"
          document.getElementById("match-result").className = "success"
        }
      } else {
        // Incorrect match - visual feedback
        selectedWordCard.classList.add("error")
        selectedDefCard.classList.add("error")

        setTimeout(() => {
          selectedWordCard.classList.remove("error", "selected")
          selectedDefCard.classList.remove("error", "selected")
          selectedWordCard = null
          selectedDefCard = null
        }, 1000)
      }
    }
  }

  document.getElementById("check-matches").addEventListener("click", () => {
    const wordCards = document.querySelectorAll(".word-card")
    const defCards = document.querySelectorAll(".def-card")
    let correctMatches = 0

    wordCards.forEach((wordCard, index) => {
      const word = wordCard.textContent
      const correctDef = matchPairs.find((pair) => pair.word === word).definition

      // Find the def card with this definition
      let matchedDefCard = null
      defCards.forEach((defCard) => {
        if (defCard.textContent === correctDef) {
          matchedDefCard = defCard
        }
      })

      if (wordCard.style.pointerEvents === "none" && matchedDefCard.style.pointerEvents === "none") {
        correctMatches++
      }
    })

    const resultElement = document.getElementById("match-result")
    resultElement.textContent = `You have matched ${correctMatches} out of ${matchPairs.length} pairs correctly.`
    resultElement.className = correctMatches === matchPairs.length ? "success" : ""
  })

  document.getElementById("new-match-game").addEventListener("click", startMatchGame)

  document.getElementById("reveal-matches").addEventListener("click", () => {
    const wordCards = document.querySelectorAll(".word-card")
    const defCards = document.querySelectorAll(".def-card")

    // Reset all cards
    wordCards.forEach((card) => {
      card.style.backgroundColor = ""
      card.style.color = ""
      card.style.pointerEvents = "none"
      card.classList.remove("selected", "error")
    })

    defCards.forEach((card) => {
      card.style.backgroundColor = ""
      card.style.color = ""
      card.style.pointerEvents = "none"
      card.classList.remove("selected", "error")
    })

    // Show correct matches
    matchPairs.forEach((pair) => {
      const wordCard = Array.from(wordCards).find((card) => card.textContent === pair.word)
      const defCard = Array.from(defCards).find((card) => card.textContent === pair.definition)

      if (wordCard && defCard) {
        wordCard.style.backgroundColor = "#3498db"
        defCard.style.backgroundColor = "#3498db"
        wordCard.style.color = "white"
        defCard.style.color = "white"
      }
    })

    document.getElementById("match-result").textContent = "Answers revealed! No points awarded."
    document.getElementById("match-result").className = ""

    // Reset selection
    selectedWordCard = null
    selectedDefCard = null
  })

  document.getElementById("exit-match").addEventListener("click", () => {
    document.getElementById("word-match-modal").style.display = "none"
  })

  // Helper Functions
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  function getRandomItems(array, count) {
    const shuffled = [...array]
    shuffleArray(shuffled)
    return shuffled.slice(0, count)
  }
})
