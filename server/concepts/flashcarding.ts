import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface FlashcardDoc extends BaseDoc {
  name: string;
  author: ObjectId;
  items: ObjectId[];
}

/**
 * concept: Upvoting[Content]
 */
export default class UpvotingConcept {
  public readonly flashcards: DocCollection<FlashcardDoc>;

  hasObject(objects: ObjectId[], find: ObjectId): boolean {
    for (const obj of objects) {
      if (find.equals(obj)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Make a ratings instance
   */
  constructor(name: string) {
    this.flashcards = new DocCollection<FlashcardDoc>(name);
  }

  async createFlashcards(author: ObjectId, name: string, items: ObjectId[]) {
    await this.assertNameUnused(name);
    const _id = await this.flashcards.createOne({ author, name, items });
    return { msg: `Flashcard set ${name} created`, flashcards: await this.flashcards.readOne({ _id }) };
  }

  async deleteFlashcards(user: ObjectId, name: string) {
    await this.assertUserAuthor(name, user);
    await this.flashcards.deleteOne({ name: name });
    return { msg: `Flashcard set ${name} deleted` };
  }

  async addToFlashcards(name: string, user: ObjectId, item: ObjectId) {
    await this.assertUserAuthor(name, user);
    const cards = await this.flashcards.readOne({ name: name });
    if (!cards) {
      throw new NotFoundError("A set with that name does not exist");
    }
    const newItems = cards.items;
    newItems.push(item);
    await this.flashcards.partialUpdateOne({ name: name }, { items: newItems });
  }

  async removeFromFlashcards(name: string, user: ObjectId, item: ObjectId) {
    await this.assertUserAuthor(name, user);
    const cards = await this.flashcards.readOne({ name: name });
    if (!cards) {
      throw new NotFoundError("A set with that name does not exist");
    }
    const newItems = cards.items.filter((p) => !p.equals(item));
    await this.flashcards.partialUpdateOne({ name: name }, { items: newItems });
  }

  async getCollectionsByItem(item: ObjectId) {
    const matches = await this.flashcards.readMany({ items: item });
    return { matchingCollections: matches };
  }

  async removeWordFromAll(item: ObjectId) {
    const offenders = await this.flashcards.readMany({ items: item });
    for (const cards of offenders) {
      await this.removeFromFlashcards(cards.name, cards.author, item);
    }
    return { msg: `Removed item ${item} from sets containing it` };
  }

  async assertUserAuthor(name: string, user: ObjectId) {
    const cards = await this.flashcards.readOne({ author: user, name: name });
    if (!cards) {
      throw new NotAllowedError("User is not author of this set");
    }
    return;
  }

  async assertNameUnused(name: string) {
    const cards = await this.flashcards.readOne({ name: name });
    if (cards) {
      throw new NotAllowedError("A set with this name already exists");
    }
  }
}
