const asynchandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const accessChat = asynchandler(async (req, res) => {
  const { userId, userName } = req.body;
  if (!userId) {
    console.log("userID param is not sent with request");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  //console.log(isChat);
  isChat = await User.populate(isChat, {
    path: "latestMeassage sender",
    select: "name pic email",
  });
  console.log(isChat);
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.Message);
    }
  }
});

const fetchChats = asynchandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMeassage.sender",
          select: "name pic email",
        });
        res.status(200).send(result);
      });
  } catch (error) {}
});

const createGroupChat = asynchandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// const createGroupChat = asynchandler(async (req, res) => {
//   if (!req.body.users || !req.body.name) {
//     return res.status(400).send({ message: "Please fill all the fields" });
//   }
//   var users = JSON.parse(req.body.users);
//   if (users.length < 2) {
//     return res
//       .status(400)
//       .send({ message: "More than 2 user is required to make a group" });
//   }
//   users.push(req.user);
//   try {
//     const groupChat = await Chat.create({
//       chatName: req.body.name,
//       isGroupChat: true,
//       users: users,
//       groupAdmin: req.user,
//     });

//     const fullGroupChat = await Chat.find({
//       _id: { $eq: groupChat._id },
//     })
//       .populate("users", "-password")
//       .populate("groupAdmin", "-password");
//     res.status(200).send(fullGroupChat);
//   } catch (error) {}
// });

const renameGroup = asynchandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  // console.log(chatId);

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat is not found");
  } else {
    res.json(updatedChat);
  }
});

const removeFromGroup = asynchandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!remove) {
    res.status(400);
    throw new Error("Chat is not found");
  } else {
    res.json(remove);
  }
});

const addToGroup = asynchandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(400);
    throw new Error("Chat is not found");
  } else {
    res.json(added);
  }
});

// const addToGroup = asynchandler(async (req, res) => {
//   const { chatId, userId } = req.body;

//   // check if the requester is admin

//   const added = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $push: { users: userId },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!added) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   } else {
//     res.json(added);
//   }
// });

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};