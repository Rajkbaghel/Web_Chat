import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import ChatResult from "../ChatResult";
import UserBadgeItem from "../UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  //const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user, Chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    //setSearch(query);
    //console.log(search);
    if (!query) {
      setSearchResult([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      //console.log(data);
      setLoading(false);
      setSearchResult(data);
      //console.log(`Seach`, searchResult);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  //console.log(groupChatName);
  const handleSubmit = async () => {
    //console.log(`${groupChatName} ${selectedUser.map((u) => u.name)}`);
    if (!groupChatName || !selectedUser) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );
      //console.log(`DATA`, data);
      setChats([data, ...Chats]);
      // console.log(`CHats`, [...data, ...Chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleDelete = (delUser) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id));
  };
  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    console.log(searchResult);
    setSelectedUser([...selectedUser, userToAdd]);
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder={"Add User to Group"}
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                autoComplete="off"
              />
            </FormControl>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {selectedUser.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <ChatResult
                    key={user._id}
                    user={user}
                    handleClick={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="purple" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default GroupChatModal;
