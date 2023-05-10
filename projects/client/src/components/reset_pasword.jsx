import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Icon,
  Image,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as ReachLink } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Logo from "../assets/logo.png";
export default function Reset() {
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
      <Flex flex={1} align={"center"} justifyContent={"center"}>
        <Flex
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
            <Flex textAlign={"left"} py={5} color="white">
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
          <Center flexDir="column" justifyContent={"center"} gap={10}>
            <Image
              fontSize={"26px"}
              color="#F68522"
              justifyContent="center"
              src={Logo}
              py={10}
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

              <Button
                colorScheme={"black"}
                variant={"solid"}
                w="282px"
                color="#DCD7C9"
                _hover={{
                  bg: "white",
                  color: "#2C3639",
                }}
              >
                RESET PASSWORD
              </Button>
              {enable ? (
                <Alert status="error" zIndex={2} variant="top-accent">
                  <AlertIcon />
                  wrong username/password
                </Alert>
              ) : null}
            </Center>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}
