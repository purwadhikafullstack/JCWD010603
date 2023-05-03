import {
  Flex,
  Image,
  Box,
  Center,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Text,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { adminLogin } from "../redux/middleware/adminauth";
import "../style/admin.css";

import Logo from "../asset/logo.png";

export default function LoginAdmin() {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const [status, setStatus] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loginStat, setLoginStat] = useState("");

  function pressEnter(e) {
    if (e.key === 'Enter') {
      Login();
      // fetchCategory();
    }
  };

  async function Login() {
    try {
      const isAuth = await dispatch(
        adminLogin({
          email,
          password,
        })
      );
      console.log(isAuth.data.message);
      if (isAuth.data.message) {
        setLoginStat("Failed")
        setErrMsg(isAuth.data.message)
      }
      if (isAuth.status) {

        if (isAuth.data.id) {
          setLoginStat("Success")
          return navigate('/dashboard', { state: { admin: isAuth.data }, replace: true });
        }
        return navigate('/admin_login', { state: { admin: isAuth.data }, replace: true });
      }
      return setStatus(true);
    } catch (error) {
      console.log(`Error = ${error}`);
    }
  }
  console.log(errMsg);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const validateEmail = (event) => {
    let email = event.target.value;
    if (!validator.isEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
      setEmail(event.target.value);
    }
  };

  return (
    <>
      <Center
        h="100vh"
        bg="#DCD7C9"
        overflow="auto"
        sx={{
          "::-webkit-scrollbar": {
            height: "0.3em",
            width: "0.3em",
            backgroundColor: "none",
            borderRadius: "10px",
          },
          "::-webkit-scrollbar-thumb": {
            // backgroundColor: '#181D31',
            backgroundColor: "gray.200",
            borderRadius: "10px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555555",
            borderRadius: "10px",
          },
        }}
      >

        <Flex
          className="login-container"
          m="0 auto"
          borderRadius="20"
          overflow="hidden"
          boxShadow="rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset"
        >
          <Box className="login-img-container">
            <Image src="https://images.unsplash.com/photo-1606791405792-1004f1718d0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" />
          </Box>


          <Flex align={"center"} justify={"center"} bg="#2c3639">
            <Stack
              className="login-form"
              spacing={8}
              mx={"auto"}
              maxW={"lg"}
              py={12}
              px={12}
            >

              <Center w="200px" m="0 auto">
                <Image src={Logo} h="auto" objectFit="fill" />
              </Center>
              <Stack align={"center"} px="8">
                <Text fontSize={"lg"} color="white">
                  Login as an administrator
                </Text>
              </Stack>
              <Box rounded={"lg"}>
                <Stack spacing={2}>
                  <FormControl id="email">

                    <FormLabel color="white">Email</FormLabel>
                    <Input
                      type="email"
                      bg="white"
                      placeholder="Email"
                      onChange={(e) => validateEmail(e)} onKeyDown={(e) => pressEnter(e)}
                    />
                  </FormControl>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {emailError}
                  </span>

                  <FormControl id="password">
                    <FormLabel color="white">Password</FormLabel>
                    <Input
                      type="password"
                      bg="white"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => pressEnter(e)}
                    />
                  </FormControl>
                </Stack>
              </Box>

              {loginStat === 'Success' ? (
                <Alert status="success" zIndex={2} variant="top-accent">
                  <AlertIcon />
                  {errMsg}
                </Alert>
              ) : loginStat === 'Failed' ? (
                <Alert status="error" zIndex={2} variant="top-accent">
                  <AlertIcon />
                  {errMsg}
                </Alert>
              ) : null}

              <Button
                bg="#DCD7C9"
                color="#2C3639"
                _hover={{
                  bg: "#a8a396",
                  color: "WHITE",
                }}
                _active={{
                  transform: "scale(0.98)",
                  transition: "1ms all",
                }}
                onClick={Login}
              >
                Sign in
              </Button>

            </Stack>
          </Flex>
        </Flex>
      </Center>
    </>
  );
}
