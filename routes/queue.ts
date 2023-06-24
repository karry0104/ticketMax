import { Router } from "express";

import { waitPayment } from "../controllers/queue.js";

const router = Router();

router.route("/queue").post(waitPayment);

export default router;
