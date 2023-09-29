const express = require("express");
//const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectdb = require("./config/db");
const colors = require("colors");
const userRouter = require("./Router/userRouter");
const chatRouter = require("./Router/chatRouter");
const messageRouter = require("./Router/messageRouter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

dotenv.config();
connectdb();
app.use(express.json());
app.get("/", (req, res) => {
  res.send(`API is Running`);
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server start at port ${PORT}`.yellow.bold));
