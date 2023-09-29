const Asynchandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = Asynchandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    //console.log(`first`, message);
    message = await message.populate("sender", "name pic");
    //console.log(`second`, message);
    message = await message.populate("chat");
    //console.log(`third`, message);
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    //console.log(`fourth`, message);
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = Asynchandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
