import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface FlashcardDoc extends BaseDoc {
  name: string;
  author: ObjectId;
  authorName: string;
  items: BaseDoc[];
}

/**
 * concept: FlashcardingConcept
 */
export default class FlashcardingConcept {
  public readonly flashcards: DocCollection<FlashcardDoc>;

  hasObject(objects: BaseDoc[], find: BaseDoc): boolean {
    console.log("objects in find obs", objects);
    console.log("find", find);
    for (const obj of objects) {
      if (new ObjectId(find._id).equals(obj._id)) {
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

  async createFlashcards(author: ObjectId, authorName: string, name: string, item: BaseDoc) {
    await this.assertNameUnused(name);
    const _id = await this.flashcards.createOne({ author, authorName, name, items: [item] });
    return { msg: `Flashcard set ${name} created`, flashcards: await this.flashcards.readOne({ _id }) };
  }

  async deleteFlashcards(user: ObjectId, name: string) {
    await this.assertUserAuthor(name, user);
    await this.flashcards.deleteOne({ name: name });
    return { msg: `Flashcard set ${name} deleted` };
  }

  async addToFlashcards(name: string, user: ObjectId, item: BaseDoc) {
    console.log("adding item", item);
    await this.assertUserAuthor(name, user);
    const cards = await this.flashcards.readOne({ name: name });
    if (!cards) {
      throw new NotFoundError("A set with that name does not exist");
    }
    if (this.hasObject(cards.items, item)) {
      throw new Error("card already in set");
    }
    const newItems = cards.items;
    newItems.push(item);
    await this.flashcards.partialUpdateOne({ name: name }, { items: newItems });
  }

  async getFlashcards(id: ObjectId) {
    const cards = await this.flashcards.readOne({ id: id });
    if (!cards) {
      throw new NotFoundError("A set with that id does not exist");
    }
    return cards;
  }

  async getFlashcardsByName(name: string) {
    const cards = await this.flashcards.readOne({ name: name });
    if (!cards) {
      throw new NotFoundError("A set with that name does not exist");
    }
    return cards;
  }

  async getFlashcardsByAuthor(author: ObjectId) {
    const cards = await this.flashcards.readMany({ author: author });
    console.log(cards);
    if (!cards) {
      throw new NotFoundError("A set with that author does not exist");
    }
    return cards;
  }

  async getAllFlashcards() {
    const cards = await this.flashcards.readMany({});
    return cards;
  }

  async removeFromFlashcards(name: string, user: ObjectId, item: BaseDoc) {
    await this.assertUserAuthor(name, user);
    const cards = await this.flashcards.readOne({ name: name });
    if (!cards) {
      throw new NotFoundError("A set with that name does not exist");
    }
    const newItems = cards.items.filter((p) => !p._id.equals(item._id));
    await this.flashcards.partialUpdateOne({ name: name }, { items: newItems });
  }

  async getCollectionsByItem(item: BaseDoc) {
    const matches = await this.flashcards.collection.find({ items: item });
    return { matchingCollections: matches };
  }

  async removeWordFromAll(item: BaseDoc) {
    const offenders = await this.flashcards.readMany({ items: item });
    for (const cards of offenders) {
      await this.removeFromFlashcards(cards.name, cards.author, item);
    }
    return { msg: `Removed item ${item} from sets containing it` };
  }

  async assertUserAuthor(name: string, user: ObjectId) {
    const cards = await this.flashcards.readOne({ name: name, author: user });
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
