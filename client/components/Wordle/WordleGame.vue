<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import router from "@/router";

const loaded = ref(false);
const correctWord = ref("");
const currentGuess = ref("");
const guesses = ref(
  Array(6)
    .fill(null)
    .map(() => Array(6).fill({ value: "", status: "" })),
);
const guessCount = ref(0);
const gameOver = ref(false);
const gameWon = ref(false);

const submitGuess = () => {
  if (gameOver.value || guessCount.value >= 6 || currentGuess.value.length !== 6) return;
  const guess = currentGuess.value.toLowerCase();

  const guessRow = guesses.value[guessCount.value];
  updateGuessRow(guessRow, guess);

  if (guess === correctWord.value) {
    gameWon.value = true;
    gameOver.value = true;
  } else if (guessCount.value === 5) {
    gameOver.value = true;
  }

  guessCount.value++;
  currentGuess.value = "";
};

const updateGuessRow = (row: { value: string; status: string }[], guess: string) => {
  const occurrences = countLetterOccurrences(correctWord.value);
  // Loops through and marks correct positions first to reduce occurrences before looping again
  // to find correct letters in wrong positions
  for (let i = 0; i < 6; i++) {
    const letter = guess[i];
    if (letter === correctWord.value[i]) {
      row[i] = { value: letter, status: "correct" };
      occurrences[letter]--;
    }
  }
  for (let i = 0; i < 6; i++) {
    const letter = guess[i];
    if (letter === correctWord.value[i]) {
      row[i] = { value: letter, status: "correct" };
    } else if (correctWord.value.includes(letter) && occurrences[letter] !== 0) {
      row[i] = { value: letter, status: "present" };
      occurrences[letter]--;
    } else {
      row[i] = { value: letter, status: "absent" };
    }
  }
};

function countLetterOccurrences(word: string): { [key: string]: number } {
  const letterCount: { [key: string]: number } = {};

  for (const letter of word) {
    if (letterCount[letter]) {
      letterCount[letter]++;
    } else {
      letterCount[letter] = 1;
    }
  }
  return letterCount;
}

const resetGame = async () => {
  const currDate = new Date();
  const newDate = await formatDate(currDate);
  const newWord = await fetchy(`/api/wordle/${newDate}`, "GET");
  correctWord.value = newWord.toLowerCase();
  currentGuess.value = "";
  guesses.value = Array(6)
    .fill(null)
    .map(() => Array(6).fill({ value: "", status: "" }));
  guessCount.value = 0;
  gameOver.value = false;
  gameWon.value = false;
};

const formatDate = async (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};

const getCellClass = (status: string) => {
  if (status === "correct") return "correct";
  if (status === "present") return "present";
  return "absent";
};

const goToEntry = () => {
  void router.push({ path: `/posts/${correctWord.value}` });
};

onBeforeMount(async () => {
  await resetGame();
  loaded.value = true;
});
</script>

<template>
  <div class="wotd-page">
    <div class="wordle">
      <h1 class="word-of-the-day">Word of the Day</h1>
      <div class="guess-grid">
        <div v-for="(row, rowIndex) in guesses" :key="'row-' + rowIndex" class="guess-row">
          <div v-for="(letter, index) in row" :key="'cell-' + index" class="guess-cell" :class="getCellClass(letter.status)">
            {{ letter.value }}
          </div>
        </div>
      </div>

      <div v-if="gameOver" class="game-over">
        <p class="game-over-text">{{ gameWon ? "You won!" : "Game Over! The word was " + correctWord + "." }}</p>
        <button @click="goToEntry" class="learn-button">Learn more about this word!</button>
      </div>

      <div v-else class="guess-input">
        <input type="text" v-model="currentGuess" maxlength="6" @keyup.enter="submitGuess" :disabled="gameOver" placeholder="Enter guess" />
        <button @click="submitGuess" :disabled="gameOver || !currentGuess" class="submit-button">Submit</button>
      </div>
    </div>
    <div class="instructions">
      <h1 class="inst-title">How to Play</h1>
      <div class="how-to">
        <p>Guess the Maori Word of the Day in 6 tries.</p>
        <ul>
          <li>Each guess can be any 6-letter word.</li>
          <li>The color of the tiles will change to show how close your guess was to the word.</li>
          <ul>
            <li>If the tile is GRAY, it means that that letter does not appear in the Word of the Day.</li>
            <li>If the tile is YELLOW, the letter is in the Word of the Day, but it's in the wrong spot.</li>
            <li>If the tile is GREEN, the letter is in the Word of the Day, and it's in the correct spot.</li>
          </ul>
          <li>After you finish the game, try clicking the "Learn more" button at the bottom of the page to learn what the Word of the Day means!</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wotd-page {
  display: flex;
  flex-direction: row;
}

.wordle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 65%;
}

h1 {
  font-size: 2rem;
}

.guess-grid {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.guess-row {
  display: flex;
  margin: 5px 0;
}

.guess-cell {
  width: 70px;
  height: 70px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.7rem;
  border: 1px solid #ccc;
  text-transform: uppercase;
}

.correct {
  background-color: green;
  color: white;
}

.present {
  background-color: yellow;
  color: black;
}

.absent {
  background-color: gray;
  color: white;
}

.guess-input {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  font-size: 1rem;
  padding: 5px;
  margin: 10px;
  width: 120px;
  text-transform: uppercase;
  text-align: center;
}

button {
  padding: 5px 10px;
  font-size: 1rem;
}

.game-over {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center; /* Center the text inside the <p> */
}

.submit-button {
  background-color: #e6fffa; /* Light teal background */
  border: 2px solid #81e6d9; /* Teal border */
  color: #2c7a7b;
  font-size: 16px; /* Set text size */
  padding: 10px 20px; /* Add padding for a larger button */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Change cursor to pointer */
  transition:
    background-color 0.3s ease,
    transform 0.2s ease; /* Smooth transition for hover effects */
}

.submit-button:hover {
  background-color: #b2f5ea;
  transform: scale(1.05); /* Slightly increase size on hover */
}

.submit-button:active {
  background-color: #81e0d1;
}

.learn-button {
  background-color: #e6fffa; /* Light teal background */
  border: 2px solid #81e6d9; /* Teal border */
  color: #2c7a7b;
  font-size: 20px; /* Set text size */
  padding: 10px 20px; /* Add padding for a larger button */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Change cursor to pointer */
  transition:
    background-color 0.3s ease,
    transform 0.2s ease; /* Smooth transition for hover effects */
}

.learn-button:hover {
  background-color: #b2f5ea;
  transform: scale(1.05); /* Slightly increase size on hover */
}

.learn-button:active {
  background-color: #81e0d1;
}

.word-of-the-day {
  color: #2c7a7b;
  font-size: 40px;
  margin: 5px;
  padding: 5px;
}

.inst-title {
  color: #2c7a7b;
  font-size: 30px;
  margin: 5px;
  padding: 5px;
}

.game-over-text {
  font-size: 28px;
  color: #2c7a7b;
  margin: 7px;
  padding: 5px;
}

.instructions {
  font-family: "Arial", sans-serif;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-top: 20px;
  margin-right: 5px;
  width: 35%;
}

.inst-title {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  text-transform: uppercase;
}

.how-to {
  font-size: 1.05rem;
  line-height: 1.3;
  color: #34495e;
}
.how-to p {
  margin-bottom: 15px;
  font-style: italic;
  color: #7f8c8d;
}
.how-to ul {
  list-style-type: disc;
  margin-left: 10px;
  margin-bottom: 15px;
}
.how-to ul ul {
  list-style-type: circle;
  margin-left: 20px;
  margin-bottom: 10px;
}
.how-to li {
  margin-bottom: 10px;
  font-weight: 400;
}
.how-to ul ul li {
  font-weight: 300;
  color: #2c7a7b;
}
</style>
