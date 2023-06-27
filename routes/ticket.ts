import { Router } from "express";
import { check, param, query } from "express-validator";
import {
  getShowSeat,
  createOrders,
  getAllOrders,
  getPayment,
  deleteOrder,
  checkPaid,
  checkoutPage,
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

router.route("/order").get(query("id").not().isEmpty().trim(), getAllOrders);

router.route("/order").post([authenticate, killTicket, createOrders]);

router.route("/checkPaid").post(checkPaid);

router.route("/ticket/checkout").get([authenticate, getPayment]);

router.route("/checkSQS").post(checkSQS);

// router.route("/checkout").get(checkoutPage);

// router.route("/ticket/checkout").post([authenticate, getPayment]);

export default router;
