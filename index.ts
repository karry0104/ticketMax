import express, { Router } from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import showRouter from "./routes/show.js";
import ticketRouter from "./routes/ticket.js";
import userRouter from "./routes/user.js";
import queueRouter from "./routes/queue.js";
import { errorHandler } from "./utils/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const router = Router();

router.use(function (req, res, next) {
  next();
});

app.use(rateLimiter);

app.use(cors());

app.enable("trust proxy");

app.use(showRouter, ticketRouter, userRouter, queueRouter);

app.use(errorHandler);

app.use("/uploads", express.static("./uploads"));

const __dirname = path.resolve();

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/html/error.html"));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
