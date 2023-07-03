import { Router } from "express";
import { check, param, query } from "express-validator";
import {
  getShowSeat,
  createOrders,
  getPaidOrders,
  getPayment,
  deleteOrder,
  checkPaid,
  checkoutPage,
  countDown,
  checkSQS,
} from "../controllers/ticket.js";
import authenticate from "../middleware/authenticate.js";

import { killTicket } from "../middleware/lock.js";

const router = Router();

router
  .route("/ticket")
  .post(query("id").not().isEmpty().trim(), authenticate, getShowSeat);

router
  .route("/ticket")
  .get(query("id").not().isEmpty().trim(), authenticate, getShowSeat);

router.route("/order").delete(query("id").not().isEmpty().trim(), deleteOrder);

router.route("/order").get(query("id").not().isEmpty().trim(), getPaidOrders);

router.route("/order").post([authenticate, killTicket, createOrders]);

router.route("/checkPaid").post(checkPaid);

router.route("/ticket/checkout").get([authenticate, getPayment]);

router.route("/ticket/countDown").get(countDown);

router.route("/checkSQS").post(checkSQS);

export default router;
