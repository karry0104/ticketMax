import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import showRouter from "./routes/show.js";
import ticketRouter from "./routes/ticket.js";
import userRouter from "./routes/user.js";
import queueRouter from "./routes/queue.js";
import { errorHandler } from "./utils/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { Server } from "socket.io";

const app = express();
const port = 3000;

const httpServer = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const router = Router();

router.use(function (req, res, next) {
  next();
});
//app.use(rateLimiter);

app.use(cors());

app.enable("trust proxy");

app.use(showRouter, ticketRouter, userRouter, queueRouter);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send({ hi: "there" });
});

app.use(errorHandler);

app.use("/uploads", express.static("./uploads"));
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Hello!");

  socket.on("disconnect", () => {
    console.log("Bye~");
  });
});

// app.get("*", (req, res) => {
//   res.redirect("/");
// });
