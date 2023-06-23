import { Router } from "express";
import { param, query } from "express-validator";
import {
  getShowSeat,
  createOrders,
  checkout,
  getAllOrders,
  getPayment,
  deleteOrder,
} from "../controllers/ticket.js";

import { killTicket } from "../middleware/lock.js";

const router = Router();

router.route("/ticket").post(query("id").not().isEmpty().trim(), getShowSeat);

router.route("/ticket").get(query("id").not().isEmpty().trim(), getShowSeat);

//router.route("/test").get(query("id").not().isEmpty().trim(), getShowSeat);

router.route("/order").delete(query("id").not().isEmpty().trim(), deleteOrder);

router.route("/order").get(query("id").not().isEmpty().trim(), getAllOrders);

router.route("/order").post([killTicket, createOrders]);

router.route("/checkout").post(checkout);

router.route("/ticket/checkout").get(getPayment);

export default router;
