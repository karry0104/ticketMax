import { Router } from "express";
import { uploadToDisk, uploadToBuffer } from "../middleware/multer.js";
import {
  createShow,
  showForm,
  getShows,
  getShowCampagin,
  campaignForm,
  createShowCampaign,
} from "../controllers/show.js";

const router = Router();

router.route("/admin/show").get(showForm);

router.route("/admin/show/campaign").get(campaignForm);

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

router.route("/api/v1/shows").get(getShows);

export default router;
