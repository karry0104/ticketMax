import { Router } from "express";
import { check, param, query } from "express-validator";
import {
  getShowSeat,
  createOrders,
  getPaidOrders,
  getPayment,
  deleteOrder,
  checkPaid,
  thankPage,
  countDown,
  checkoutPage,
} from "../controllers/ticket.js";
import authenticate from "../middleware/authenticate.js";

import { killTicket } from "../middleware/lock.js";

const router = Router();

router.route("/order").get(query("id").not().isEmpty().trim(), thankPage);

router.route("/checkout").get(checkoutPage);

router.route("/ticket").post(query("id").not().isEmpty().trim(), getShowSeat);

router.route("/ticket").get(query("id").not().isEmpty().trim(), getShowSeat);

router
  .route("/api/v1/order")
  .delete(query("id").not().isEmpty().trim(), deleteOrder);

router
  .route("/api/v1/order")
  .get(query("id").not().isEmpty().trim(), getPaidOrders);

router.route("/api/v1/order").post([authenticate, killTicket, createOrders]);

router.route("/api/v1/checkPaid").post(checkPaid);

router.route("/api/v1/ticket/checkout").get([authenticate, getPayment]);

router.route("/api/v1/ticket/countDown").get(countDown);

export default router;
