import { Router } from "express";
import { param, query } from "express-validator";
import {
  getShowSeat,
  createOrders,
  checkout,
  getAllOrders,
  getPayment,
} from "../controllers/ticket.js";

const router = Router();

router.route("/ticket").post(query("id").not().isEmpty().trim(), getShowSeat);

router.route("/ticket").get(query("id").not().isEmpty().trim(), getShowSeat);

router.route("/order").post(createOrders);

router
  .route("/order")
  .get(query("orderNumber").not().isEmpty().trim(), getAllOrders);

router.route("/checkout").post(checkout);

router.route("/ticket/checkout").get(getPayment);

export default router;
