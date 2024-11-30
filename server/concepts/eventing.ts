import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface EventDoc extends BaseDoc {
  author: ObjectId;
  title: string;
  description: string;
  time: string;
  location: string;
}

/**
 * concept: Eventing [Author]
 */
export default class EventingConcept {
  public readonly events: DocCollection<EventDoc>;

  /**
   * Make an instance of Eventing.
   */
  constructor(collectionName: string) {
    this.events = new DocCollection<EventDoc>(collectionName);
  }

  async create(author: ObjectId, title: string, description: string, time: string, location: string) {
    const _id = await this.events.createOne({ author, title, description, time, location });
    return { msg: "Event successfully created!", event: await this.events.readOne({ _id }) };
  }

  async getEvents() {
    // Returns all events! You might want to page for better client performance
    return await this.events.readMany({}, { sort: { _id: -1 } });
  }

  async getEvent(_id: ObjectId) {
    const event = await this.events.readOne({ _id });
    if (!event) {
      throw new NotFoundError(`Event ${_id} does not exist!`);
    }
    return event;
  }

  async getByAuthor(author: ObjectId) {
    return await this.events.readMany({ author });
  }

  async update(_id: ObjectId, title?: string, description?: string, time?: string, location?: string) {
    // Note that if content or options is undefined, those fields will *not* be updated
    // since undefined values for partialUpdateOne are ignored.
    const currEvent = await this.events.readOne({ _id });
    if (!currEvent) {
      throw new NotFoundError(`Event ${_id} does not exist!`);
    }

    // Prepare the update object, but only include fields that are defined
    const updateData: Partial<EventDoc> = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (time !== undefined) {
      updateData.time = time;
    }

    if (location !== undefined) {
      updateData.location = location;
    }

    // Perform the partial update, only including fields that have changed
    await this.events.partialUpdateOne({ _id }, updateData);

    return { msg: "Event successfully updated!" };
  }

  async delete(_id: ObjectId) {
    await this.events.deleteOne({ _id });
    return { msg: "Event deleted successfully!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const event = await this.events.readOne({ _id });
    if (!event) {
      throw new NotFoundError(`Event ${_id} does not exist!`);
    }
    if (event.author.toString() !== user.toString()) {
      throw new EventAuthorNotMatchError(user, _id);
    }
  }
}

export class EventAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of event {1}!", author, _id);
  }
}
