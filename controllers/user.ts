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
  console.log(req.body);

  try {
    const user = await userModel.checkUser(email);

    if (user) {
      throw new Error("此信箱已註冊過，請重新登入");
    }

    const hashedPassword = bcrypt.hashSync(password, 7);
    const userId = await userModel.createUser(name, email, hashedPassword);
    const token = await signJWT(userId, name, email);

    const data = {
      token,
      email,
      name,
    };

    const COOKIE_OPTIONS = {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "strict",
    } as const;

    res.cookie("jwtToken", token, COOKIE_OPTIONS).status(200).json({ data });
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
  try {
    const user = await userModel.checkUser(email);
    if (!user) {
      throw new Error("您尚未註冊過，請先註冊帳號");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("密碼錯誤");
    }

    const token = await signJWT(user.id, user.username, user.email);

    const data = {
      token,
      email,
      name: user.username,
    };

    const COOKIE_OPTIONS = {
      httpOnly: true,
      path: "/",
      secure: true,
      sameSite: "strict",
    } as const;

    res.cookie("jwtToken", token, COOKIE_OPTIONS).status(200).json({ data });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "sign in failed" });
  }
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

    res.status(200).json({ data });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "get profile failed" });
  }
}
