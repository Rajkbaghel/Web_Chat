import {
  Button,
  InputRightElement,
  VStack,
  InputGroup,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [show, setshow] = useState(false);
  const [password, setpassword] = useState();
  const [email, setemail] = useState();
  const [loading, setloading] = useState(false);
  const history = useHistory();
  const toast = useToast();
  const handleClick = () => setshow(!show);
  const submitHandler = async () => {
    setloading(true);
    if (!email || !password) {
      toast({
        title: "Fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      //console.log(data);
      toast({
        title: "Login Succesful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };
  return (
    <VStack>
      <FormControl id="Email" isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
          placeholder="Enter Your E-mail"
          onChange={(e) => setemail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h={"1.75rem"}
              size={"sm"}
              onClick={handleClick}
              background={"none"}
            >
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="purple"
        width={"100%"}
        color={"white"}
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Log In
      </Button>
    </VStack>
  );
};

export default Login;
