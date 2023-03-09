import {
  Button,
  Checkbox,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { userLogin } from "../redux/middleware/userauth";
import { useDispatch } from "react-redux";
// import { AxiosInstance } from 'axios';
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [enable, setEnable] = useState(false);

  useEffect(() => {
    setEnable(false);
    console.log(user);
  }, []);
  useEffect(() => {
    console.log(user);
  }, [user]);

  async function login() {
    const isAuth = await dispatch(userLogin(user));
    console.log(isAuth);
    if (isAuth.status && isAuth.data.isVerivy) {
      return navigate("/userpage");
    } else if (isAuth.status && !isAuth.data.isVerivy) {
      return navigate("/userpage");
    }

    return setEnable(true);
  }

  function inputHandler(event) {
    const { name, value } = event.target;

    setUser({
      ...user,
      [name]: value,
    });
  }

  return (
    <>
      <Center p={8} flex={1} align={"center"} justifyContent={"center"}>
        <Center
          spacing={4}
          maxW={"md"}
          bgColor="#2C3639"
          w="430px"
          h="932px"
          color="white"
          flexDir="column"
          gap={8}
        >
          <Flex fontSize={"2xl"} flexDir="column" color="#DCD7C9">
            SELAMAT DATANG DI AKUN
          </Flex>
          <Image
            fontSize={"26px"}
            color="#F68522"
            justifyContent="center"
            src={Logo}
          ></Image>

          <Center w="282px" flexDir="column" gap={5} color="#DCD7C9">
            <FormControl id="email">
              <FormLabel>Username</FormLabel>
              <Input type="text" name="username" onChange={inputHandler} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" onChange={inputHandler} />
            </FormControl>
            <Flex spacing={6}>
              <Flex
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
                gap={5}
              >
                <Checkbox>Remember Me</Checkbox>
                <Link color={"blue.500"}>Forgot Password?</Link>
              </Flex>
            </Flex>

            <Button
              colorScheme={"white"}
              variant={"solid"}
              onClick={login}
              color="#2C3639"
            >
              <Center w="282px" h="45px" bgColor={"#DCD7C9"} borderRadius="3%">
                Sign in
              </Center>
            </Button>

            {enable ? (
              <Alert
                status="error"
                zIndex={2}
                variant="top-accent"
                color="black"
              >
                <AlertIcon />
                Username/ Password Salah
              </Alert>
            ) : null}
          </Center>
        </Center>
      </Center>
    </>
  );
}
