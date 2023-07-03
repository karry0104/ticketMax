import { Router } from "express";
import { param, query } from "express-validator";
import { uploadToDisk } from "../middleware/multer.js";
import {
  createShow,
  showForm,
  getShows,
  getShow,
  showDetailPage,
  getShowCampagin,
  campaignForm,
  createShowCampaign,
} from "../controllers/show.js";

const router = Router();

router.route("/admin/show").get(showForm);

router.route("/admin/show/campaign").get(campaignForm);

router
  .route("/api/show/detail")
  .get(query("id").not().isEmpty().trim(), getShow);

router.route("/admin/show").post(
  uploadToDisk.fields([
    { name: "image", maxCount: 1 },
    { name: "seatChart", maxCount: 1 },
  ]),
  createShow
);

router
  .route("/admin/show/campaign")
  .post(
    uploadToDisk.fields([{ name: "image", maxCount: 1 }]),
    createShowCampaign
  );

router.route("/").get(getShows);

router.route("/show/campaign").get(getShowCampagin);

router
  .route("/show/detail")
  .get(query("id").not().isEmpty().trim(), showDetailPage);

export default router;
