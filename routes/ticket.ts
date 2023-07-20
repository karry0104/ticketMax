import { Router } from "express";
import { check, param, query } from "express-validator";
import {
  createOrders,
  getPayment,
  deleteOrder,
  checkPaid,
  thankPage,
  checkoutPage,
} from "../controllers/ticket.js";
import authenticate from "../middleware/authenticate.js";
import * as validator from "../middleware/validator.js";

import { killTicket } from "../middleware/lock.js";

const router = Router();

router.route("/order").get(query("id").not().isEmpty().trim(), thankPage);

router.route("/checkout").get(checkoutPage);

router
  .route("/api/v1/order")
  .delete(
    query("id").not().isEmpty().trim(),
    validator.handleResult,
    deleteOrder
  );

router.route("/api/v1/order").post([authenticate, killTicket, createOrders]);

router.route("/api/v1/checkPaid").post(checkPaid);

router.route("/api/v1/ticket/checkout").get([authenticate, getPayment]);

export default router;
