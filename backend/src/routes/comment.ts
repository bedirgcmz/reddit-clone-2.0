import { NextFunction, Router, type Request, type Response } from "express";
import { isValidObjectId } from "mongoose";

import { Post } from "../models/post";
import { authenticate } from "../middlewares/authenticate";

const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!isValidObjectId(postId)) {
      res.status(400).json({ message: "Invalid post ID" });
      return;
    }

    const post = await Post.findById(postId).populate({
      path: "comments.author",
      select: "username",
    });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const comments = post.comments.map((comment) => ({
      id: comment._id,
      content: comment.content,
      author: {
        id: comment.author._id,
        username: comment.author.username,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(postId)) {
      res.status(400).json({ message: "Invalid post ID" });
      return;
    }

    if (!content || typeof content !== "string") {
      res.status(400).json({ message: "Malformed content" });
      return;
    }

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const comment = post.comments.create({
      content,
      author: req.userId,
    });

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { postId, commentId } = req.params;

    if (!isValidObjectId(postId) || !isValidObjectId(commentId)) {
      res.status(400).json({ message: "Invalid post or comment ID" });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id?.toString() === commentId
    );

    if (commentIndex === -1) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const comment = post.comments[commentIndex];

    // Ensure the user deleting the comment is the owner
    if (comment.author.toString() !== req.userId) {
      res.status(403).json({ message: "You are not authorized to delete this comment" });
      return;
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const commentRouter = Router();

commentRouter.get("/comments/:postId", getCommentsByPostId);
commentRouter.post("/comments/:postId", authenticate, createComment);
commentRouter.delete("/comments/:postId/:commentId", authenticate, deleteComment);
