import express from "express";
import { body } from "express-validator";
import * as validator from "../middleware/validator.js";
import {
  userPage,
  signUp,
  signIn,
  getProfile,
  profilePage,
} from "../controllers/user.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.route("/user").get(userPage);

router
  .route("/user/signup")
  .post([
    body("email").isEmail().normalizeEmail(),
    body("name").exists().notEmpty().trim(),
    body("password").exists().notEmpty(),
    validator.handleResult,
    signUp,
  ]);

router
  .route("/user/signin")
  .post([
    body("email").isEmail().normalizeEmail(),
    body("password").exists().notEmpty(),
    validator.handleResult,
    signIn,
  ]);

router.route("/user/test").get(signIn);

router.route("/api/v1/user/profile").get([authenticate, getProfile]);

router.route("/user/profile").get(profilePage);

export default router;
