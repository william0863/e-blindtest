/* AUDIO PLAYER */
// Get audio player and elements
var player = document.getElementById("player");
var playbtn = document.getElementById("playbtn");
var progress = document.getElementById("progress");
var current = document.getElementById("current");

// Play/pause function
var playpause = function () {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
};

// Add event listener to play/pause button
playbtn.addEventListener("click", playpause);

// Update play/pause button on play/pause events
player.addEventListener("play", function () {
  playbtn.classList.remove("fa-play");
  playbtn.classList.add("fa-pause");
});
player.addEventListener("pause", function () {
  playbtn.classList.remove("fa-pause");
  playbtn.classList.add("fa-play");
});

// Update progress bar on timeupdate event
player.addEventListener("timeupdate", function () {
  var duration = player.duration;
  var currentTime = player.currentTime;
  var progressPercent = (currentTime / duration) * 100;

  progress.style.width = progressPercent + "%";
  current.innerHTML = timeFormat(currentTime);
});

// Convert seconds to minutes and seconds
function timeFormat(time) {
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time % 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
}

/* GAME QUIZZ */
// Selects HTML elements and assigns them to variables
const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll(".choice-text"));
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const progressBarFull = document.querySelector("#progressBarFull");
const audio = new Audio();

// Initializes game variables
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// Loads questions from JSON file and starts the game
let questions = [];
fetch("questions.json")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions;
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

  // Sets game parameters
const SCORE_POINTS = 100;
const MAX_QUESTIONS = 5;

// Starts the game and initializes questions
startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

// Selects a new question
getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);

    return window.location.assign("/end.html");
  }

  // Stops and resets audio for next question
  if (questionCounter > 0) {
    audio.pause();
    audio.currentTime = 0;
  }

  // Updates question counter and progress bar
  questionCounter++;
  progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // Selects a random question from the remaining questions
  const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionsIndex];
  question.innerText = currentQuestion.question;

  // Plays audio for current question
  audio.src = `./audio/${currentQuestion.song}`;
  audio.play();

  // Displays answer choices for current question
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  // Removes selected question from the list of available questions
  availableQuestions.splice(questionsIndex, 1);

  // Allows the user to select an answer
  acceptingAnswers = true;

};

// Listens for user to select an answer, if they do, update
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    let classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(SCORE_POINTS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

// Increments the player's score
incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

