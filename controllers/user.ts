import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as userModel from "../models/user.js";
import signJWT, { EXPIRE_TIME } from "../utils/signJWT.js";
import path from "path";

const __dirname = path.resolve();

export async function userPage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/user.html"));
}

export async function profilePage(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "/views/html/profile.html"));
}

export async function signUp(req: Request, res: Response) {
  const { name, email, password } = req.body;

  try {
    const user = await userModel.checkUser(email);

    if (Array.isArray(user) && user.length > 0) {
      res.status(403).send("email already exists");
    }

    const hashedPassword = bcrypt.hashSync(password, 7);
    const userId = await userModel.createUser(name, email, hashedPassword);
    const token = await signJWT(userId, name, email);

    res.cookie("jwtoken", token).status(200);

    return res.redirect("/profile");
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "sign up failed" });
  }
}

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await userModel.checkUser(email);
  if (!user) {
    throw new Error("user not exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(403).send("Invalid password");
  }

  const token = await signJWT(user.id, user.username, user.email);

  res.cookie("jwtoken", token).status(200);

  return res.redirect("/profile");
}

export async function getProfile(req: Request, res: Response) {
  try {
    const email = res.locals.email;
    const user = await userModel.checkUser(email);
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    //res.render("profile", { data });
    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "get profile failed" });
  }
}
