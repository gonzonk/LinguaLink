import { ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface UpvoteDoc extends BaseDoc {
  item: ObjectId;
  upvotes: ObjectId[];
  downvotes: ObjectId[];
  reviewers: ObjectId[];
}

/**
 * concept: Upvoting[Content]
 */
export default class UpvotingConcept {
  public readonly upvotes: DocCollection<UpvoteDoc>;

  /**
   * Make a ratings instance
   */
  constructor(name: string) {
    this.upvotes = new DocCollection<UpvoteDoc>(name);
  }

  hasObject(votes: ObjectId[], find: ObjectId): boolean {
    for (const obj of votes) {
      if (find.equals(obj)) {
        return true;
      }
    }
    return false;
  }

  async getVotes(item: ObjectId) {
    let votes = await this.upvotes.readOne({ item: item });
    if (!votes) {
      await this.upvotes.createOne({ item: item, upvotes: [], downvotes: [], reviewers: [] });
      votes = await this.upvotes.readOne({ item: item });
    }
    if (!votes) {
      throw new NotFoundError("Just created new doc, this shouldnt happen");
    }
    return { msg: "votes found", votes: votes };
  }

  async usersUpvoted(item: ObjectId, user: ObjectId) {
    const votes = await this.upvotes.readOne({ item: item });
    if (!votes) {
      throw new NotFoundError("On a doc, this shouldnt happen");
    }
    return this.hasObject(votes.upvotes, user);
  }

  async usersDownvoted(item: ObjectId, user: ObjectId) {
    const votes = await this.upvotes.readOne({ item: item });
    if (!votes) {
      throw new NotFoundError("On a doc, this shouldnt happen");
    }
    return this.hasObject(votes.downvotes, user);
  }

  async upvoteItem(item: ObjectId, user: ObjectId) {
    // await this.assertUserIsReviewer(item, user);
    await this.assertUserNotInDownvotes(item, user);
    await this.assertUserNotInUpvotes(item, user);
    let upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      await this.upvotes.createOne({ item: item, upvotes: [], downvotes: [], reviewers: [] });
      upvotes = await this.upvotes.readOne({ item: item });
    }
    if (!upvotes) {
      throw new NotFoundError("Just created new doc, this shouldnt happen");
    }
    const newUpvotes = upvotes.upvotes;
    newUpvotes.push(user);
    await this.upvotes.partialUpdateOne({ item: item }, { upvotes: newUpvotes });
    return { msg: "Upvoted" };
  }

  async downvoteItem(item: ObjectId, user: ObjectId) {
    // await this.assertUserIsReviewer(item, user);
    await this.assertUserNotInDownvotes(item, user);
    await this.assertUserNotInUpvotes(item, user);
    let upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      await this.upvotes.createOne({ item: item, upvotes: [], downvotes: [], reviewers: [] });
      upvotes = await this.upvotes.readOne({ item: item });
    }
    if (!upvotes) {
      throw new NotFoundError("Just created new doc, this shouldnt happen");
    }
    const newDownvotes = upvotes.downvotes;
    newDownvotes.push(user);
    await this.upvotes.partialUpdateOne({ item: item }, { downvotes: newDownvotes });
    return { msg: "Downvoted" };
  }

  async removeUpvote(item: ObjectId, user: ObjectId) {
    await this.assertUserInUpvotes(item, user);
    const upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      throw new NotFoundError(`Item ${item} does not exist!`);
    }
    const newUpvotes = upvotes.upvotes.filter((p) => !p.equals(user));
    await this.upvotes.partialUpdateOne({ item: item }, { upvotes: newUpvotes });
    return { msg: "Upvote removed" };
  }

  async removeDownvote(item: ObjectId, user: ObjectId) {
    await this.assertUserInDownvotes(item, user);
    const upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      throw new NotFoundError(`Item ${item} does not exist!`);
    }
    const newDownvotes = upvotes.downvotes.filter((p) => !p.equals(user));
    await this.upvotes.partialUpdateOne({ item: item }, { downvotes: newDownvotes });
    return { msg: "Downvote removed" };
  }

  async getUpvoteCount(item: ObjectId) {
    const upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      return { numberUpvotes: 0 };
    }
    return upvotes.upvotes.length;
  }

  async getDownvoteCount(item: ObjectId) {
    const upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      return { numberUpvotes: 0 };
    }
    return upvotes.downvotes.length;
  }

  async assertUserIsReviewer(item: ObjectId, user: ObjectId) {
    const upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      throw new NotFoundError(`Item ${item} does not exist!`);
    }
    if (!this.hasObject(upvotes.reviewers, user)) {
      throw new NotAllowedError(`User ${user} not in Reviewers`);
    }
  }

  async assertUserNotInDownvotes(item: ObjectId, user: ObjectId) {
    const upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      throw new NotFoundError(`Item ${item} does not exist!`);
    }
    if (this.hasObject(upvotes.downvotes, user)) {
      throw new NotAllowedError(`User ${user} in downvotes`);
    }
  }

  async assertUserNotInUpvotes(item: ObjectId, user: ObjectId) {
    const upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      throw new NotFoundError(`Item ${item} does not exist!`);
    }
    if (this.hasObject(upvotes.upvotes, user)) {
      throw new NotAllowedError(`User ${user} in upvotes`);
    }
  }

  async assertUserInUpvotes(item: ObjectId, user: ObjectId) {
    const upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      throw new NotFoundError(`Item ${item} does not exist!`);
    }
    if (!this.hasObject(upvotes.upvotes, user)) {
      throw new NotAllowedError(`User ${user} not in upvotes`);
    }
  }

  async assertUserInDownvotes(item: ObjectId, user: ObjectId) {
    const upvotes = await this.upvotes.readOne({ item: item });
    if (!upvotes) {
      throw new NotFoundError(`Item ${item} does not exist!`);
    }
    if (!this.hasObject(upvotes.downvotes, user)) {
      throw new NotAllowedError(`User ${user} not in downvotes`);
    }
  }
}
