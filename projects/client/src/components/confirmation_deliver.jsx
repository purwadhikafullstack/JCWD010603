import {
  Button,
  Icon,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Link,
  Image,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";

import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { beautyScroll } from "../config/config";
import { IoIosArrowBack } from "react-icons/io";
import { axiosInstance } from "../config/config";
import { Link as ReachLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function ConfirmationDeliver(props) {
  const location = useLocation();
  const data = props.data;
  const cancelRef = React.useRef();
  const navigate = useNavigate();

  const [notrans, setnotrans] = useState("");
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  function handleCategoryCancelDeliver() {
    setOpenAddressDialog(false);
  }
  async function categoryConfirmDeliver() {
    const notrans = location.pathname?.split("/")[2];
    await axiosInstance
      .patch(`/api/transaction/confirmtransaction/${notrans}`)
      .then(() => {
        navigate("/userpage");
      })
      .finally(() => {
        setOpenAddressDialog(false);
      });
  }
  function confirmDeliver(notrans) {
    setnotrans(notrans);
    setOpenAddressDialog(true);
  }
  console.log(data);
  return (
    <>
      <Center flex={1} align={"center"} justifyContent={"center"}>
        <Flex
          spacing={4}
          maxW={"md"}
          bgColor="#DCD7C9"
          w="430px"
          h="1000px"
          color="white"
          flexDir="column"
          gap={1}
        >
          <Flex
            w="430px"
            h="100px"
            bgColor="#2C3639"
            flexDir={"column"}
            gap={2}
          >
            <Link to="/cart" as={ReachLink}>
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

            <Center flexDir={"column"} gap={3} overflow="auto">
              <Flex flexDir={"column"}>
                <FormControl id="productName">
                  <FormLabel>
                    <Center fontSize={"30px"}> ORDER CONFIRMATION</Center>
                  </FormLabel>
                </FormControl>
              </Flex>
            </Center>
          </Flex>
          <Flex
            flexDir={"row"}
            flexWrap="wrap"
            h="800px"
            overflowX={"auto"}
            overflowY={"auto"}
            sx={beautyScroll}
          >
            <Flex
              flexDir={"column"}
              w="85%"
              h="140px"
              m="0 auto"
              align="left"
              color={"black"}
              fontSize={["xs", "sm"]}
              gap={3}
              py={3}
              justify="space-between"
            >
              <Flex
                fontSize={["xs", "sm"]}
                fontWeight="bold"
                gap={2}
                flexDir={"column"}
              >
                <Flex
                  flexDir={"column"}
                  sx={beautyScroll}
                  overflowX={"auto"}
                  overflowY={"auto"}
                  gap={3}
                  py={3}
                  h="250px"
                >
                  {data.Transaction_items?.map((val) => {
                    return (
                      <>
                        <Flex w="100%" align="left" px={8}>
                          <Flex
                            w={["65px", "70px", "75px"]}
                            h={["65px", "70px", "75px"]}
                            borderRadius={5}
                            overflow="hidden"
                          >
                            <Image
                              src={val.Product.imgProduct}
                              objectFit="cover"
                              w="100%"
                              h="auto"
                            />
                          </Flex>
                          <Flex
                            w={["65%", "70%", "75%", "80%"]}
                            h={["65px", "70px", "75px"]}
                            pl={3}
                            direction="column"
                            justify="space-between"
                          >
                            <Flex flexDir={"column"} textAlign={"left"} gap={2}>
                              <Text
                                color="#2C3639"
                                fontWeight="bold"
                                fontSize={["xs", "sm"]}
                                letterSpacing={2}
                              >
                                {val.Product.name}
                              </Text>
                              <Text
                                color="#2C3639"
                                fontWeight="bold"
                                fontSize={["xs", "sm"]}
                              >
                                Rp {val.Product.price.toLocaleString()} ✕{" "}
                                {val.qty}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                        <Flex
                          justify="flex-end"
                          w="100%"
                          h={["5px", "10px", "15px"]}
                          borderBottom="1px solid white"
                          align="center"
                        ></Flex>
                      </>
                    );
                  })}
                </Flex>
              </Flex>
              <Center>
                {" "}
                Total Payment : Rp {data?.grandPrice.toLocaleString()}
              </Center>

              <Center w="350px" h="140px" gap={2}>
                You have received your order:
                <Button
                  colorScheme={"black"}
                  variant={"solid"}
                  color="#2C3639"
                  w="150px"
                  onClick={() => confirmDeliver(props?.noTrans)}
                  _hover={{
                    bg: "white",
                    color: "#2C3639",
                  }}
                >
                  Order Received
                </Button>
              </Center>
            </Flex>
          </Flex>
        </Flex>
      </Center>
      <AlertDialog
        motionPreset="slideInBottom"
        isOpen={openAddressDialog}
        leastDestructiveRef={cancelRef}
        onClose={handleCategoryCancelDeliver}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
            >
              Order Confirmation
            </AlertDialogHeader>

            <AlertDialogBody textAlign="center">
              Are you sure you have received your order?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCategoryCancelDeliver}>
                No
              </Button>
              <Button colorScheme="red" onClick={categoryConfirmDeliver} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
