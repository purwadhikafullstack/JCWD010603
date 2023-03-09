import {
  Button,
  Icon,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Accordion,
  Avatar,
  AvatarBadge,
  IconButton,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  Box,
  Select,
  Input,
  Link,
  Stack,
  InputGroup,
  Image,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { IoIosArrowBack } from "react-icons/io";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { FaUserCircle } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";
import { userLogin } from "../redux/middleware/userauth";
import { useDispatch } from "react-redux";
// import { AxiosInstance } from 'axios';
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
export default function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saveImage, setSaveImage] = useState(null);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [enable, setEnable] = useState(false);

  const handleFile = (event) => {
    const uploaded = event.target.files[0];
    console.log(uploaded);
    setImage(URL.createObjectURL(uploaded));
    setSaveImage(uploaded);
  };

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
  const [image, setImage] = useState("https://fakeimg.pl/300/");
  return (
    <>
      <Center flex={1} align={"center"} justifyContent={"center"}>
        <Flex
          spacing={4}
          maxW={"md"}
          bgColor="#DCD7C9"
          w="430px"
          h="932px"
          color="white"
          flexDir="column"
          gap={8}
        >
          <Flex
            w="430px"
            h="358px"
            bgColor="#2C3639"
            flexDir={"column"}
            gap={10}
          >
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

            <Center flexDir={"column"} gap={5}>
              <Flex flexDir={"column"}>
                <FormControl id="productName">
                  <FormLabel>
                    {" "}
                    <Center fontSize={"30px"}> EDIT PROFILE</Center>
                  </FormLabel>
                  <Stack direction={["column"]} spacing={6}>
                    <Center>
                      <Avatar size="2xl" src={image}>
                        {/* <AvatarBadge
                          as={IconButton}
                          size="sm"
                          rounded="full"
                          top="-10px"
                          colorScheme="red"
                          aria-label="remove Image"
                          icon={<SmallCloseIcon />}
                        /> */}
                      </Avatar>
                    </Center>
                    <Center w="full" justifyContent={"center"}>
                      <Input
                        id=""
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        w="full"
                        placeholder="Image URL"
                        name={image}
                        // onChange={(e) => setImage_url(e.target.value)}
                      ></Input>
                    </Center>
                  </Stack>
                </FormControl>
                {/* <Flex
                  w="150px"
                  h="150px"
                  backgroundColor="#DCD7C9"
                  borderRadius={"100%"}
                  flexWrap="wrap-reverse"
                  justifyContent={"right"}
                >
                  <Icon
                    boxSize={"7"}
                    as={AiFillCamera}
                    color="#B61A2E"
                    w="58px"
                    h="59px"
                    sx={{
                      _hover: {
                        cursor: "pointer",
                      },
                    }}
                  ></Icon>
                </Flex> */}

                <Flex justifyContent={"bottom"}></Flex>
              </Flex>
            </Center>
          </Flex>

          <Flex w="430px" flexDir="column" gap={5} color="#2C3639" px="40px">
            <FormControl id="email">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="username"
                placeholder="input name"
                onChange={inputHandler}
                bgColor="white"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Email</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="input password"
                onChange={inputHandler}
                bgColor="white"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Gender</FormLabel>
              <Select variant="outline" bgColor="white">
                <option value="men" selected>
                  PRIA
                </option>
                <option value="women">PEREMPUAN</option>
              </Select>
            </FormControl>
            <FormControl id="password">
              <FormLabel>Birthday</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="date"
                bgColor="white"
              />
            </FormControl>

            <Button
              colorScheme={"white"}
              variant={"solid"}
              color="#2C3639"
              py={7}
            >
              <Center
                w="440px"
                h="45px"
                bgColor={"#2C3639"}
                borderRadius="3%"
                color="white"
              >
                UPDATE
              </Center>
            </Button>
            {enable ? (
              <Alert status="error" zIndex={2} variant="top-accent">
                <AlertIcon />
                wrong username/password
              </Alert>
            ) : null}
          </Flex>
        </Flex>
      </Center>
    </>
  );
}
