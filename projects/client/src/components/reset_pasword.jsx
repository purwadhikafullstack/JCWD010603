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
export default function Reset() {
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
          <Image
            fontSize={"26px"}
            color="#F68522"
            justifyContent="center"
            src={Logo}
          ></Image>
          <Flex fontSize={"2xl"} flexDir="column" color="#DCD7C9">
            RESET PASSWORD
          </Flex>
          <Center w="282px" flexDir="column" gap={5} color="#DCD7C9">
            <FormControl id="email">
              <FormLabel>Ketikan Password Baru</FormLabel>
              <Input
                type="text"
                name="username"
                placeholder="new password"
                onChange={inputHandler}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Ketikan Ulang Password Baru</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="confirm new password"
                onChange={inputHandler}
              />
            </FormControl>

            <Button colorScheme={"white"} variant={"solid"} color="#2C3639">
              <Center w="282px" h="45px" bgColor={"#DCD7C9"} borderRadius="3%">
                RESET PASSWORD
              </Center>
            </Button>
            {enable ? (
              <Alert status="error" zIndex={2} variant="top-accent">
                <AlertIcon />
                wrong username/password
              </Alert>
            ) : null}
          </Center>
        </Center>
      </Center>
    </>
  );
}
