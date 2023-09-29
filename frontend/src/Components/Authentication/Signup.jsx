import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [show, setshow] = useState(false);
  const [showconfirm, setshowconfirm] = useState(false);
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [confirmpassword, setconfirmpassword] = useState();
  const [pic, setpic] = useState();
  const [loading, setloading] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const handleClick = (e) => {
    setshow(!show);
  };
  const handleClick2 = () => {
    setshowconfirm(!showconfirm);
  };
  const uploadprofile = (picture) => {
    console.log(picture);
    setloading(true);
    if (picture.type === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
      return;
    }
    if (
      picture.type === "image/jpeg" ||
      picture.type === "image/png" ||
      picture.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", picture);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "db8ttznqd");
      fetch("https://api.cloudinary.com/v1_1/db8ttznqd/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setpic(data.url.toString());
          console.log(data);
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setloading(true);
    if (!name || !email || !password || !confirmpassword) {
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
    if (password !== confirmpassword) {
      toast({
        title: "Password does not match",
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
        "/api/user",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registration Succesful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setloading(false);
    }
  };
  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="frist-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your First Name"
          onChange={(e) => setname(e.target.value)}
          autoComplete="off"
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
          placeholder="Enter Your E-mail"
          onChange={(e) => setemail(e.target.value)}
          autoComplete="off"
        />
      </FormControl>
      <FormControl id="pass-word" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setpassword(e.target.value)}
            autoComplete="off"
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h={"1.75rem"}
              size={"sm"}
              onClick={handleClick}
              background={"white"}
            >
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showconfirm ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setconfirmpassword(e.target.value)}
            autoComplete="off"
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h={"1.75rem"}
              size={"sm"}
              onClick={handleClick2}
              background={"white"}
            >
              {showconfirm ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Choose your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => uploadprofile(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="purple"
        width={"100%"}
        color={"white"}
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
