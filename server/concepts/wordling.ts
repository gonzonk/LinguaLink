import DocCollection, { BaseDoc } from "../framework/doc";

export interface WordleDoc extends BaseDoc {
  word: string;
}
export interface CurrentDoc extends BaseDoc {
  currDate: string;
  currWord: string;
}

/**
 * concept: Wordling
 */
export default class WordlingConcept {
  public readonly possible_words: DocCollection<WordleDoc>;
  public readonly previous_words: DocCollection<WordleDoc>;
  public readonly current_status: DocCollection<CurrentDoc>;

  /**
   * Make an instance of Wordling.
   */
  constructor(collectionName: string) {
    this.possible_words = new DocCollection<WordleDoc>(`${collectionName}-possible`);
    this.previous_words = new DocCollection<WordleDoc>(`${collectionName}-previous`);
    this.current_status = new DocCollection<CurrentDoc>(`${collectionName}-current`);
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

  async handleNewDay(newDate: string) {
    const exists = await this.current_status.readOne({ currDate: newDate });
    if (!exists) {
      const newWord = await this.pickWord();
      await this.current_status.createOne({ currWord: newWord.word, currDate: newDate });
    }
    const word = await this.current_status.readOne({ currDate: newDate });
    return word?.currWord;
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
