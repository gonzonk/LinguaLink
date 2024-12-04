import EventingConcept from "./concepts/eventing";
import DictionaryingConcept from "./concepts/dictionarying";
import FriendingConcept from "./concepts/friending";
import PostingConcept from "./concepts/posting";
import ProfilingConcept from "./concepts/profiling";
import SessioningConcept from "./concepts/sessioning";
import UpvotingConcept from "./concepts/upvoting";
import FlashcardingConcept from "concepts/flashcarding";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Profiling = new ProfilingConcept("profiles");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const Upvoting = new UpvotingConcept("votes");
export const Dictionarying = new DictionaryingConcept("dictionary");
export const Eventing = new EventingConcept("events");
export const Flashcarding = new FlashcardingConcept("flashcards");
