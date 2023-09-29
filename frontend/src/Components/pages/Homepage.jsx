import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const User = JSON.parse(localStorage.getItem("userInfo"));
    if (User) {
      history.push("/chats");
    }
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={"3"}
        bg={"white"}
        w="100%"
        m="30px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
        textAlign={"center"}
      >
        <Text
          fontSize={"4xl"}
          fontFamily={"Work Sans"}
          color={"purple"}
          fontWeight={"600"}
        >
          WebChat Nexus
        </Text>
      </Box>
      <Box
        bg={"white"}
        borderRadius={"lg"}
        w={"100%"}
        p={4}
        color={"black"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList>
            <Tab width={"50%"}>Log In</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
