import { Router } from "express";

import { waitPayment } from "../controllers/queue.js";

const router = Router();

router.route("/api/v1/queue").post(waitPayment);

export default router;
