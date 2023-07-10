import { Router } from "express";
import { param, query } from "express-validator";
import { uploadToDisk, uploadToBuffer } from "../middleware/multer.js";
import {
  createShow,
  showForm,
  getShows,
  getShow,
  showDetailPage,
  getShowCampagin,
  campaignForm,
  createShowCampaign,
  homePage,
} from "../controllers/show.js";

const router = Router();

router.route("/admin/show").get(showForm);

router.route("/admin/show/campaign").get(campaignForm);

router.route("/").get(homePage);

router.route("/show").get(query("id").not().isEmpty().trim(), showDetailPage);

router.route("/api/v1/shows").get(getShows);

router.route("/api/v1/show").get(query("id").not().isEmpty().trim(), getShow);

router.route("/admin/show").post(
  uploadToBuffer.fields([
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

router.route("/show/campaign").get(getShowCampagin);

export default router;
