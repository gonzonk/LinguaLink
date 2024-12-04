// import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface WordleDoc extends BaseDoc {
  word: string;
}

/**
 * concept: Wordling
 */
export default class WordlingConcept {
  public readonly possible_words: DocCollection<WordleDoc>;
  public readonly previous_words: DocCollection<WordleDoc>;
  private currWord: string;
  private currDate: string;

  /**
   * Make an instance of Wordling.
   */
  constructor(collectionName: string) {
    this.possible_words = new DocCollection<WordleDoc>(`${collectionName}-possible`);
    this.previous_words = new DocCollection<WordleDoc>(`${collectionName}-previous`);
    this.currWord = "";
    this.currDate = "";
  }

  async addWord(word: string) {
    if (word.length !== 6) {
      return;
    }
    const possWord = await this.possible_words.readOne({ word });
    const prevWord = await this.previous_words.readOne({ word });
    if (!possWord && !prevWord) {
      const _id = await this.possible_words.createOne({ word });
      return { msg: "Word added successfully!", user: await this.possible_words.readOne({ _id }) };
    }
  }

  async removeWord(word: string) {
    await this.possible_words.deleteOne({ word });
    await this.previous_words.deleteOne({ word });
    return { msg: "Word removed successfully!" };
  }

  async getCurrWord() {
    if (this.currWord === "") {
      throw new NotFoundError(`No current word has been set`);
    }
    return this.currWord;
  }

  async getCurrDate() {
    if (this.currDate === "") {
      throw new NotFoundError(`No current word has been set`);
    }
    return this.currDate;
  }

  async updateWord(word: string, newWord: string) {
    await this.possible_words.partialUpdateOne({ word }, { word: newWord });
    return { msg: "Word updated successfully!" };
  }

  async handleNewDay(newDate: string) {
    if (newDate !== this.currDate && newDate !== "") {
      this.currDate = newDate;
      const newWord = await this.pickWord();
      this.currWord = newWord.word;
    }
    return this.currWord;
  }

  private async pickWord() {
    let wordArray = await this.possible_words.readMany({});
    let count = wordArray.length;
    let randomIndex;
    let newWord;

    if (count !== 0) {
      randomIndex = Math.floor(Math.random() * count);
      newWord = wordArray[randomIndex];
      await this.possible_words.deleteOne({ word: newWord.word });
      await this.previous_words.createOne({ word: newWord.word });
      return newWord;
    }
    wordArray = await this.previous_words.readMany({});
    count = wordArray.length;
    randomIndex = Math.floor(Math.random() * count);
    return wordArray[randomIndex];
  }
}
