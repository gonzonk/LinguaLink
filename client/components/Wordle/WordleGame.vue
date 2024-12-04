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
  for (let i = 0; i < 6; i++) {
    const letter = guess[i];
    if (letter === correctWord.value[i]) {
      row[i] = { value: letter, status: "correct" };
    } else if (correctWord.value.includes(letter)) {
      row[i] = { value: letter, status: "present" };
    } else {
      row[i] = { value: letter, status: "absent" };
    }
  }
};

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
  <div class="wordle">
    <h1>Word of the Day</h1>
    <div class="guess-grid">
      <div v-for="(row, rowIndex) in guesses" :key="'row-' + rowIndex" class="guess-row">
        <div v-for="(letter, index) in row" :key="'cell-' + index" class="guess-cell" :class="getCellClass(letter.status)">
          {{ letter.value }}
        </div>
      </div>
    </div>

    <div class="guess-input">
      <input type="text" v-model="currentGuess" maxlength="6" @keyup.enter="submitGuess" :disabled="gameOver" placeholder="Enter guess" />
      <button @click="submitGuess" :disabled="gameOver || !currentGuess">Submit Guess</button>
    </div>

    <div v-if="gameOver" class="game-over">
      <p>{{ gameWon ? "You won!" : "Game Over! The word was " + correctWord }}</p>
      <button @click="goToEntry">Learn more about this word!</button>
    </div>
  </div>
</template>

<style scoped>
.wordle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
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
  width: 50px;
  height: 50px;
  margin: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
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
  margin-top: 20px;
}
</style>
