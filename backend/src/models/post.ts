import mongoose, { type Document, type Model, model, Schema, Types } from "mongoose";

type TComment = Document & {
  content: string;
  author: Types.ObjectId; // User'a referans
  post: Types.ObjectId; // Gönderiye referans
  createdAt: Date;
  updatedAt: Date;
};

const commentSchema = new Schema<TComment>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // User modeline referans
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post", // Post modeline referans
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

type AuthorWithUsername = {
  _id: Types.ObjectId;
  username: string;
};

type TPost = Document & {
  title: string;
  content?: string;
  author: AuthorWithUsername;
  comments: Types.Array<Types.ObjectId>;
  upvotes: Types.Array<Types.ObjectId>;
  downvotes: Types.Array<Types.ObjectId>;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment", // Comment modeline referans
      },
    ],
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

type PostMethods = {
  upvote: (userId: string) => void;
  downvote: (userId: string) => void;
};

postSchema.method("upvote", function (this: TPost, userId: string) {
  const userObjectId = new Types.ObjectId(userId);

  if (this.upvotes.includes(userObjectId)) {
    return;
  }

  if (this.downvotes.includes(userObjectId)) {
    this.downvotes.pull(userObjectId);
  }

  this.upvotes.push(userObjectId);
});

postSchema.method("downvote", function (this: TPost, userId: string) {
  const userObjectId = new Types.ObjectId(userId);

  if (this.downvotes.includes(userObjectId)) {
    return;
  }

  if (this.upvotes.includes(userObjectId)) {
    this.upvotes.pull(userObjectId);
  }

  this.downvotes.push(userObjectId);
});

postSchema.pre("save", function (next) {
  if (this.isModified("upvotes") || this.isModified("downvotes")) {
    this.score = this.upvotes.length - this.downvotes.length;
  }
  next();
});

type PostModel = Model<TPost, {}, PostMethods>;

export const Post = model<TPost, PostModel>("Post", postSchema);
export const Comment = model<TComment>("Comment", commentSchema);
