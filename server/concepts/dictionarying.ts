import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface DictionaryDoc extends BaseDoc {
  word: string;
  posts: ObjectId[];
}

/**
 * concept: Dictionarying [Post]
 */
export default class DictionaryingConcept {
  public readonly dictionary: DocCollection<DictionaryDoc>;

  constructor(collectionName: string) {
    this.dictionary = new DocCollection<DictionaryDoc>(collectionName);
  }

  async deleteEntry(word: string) {
    await this.assertEntryExists(word);
    const entry = await this.dictionary.popOne({ word });
    return {
      msg: "Entry successfully deleted",
      entry,
    };
  }

  async addItem(word: string, item: ObjectId) {
    const entry = await this.dictionary.readOne({ word });
    if (entry) {
      // Add item to existing entry
      await this.dictionary.partialUpdateOne({ word }, { posts: entry.posts.concat(item) });
    } else {
      // Create entry and add item to it
      await this.dictionary.createOne({
        word,
        posts: [item],
      });
    }
  }

  async deleteItem(word: string, item: ObjectId) {
    const entry = await this.dictionary.readOne({ word });
    if (entry) {
      let updatedPosts = entry.posts;
      updatedPosts = updatedPosts.filter((p) => !p.equals(item));
      if (updatedPosts.length > 0) {
        // Entry still has posts remaining
        await this.dictionary.partialUpdateOne({ word }, { posts: updatedPosts });
      } else {
        // Entry has no remaining posts
        await this.dictionary.deleteOne({ word });
      }
    }
  }

  async getEntry(word: string) {
    const entry = await this.dictionary.readOne({ word });
    return {
      entry,
    };
  }

  async getAllEntries() {
    const entries = await this.dictionary.readMany({});
    return entries;
  }

  public async entryExists(word: string) {
    const entry = await this.dictionary.readOne({ word });
    return entry !== null;
  }

  private async assertEntryExists(word: string) {
    const entry = await this.dictionary.readOne({ word });
    if (!entry) {
      throw new EntryNotFoundError(word);
    }
  }
}

export class EntryAlreadyExistsError extends NotAllowedError {
  constructor(public readonly word: string) {
    super(`Entry "${word}" already exists`);
  }
}

export class EntryNotFoundError extends NotFoundError {
  constructor(public readonly word: string) {
    super(`Entry "${word}" does not exist`);
  }
}
