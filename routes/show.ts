import { Router } from "express";
import { param, query } from "express-validator";
import { uploadToDisk } from "../middleware/multer.js";
import {
  createShow,
  showForm,
  getShows,
  getShow,
} from "../controllers/show.js";

const router = Router();

router.route("/admin/show").get(showForm);

router.route("/admin/show").post(
  uploadToDisk.fields([
    { name: "image", maxCount: 1 },
    { name: "seatChart", maxCount: 1 },
  ]),
  createShow
);

router.route("/").get(getShows);

router
  .route("/show/detail/:id")
  .get(param("id").not().isEmpty().trim(), getShow);

export default router;
