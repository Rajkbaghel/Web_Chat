import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";
import axios from "axios";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Tag,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import ChatResult from "../ChatResult";

const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
  <Box p="1">
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  </Box>
));

const SideDrawer = () => {
  const [search, setsearch] = useState();
  const [searchResult, setsearchResult] = useState();
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState(false);
  const { user, setselectedChat, Chats, setChats } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const logoutHandler = () => {
    localStorage.clear("userInfo");
    history.push("/");
  };
  const accessChat = async (userId) => {
    try {
      setloadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`api/chat`, { userId }, config);

      if (!Chats.find((c) => c._id === data._id)) setChats([data, ...Chats]);
      setselectedChat(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Fetching the chat",
        status: "error",
        isClosable: true,
        duration: 3000,
        position: "top-left",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Enter text to Search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    } else {
      try {
        setloading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(`api/user?search=${search}`, config);
        console.log({ data });
        // if (!data) {
        //   toast({
        //     title: "No data found",
        //     status: "info",
        //     duration: 3000,
        //     isClosable: true,
        //     position: "top-left",
        //   });
        // }
        setloading(false);
        setsearchResult(data);
      } catch (error) {
        toast({
          title: "Error",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"0px 10px"}
        borderBottomWidth="5px"
      >
        <Tooltip label="Search User to Chat" hasArrow placement="bottom-end">
          <CustomCard>
            <Button variant={"ghost"} onClick={onOpen}>
              <SearchIcon />
              <Text display={{ base: "none", md: "flex" }} p={"4"}>
                Search User
              </Text>
            </Button>
          </CustomCard>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          WebChat Nexus
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} m={1}></BellIcon>
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              ></Avatar>
              <ChevronDownIcon></ChevronDownIcon>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={"2"}>
              <Input
                placeholder="Search by Name or Email"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <ChatResult
                  key={user._id}
                  user={user}
                  handleClick={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
