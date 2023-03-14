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
  Icon,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { userLogin } from "../redux/middleware/userauth";
import { Link as ReachLink } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
// import { AxiosInstance } from 'axios';
import { useNavigate } from "react-router-dom";
import validator from "validator";
import Logo from "../assets/logo.png";
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
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
    if (isAuth.status && isAuth.data.isVerify) {
      return navigate("/userpage");
    } else if (isAuth.status && !isAuth.data.isVerify) {
      return navigate("/");
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
          <Link to="/userpage" as={ReachLink}>
            <Flex textAlign={"left"} color="white">
              <Icon
                boxSize={"7"}
                as={IoIosArrowBack}
                color="white"
                sx={{
                  _hover: {
                    cursor: "pointer",
                  },
                }}
              ></Icon>
              Back
            </Flex>
          </Link>
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
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" onChange={inputHandler} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" onChange={inputHandler} />
            </FormControl>
            <Flex>
              <Flex justifyContent="right" gap={5}>
                <Link color={"white"}>Forgot Password?</Link>
              </Flex>
            </Flex>

            <Button
              colorScheme={"black"}
              variant={"solid"}
              onClick={login}
              w="282px"
              color="#DCD7C9"
              _hover={{
                bg: "white",
                color: "#2C3639",
                border: "2px solid white",
              }}
            >
              Sign in
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
