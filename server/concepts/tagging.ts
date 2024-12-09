import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";

export interface TaggingDoc extends BaseDoc {
  item: ObjectId;
  tags: string[];
}

/**
 * concept: Tagging [Item]
 */
export default class TaggingConcept {
  public readonly tags: DocCollection<TaggingDoc>;

  constructor(collectionName: string) {
    this.tags = new DocCollection<TaggingDoc>(collectionName);
  }

  async addTag(tag: string, item: ObjectId) {
    const record = await this.tags.readOne({ item });
    if (record) {
      // Add tag to existing record
      await this.tags.partialUpdateOne({ item }, { tags: record.tags.concat(tag) });
    } else {
      // Create entry and add item to it
      await this.tags.createOne({
        item,
        tags: [tag],
      });
    }
  }

  async setTag(tag: string, item: ObjectId) {
    const record = await this.tags.readOne({ item });
    if (record) {
      // Add tag to existing record
      await this.tags.partialUpdateOne({ item }, { tags: [tag] });
    } else {
      // Create entry and add item to it
      await this.tags.createOne({
        item,
        tags: [tag],
      });
    }
  }

  async getItemTags(item: ObjectId) {
    const record = await this.tags.readOne({ item });
    if (record) {
      return record.tags;
    } else {
      return [];
    }
  }

  async getAllTags() {
    return [
      "None",
      "Animals",
      "Art and Symbolism",
      "Body Parts",
      "Clothing and Textiles",
      "Colors",
      "Expressions of Emotion",
      "Fishing and Hunting",
      "Food and Cooking",
      "Geographical Features",
      "Greetings and Farewells",
      "Household Items",
      "Kinship",
      "Modern Technology",
      "Music and Dance",
      "Mythology and Folklore",
      "Numbers",
      "Plants",
      "Rituals and Ceremonies",
      "Time",
      "Traditional Crafts",
      "Transportation",
      "Weather",
    ];
  }

  async getItemsByTag(tag: string) {
    const cursor = this.tags.collection.find({ tags: tag });
    const results = await cursor.toArray();
    const itemIds = results.map((r) => r.item);
    return itemIds;
  }

  async removeTag(tag: string, item: ObjectId) {
    const record = await this.tags.readOne({ item });
    console.log(`record: ${JSON.stringify(record)}`);
    if (record) {
      let updatedTags = record.tags;
      updatedTags = updatedTags.filter((t) => t !== tag);
      if (updatedTags.length > 0) {
        // Item still has tags remaining
        await this.tags.partialUpdateOne({ item }, { tags: updatedTags });
      } else {
        // Item has no remaining tags
        await this.tags.deleteOne({ item });
      }
    }
  }
}
