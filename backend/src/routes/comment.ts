import { Request, Response, Router } from "express";
import { isValidObjectId, Types } from "mongoose";
import { Comment, Post } from "../models/post";
import { authenticate } from "../middlewares/authenticate";

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    // ObjectId doğrulaması
    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid post ID format" });
      return;
    }

    const comments = await Comment.find({ post: postId })
      .populate({
        path: "author",
        select: "username", // Yalnızca username'i al
      })
      .exec();

    if (!comments.length) {
      res.status(404).json({ message: "No comments found for this post" });
      return;
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a comment
const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !isValidObjectId(postId)) {
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

    const comment = await Comment.create({
      content,
      author: req.userId,
      post: postId,
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ id: comment._id });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

// Delete a comment
const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid comment ID" });
      return;
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.author.toString() !== req.userId) {
      res.status(403).json({ message: "You are not allowed to delete this comment" });
      return;
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

// Edit a comment
const editComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid comment ID" });
      return;
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.author.toString() !== req.userId) {
      res.status(403).json({ message: "You are not allowed to edit this comment" });
      return;
    }

    const { content } = req.body;

    if (content !== undefined && typeof content !== "string") {
      res.status(400).json({ message: "Malformed content" });
      return;
    }

    await comment.updateOne({ content });
    res.status(200).json({ message: "Comment updated" });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};
console.log(Types.ObjectId.isValid("67598092e977701a6ee56531")); // true veya false dönecektir

export const commentRouter = Router();

// Attach routes to the router
commentRouter.post("/comments", authenticate, createComment);
commentRouter.delete("/comments/:id", authenticate, deleteComment);
commentRouter.get("/comments/:postId", getCommentsByPost);
commentRouter.put("/comments/:id", authenticate, editComment);