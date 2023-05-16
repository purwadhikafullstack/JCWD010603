import {
  Flex,
  Image,
  List,
  Link,
  Divider,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  ListItem,
  Center,
} from "@chakra-ui/react";

import { Link as ReachLink } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { SlBasket } from "react-icons/sl";
import LogoHD from "../asset/logo.png";
export default function NavbarHome(props) {
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
              <Link to="/" as={ReachLink}>
                <Image
                  fontSize={"26px"}
                  color="#F68522"
                  justifyContent="center"
                  src={LogoHD}
                  w="100px"
                  h="24px"
                ></Image>
              </Link>
              <Flex px={"70px"} alignItems="center"></Flex>

              <Flex px={3}>
                <Link to="/cart" as={ReachLink}>
                  <Icon
                    boxSize={"7"}
                    as={SlBasket}
                    color="white"
                    sx={{
                      _hover: {
                        cursor: "pointer",
                      },
                    }}
                  ></Icon>
                </Link>
              </Flex>

              <Popover trigger={"hover"} placement={"bottom-end"} gap={10}>
                <PopoverTrigger>
                  <Flex flexDir={"rows"} px={2} alignContent={"center"}>
                    <Icon
                      boxSize={"7"}
                      as={AiOutlineMenu}
                      color="white"
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
