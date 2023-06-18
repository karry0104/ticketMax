import express, { Router } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import showRouter from "./routes/show.js";
import ticketRouter from "./routes/ticket.js";
import { errorHandler } from "./utils/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const router = Router();

router.use(function (req, res, next) {
  next();
});
app.use(rateLimiter);

app.use(showRouter, ticketRouter);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send({ hi: "there" });
});

app.use(errorHandler);

app.use("/uploads", express.static("./uploads"));
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`it's alive on port ${port}`);
});
