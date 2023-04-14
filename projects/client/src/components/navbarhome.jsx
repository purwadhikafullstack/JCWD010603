import {
  Flex,
  Image,
  InputGroup,
  InputRightElement,
  Box,
  List,
  Input,
  Menu,
  Link,
  Button,
  Divider,
  Icon,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  ListItem,
  Avatar,
  Center,
} from "@chakra-ui/react";
import Logo from "../assets/logo.png";
import { Link as ReachLink } from "react-router-dom";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { AiOutlineMenu } from "react-icons/ai";
import { FiBell } from "react-icons/fi";
import { GrMenu } from "react-icons/gr";
import { SlBasket } from "react-icons/sl";
import { useEffect, useState } from "react";
import LogoHD from "../asset/logo.png"

export default function Navbar(props) {
  const userSelector = useSelector((state) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);

  console.log(userSelector);

  return (
    <>
      <Center flex={1} align={"center"} justifyContent={"center"}>
        <Flex
          zIndex={100}
          px={2}
          h="70px"
          backgroundColor="#2C3639"
          w="430px"
          padding="20px"
          borderBottom={"2px solid #E2E8F0"}
          display={"flex"}
          pos="sticky"
        >
          <Flex px={3} gap={5}>
            <Flex alignItems={"center"}>
              <Image
                fontSize={"26px"}
                color="#F68522"
                justifyContent="center"
                src={LogoHD}
                w="100px"
                h="24px"
              ></Image>
              <Flex px={"70px"} alignItems="center"></Flex>
              <Flex px={3}>
                <Icon
                  boxSize={"7"}
                  as={FiBell}
                  color="#DCD7C9"
                  sx={{
                    _hover: {
                      cursor: "pointer",
                    },
                  }}
                ></Icon>
              </Flex>
              <Flex px={3}>
                <Icon
                  boxSize={"7"}
                  as={SlBasket}
                  color="#DCD7C9"
                  sx={{
                    _hover: {
                      cursor: "pointer",
                    },
                  }}
                ></Icon>
              </Flex>

              <Popover trigger={"hover"} placement={"bottom-start"} gap={10}>
                <PopoverTrigger>
                  <Flex flexDir={"rows"} px={2} alignContent={"center"}>
                    <Icon
                      boxSize={"7"}
                      as={AiOutlineMenu}
                      color="#DCD7C9"
                      sx={{
                        _hover: {
                          cursor: "pointer",
                        },
                      }}
                    ></Icon>
                  </Flex>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow backgroundColor={"#A27B5C"} />

                  <PopoverHeader bgColor={"#A27B5C"} color="white">
                    {" "}
                    SELAMAT DATANG !
                  </PopoverHeader>
                  <PopoverBody>
                    <List fontSize={"14px"} color="#7D7D7D" gap={5}>
                      <ListItem>
                        <Link to="/register" as={ReachLink}>
                          REGISTER
                        </Link>
                      </ListItem>
                      <Divider orientation="horizontal" m={2} />
                      <ListItem>
                        <Link to="/userlogin" as={ReachLink}>
                          SIGN IN
                        </Link>
                      </ListItem>

                      <Divider orientation="horizontal" m={2} />
                    </List>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          </Flex>
        </Flex>
      </Center>
    </>
  );
}