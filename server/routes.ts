import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Dictionarying, Friending, Posting, Profiling, Sessioning, Upvoting, Eventing, Tagging, Flashcarding, Wordling } from "./app";
import { Dialects, UserRole } from "./concepts/profiling";
import { SessionDoc } from "./concepts/sessioning";
import Responses from "./responses";

import { z } from "zod";
import { PostDoc } from "concepts/posting";

/**
 * Web server routes for the app. Implements synchronizations between concepts.
 */
class Routes {
  // Synchronize the concepts from `app.ts`.

  @Router.get("/session")
  async getSessionUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Profiling.getUserById(user);
  }

  @Router.get("/users")
  async getProfiles() {
    return await Profiling.getProfiles();
  }

  @Router.get("/users/:username")
  @Router.validate(z.object({ username: z.string().min(1) }))
  async getUser(username: string) {
    return await Profiling.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: SessionDoc, username: string, password: string, description: string, role: UserRole, dialect: Dialects) {
    Sessioning.isLoggedOut(session);
    return await Profiling.create(username, password, description, role, dialect);
  }

  @Router.patch("/users/username")
  async updateUsername(session: SessionDoc, username: string) {
    const user = Sessioning.getUser(session);
    return await Profiling.updateUsername(user, username);
  }

  @Router.patch("/users/password")
  async updatePassword(session: SessionDoc, currentPassword: string, newPassword: string) {
    const user = Sessioning.getUser(session);
    return Profiling.updatePassword(user, currentPassword, newPassword);
  }

  @Router.patch("/users/description")
  async updateDescription(session: SessionDoc, description: string) {
    const user = Sessioning.getUser(session);
    return await Profiling.updateDescription(user, description);
  }

  @Router.patch("/users/role")
  async updateRole(session: SessionDoc, role: UserRole) {
    const user = Sessioning.getUser(session);
    return await Profiling.updateRole(user, role);
  }

  @Router.patch("/users/dialect")
  async updateDialect(session: SessionDoc, dialect: Dialects) {
    const user = Sessioning.getUser(session);
    return await Profiling.updateDialect(user, dialect);
  }

  @Router.delete("/users")
  async deleteUser(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    Sessioning.end(session);
    return await Profiling.delete(user);
  }

  @Router.post("/login")
  async logIn(session: SessionDoc, username: string, password: string) {
    const u = await Profiling.authenticate(username, password);
    Sessioning.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: SessionDoc) {
    Sessioning.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(id?: string) {
    if (id) {
      const oid = new ObjectId(id);
      const post = await Posting.getPost(oid);
      return Responses.post(post);
    } else {
      const posts = await Posting.getPosts();
      const updatedPosts = [];
      for (const post of posts) {
        const { votes } = await Upvoting.getVotes(post._id);
        const tags = await Tagging.getItemTags(post._id);
        updatedPosts.push({
          ...post,
          upvotes: votes!.upvotes,
          downvotes: votes!.downvotes,
          tags,
        });
      }
      return Responses.posts(updatedPosts);
    }
  }

  @Router.get("/posts/:word")
  async getPostsByWord(word: string) {
    const entry = await Dictionarying.getEntry(word);
    if (!entry) {
      return [];
    } else {
      const postIds = entry.posts;
      const posts = [];
      for (const postId of postIds) {
        const post = await Posting.getPost(postId);
        const { votes } = await Upvoting.getVotes(postId);
        const tags = await Tagging.getItemTags(postId);
        posts.push({
          ...post,
          upvotes: votes!.upvotes,
          downvotes: votes!.downvotes,
          tags,
        });
      }

      return Responses.posts(posts);
    }
  }

  @Router.post("/tags")
  async addTag(tag: string, itemId: string) {
    const oid = new ObjectId(itemId);
    await Tagging.addTag(tag, oid);
    return {
      msg: "Tag added successfully",
    };
  }

  @Router.get("/tags")
  async getAllTags() {
    return await Tagging.getAllTags();
  }

  @Router.delete("/tags/:tag/:itemId")
  async removeTag(tag: string, itemId: string) {
    const oid = new ObjectId(itemId);
    await Tagging.removeTag(tag, oid);
    return {
      msg: "Tag removed successfully",
    };
  }

  @Router.get("/entries")
  async getEntries() {
    const entries = await Dictionarying.getAllEntries();
    const result = [];
    for (const e of entries) {
      const postId = e.posts.at(0);
      const post = await Posting.getPost(postId as ObjectId);
      result.push({ word: post.word, translation: post.translation });
    }
    return result;
  }

  @Router.get("/entries/:tag")
  async getEntriesByTag(tag: string) {
    const postIds = await Tagging.getItemsByTag(tag); // Get posts that match the tag
    const entries = {};
    for (const postId of postIds) {
      const post = await Posting.getPost(postId);
      const { word } = post;
      if (!(word in entries)) {
        // No more than one post per entry in the filtered results
        Object.assign(entries, { word: post });
      }
    }

    return Object.values(entries);
  }

  @Router.post("/posts")
  async createPost(session: SessionDoc, word: string, translation: string, imageUrl?: string, audioUrl?: string, tag?: string) {
    const user = Sessioning.getUser(session);
    const created = await Posting.create(user, word, translation, imageUrl, audioUrl);
    await Dictionarying.addItem(word, created.post!._id);
    await Wordling.addWord(word);
    if (tag !== "") {
      await Tagging.addTag(tag!, created.post!._id);
    }
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:id")
  async updatePost(session: SessionDoc, id: string, translation?: string, imageUrl?: string, audioUrl?: string, tag?: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    if (tag !== "") {
      await Tagging.setTag(tag!, oid);
    }
    return await Posting.update(oid, translation, imageUrl, audioUrl);
  }

  @Router.delete("/posts/:id")
  async deletePost(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Posting.assertAuthorIsUser(oid, user);
    const post = await Posting.getPost(oid);
    await Posting.delete(oid);
    const entryDeleted = await Dictionarying.deleteItem(post.word, oid);
    if (entryDeleted) {
      await Wordling.removeWord(post.word);
    }
    return { msg: "Post deleted successfully!" };
  }

  @Router.get("/friends")
  async getFriends(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Profiling.idsToUsernames(await Friending.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: SessionDoc, friend: string) {
    const user = Sessioning.getUser(session);
    const friendOid = (await Profiling.getUserByUsername(friend))._id;
    return await Friending.removeFriend(user, friendOid);
  }

  @Router.get("/friend/requests")
  async getRequests(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    return await Responses.friendRequests(await Friending.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Profiling.getUserByUsername(to))._id;
    return await Friending.sendRequest(user, toOid);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: SessionDoc, to: string) {
    const user = Sessioning.getUser(session);
    const toOid = (await Profiling.getUserByUsername(to))._id;
    return await Friending.removeRequest(user, toOid);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Profiling.getUserByUsername(from))._id;
    return await Friending.acceptRequest(fromOid, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: SessionDoc, from: string) {
    const user = Sessioning.getUser(session);
    const fromOid = (await Profiling.getUserByUsername(from))._id;
    return await Friending.rejectRequest(fromOid, user);
  }

  @Router.put("/upvotes/upvote/")
  async upvote(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    await Profiling.assertProfileIsTeacher(user);
    const ItemOid = new ObjectId(id);
    const upvoted = await Upvoting.usersUpvoted(ItemOid, user);
    const downvoted = await Upvoting.usersDownvoted(ItemOid, user);
    let response;
    if (upvoted) {
      response = await Upvoting.removeUpvote(ItemOid, user);
    } else if (downvoted) {
      await Upvoting.removeDownvote(ItemOid, user);
      response = await Upvoting.upvoteItem(ItemOid, user);
    } else {
      response = await Upvoting.upvoteItem(ItemOid, user);
    }
    return response;
  }

  @Router.put("/upvotes/downvote")
  async downvote(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    await Profiling.assertProfileIsTeacher(user);
    const ItemOid = new ObjectId(id);
    const upvoted = await Upvoting.usersUpvoted(ItemOid, user);
    const downvoted = await Upvoting.usersDownvoted(ItemOid, user);
    let response;
    if (downvoted) {
      response = await Upvoting.removeDownvote(ItemOid, user);
    } else if (upvoted) {
      await Upvoting.removeUpvote(ItemOid, user);
      response = await Upvoting.downvoteItem(ItemOid, user);
    } else {
      response = await Upvoting.downvoteItem(ItemOid, user);
    }
    return response;
  }

  @Router.get("/upvotes/:id")
  async countUpvotes(id: string) {
    const ItemOid = new ObjectId(id);
    return await Upvoting.getUpvoteCount(ItemOid);
  }

  @Router.get("/downvotes/:id")
  async countDownvotes(id: string) {
    const ItemOid = new ObjectId(id);
    return await Upvoting.getDownvoteCount(ItemOid);
  }

  @Router.get("/upvotes/user/:id")
  async userUpvoted(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const ItemOid = new ObjectId(id);
    return await Upvoting.usersUpvoted(ItemOid, user);
  }

  @Router.get("/downvotes/user/:id")
  async userDownvoted(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const ItemOid = new ObjectId(id);
    return await Upvoting.usersDownvoted(ItemOid, user);
  }

  @Router.get("/events")
  async getEvents(id?: string) {
    if (id) {
      const oid = new ObjectId(id);
      const event = await Eventing.getEvent(oid);
      return Responses.event(event);
    } else {
      const events = await Eventing.getEvents();
      return Responses.events(events);
    }
  }

  @Router.post("/events")
  async createEvent(session: SessionDoc, title: string, description: string, time: string, location: string) {
    const user = Sessioning.getUser(session);
    const created = await Eventing.create(user, title, description, time, location);
    return { msg: created.msg, event: await Responses.event(created.event) };
  }

  @Router.patch("/events/:id")
  async updateEvent(session: SessionDoc, id: string, title?: string, description?: string, time?: string, location?: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Eventing.assertAuthorIsUser(oid, user);
    return await Eventing.update(oid, title, description, time, location);
  }

  @Router.delete("/events/:id")
  async deleteEvent(session: SessionDoc, id: string) {
    const user = Sessioning.getUser(session);
    const oid = new ObjectId(id);
    await Eventing.assertAuthorIsUser(oid, user);
    await Eventing.delete(oid);
    return { msg: "Event deleted successfully!" };
  }

  @Router.post("/flashcards")
  async createFlashcards(session: SessionDoc, name: string, item: PostDoc) {
    const user = Sessioning.getUser(session);
    const userName = (await Profiling.getUserById(user)).username;
    console.log("post item", item);
    await Flashcarding.createFlashcards(user, userName, name, item);
    return { msg: "Flashcards created" };
  }

  @Router.patch("/flashcards/:name")
  async updateFlashcards(session: SessionDoc, name: string, item: PostDoc) {
    const user = Sessioning.getUser(session);
    console.log("patch item", item);
    await Flashcarding.addToFlashcards(name, user, item);
    return { msg: "Flashcards updated" };
  }

  @Router.get("/flashcards/:name")
  async getFlashcards(session: SessionDoc, name?: string, author?: ObjectId, id?: ObjectId) {
    let cards;
    if (id) {
      console.log("id");
      cards = await Flashcarding.getFlashcards(id);
    } else if (author) {
      console.log("author");
      cards = await Flashcarding.getFlashcardsByAuthor(author);
    } else if (name) {
      console.log("name");
      cards = await Flashcarding.getFlashcardsByName(name);
    } else {
      console.log("all");
      cards = await Flashcarding.getAllFlashcards();
    }
    return { flashcards: cards };
  }

  @Router.delete("/flashcards/:name")
  async deleteGroup(session: SessionDoc, name: string) {
    const user = Sessioning.getUser(session);
    await Flashcarding.deleteFlashcards(user, name);
    return { msg: "group deleted" };
  }

  @Router.get("/flashcards")
  async getAllFlashcards() {
    const cards = await Flashcarding.getAllFlashcards();
    return { flashcards: cards };
  }

  @Router.get("/authoredFlashcards")
  async getFlashcardsAuthored(session: SessionDoc) {
    const user = Sessioning.getUser(session);
    const cards = await Flashcarding.getFlashcardsByAuthor(user);
    return { flashcards: cards };
  }

  @Router.get("/wordle/:newDate")
  async handleNewDay(newDate: string) {
    const word = await Wordling.handleNewDay(newDate);
    return word;
  }
}

/** The web app. */
export const app = new Routes();

/** The Express router. */
export const appRouter = getExpressRouter(app);
