import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Spinner, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscelleneous/ProfileModal";
import UpdateGroupChatModal from "./miscelleneous/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setfetchAgain }) => {
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState([]);
  const [newMessage, setnewMessage] = useState();
  const { user, selectedChat, setselectedChat } = ChatState();

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work Sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setselectedChat("")}
            />

            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setfetchAgain={setfetchAgain}
                />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users).toUpperCase()}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? <Spinner></Spinner> : <></>}
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"}>
            Click on User to start
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;