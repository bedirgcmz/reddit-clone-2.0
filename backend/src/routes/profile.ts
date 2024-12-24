import { Router, type Request, type Response } from "express";

import { authenticate } from "../middlewares/authenticate";
import { User } from "../models/user";

const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    if (!userId) {
      res.status(400).json({ message: "missing user id" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    res.status(200).json({
      username: user.username,
      id: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

const editUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req;
    const { username, password } = req.body;

    if (!userId) {
      res.status(400).json({ message: "missing user id" });
      return;
    }

    // Kullanıcıyı bul
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    // Güncellenebilir alanlar
    if (username) {
      user.username = username.trim();
    }

    if (password) {
      user.password = password; // `UserSchema` zaten `pre('save')` ile hash yapıyor
    }

    // Kullanıcıyı kaydet
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating user" });
  }
};

export const profileRouter = Router();

profileRouter.put("/profile", authenticate, editUser);
profileRouter.get("/profile", authenticate, getProfile);
