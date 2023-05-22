import {
  Button,
  Icon,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Link,
  Stack,
  Badge,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosCloseCircleOutline } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import React from "react";
import { axiosInstance } from "../config/config";

import { Link as ReachLink } from "react-router-dom";
import { useSelector } from "react-redux";
export default function ListAddressPage() {
  const [isLoading, setIsLoading] = useState(true);

  const [addressId, setAddressId] = useState(null);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [data, setData] = useState();
  const cancelRef = React.useRef();
  const [User_id, setUser_id] = useState(0);
  const userSelector = useSelector((state) => state.auth);

  useEffect(() => {
    document.title = 'KOPIO | Address'
    setUser_id(userSelector?.id);
  }, []);
  function deleteCategory(id) {
    setAddressId(id);
    setOpenAddressDialog(true);
  }
  function handleCategoryCancelDelete() {
    setOpenAddressDialog(false);
  }

  async function categoryConfirmDelete() {
    await axiosInstance
      .delete(`/api/address/delete-address?id=${addressId}`)
      .then(() => {
        fetchData();
      })
      .finally(() => {
        setOpenAddressDialog(false);
      });
  }
  async function fetchData() {
    await axiosInstance
      .get("/api/address/listaddress/" + userSelector?.id)
      .then((res) => {
        setData(res.data.result);
      });
  }
  useEffect(() => {
    fetchData();

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
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
            h="932px"
            bgColor="#2C3639"
            flexDir={"column"}
            gap={5}
          >
            <Link to="/" as={ReachLink}>
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

            <Center flexDir={"column"} gap={5} overflow="auto">
              <Flex flexDir={"column"}>
                <FormControl id="productName">
                  <FormLabel>
                    <Center fontSize={"30px"}> EDIT ADDRESS</Center>
                  </FormLabel>
                </FormControl>
                <Flex flexDir={"column"} gap={2} py={5}>
                  <Flex color="white" flexDir={"column"} gap={2}>
                    {data?.map((address, val) => (
                      <Flex
                        p={2}
                        gap={2}
                        fontFamily={"Tw Cen MT"}
                        px="5px"
                        bgColor={"white"}
                      >
                        <Flex
                          flexDir={"row"}
                          fontSize="12px"
                          w="350px"
                          h="90px"
                          px={5}
                        >
                          <Flex flexDir={"column"} w="260px">
                            <Flex gap={5}>
                              <Flex fontSize="14px" color="#2C3639">
                                {address?.Ket}
                              </Flex>
                              <Flex fontSize="14px" color="#2C3639">
                                {address?.isPrimary == 1 ? (
                                  <Badge variant="solid" colorScheme="green">
                                    Alamat Utama
                                  </Badge>
                                ) : null}
                              </Flex>
                            </Flex>
                            <Flex fontSize="12px" color="#2C3639">
                              {address?.address}
                            </Flex>
                            <Flex fontSize="12px" color="#2C3639">
                              {address?.district}, {address?.city},{" "}
                              {address?.province}
                            </Flex>
                            <Flex fontSize="12px" color="#2C3639">
                              {address?.postalCode}
                            </Flex>
                          </Flex>

                          <Center gap={1} w="40px">
                            <Link
                              to={"/update-address/" + address?.id}
                              as={ReachLink}
                            >
                              <Icon
                                w="22px"
                                h="22px"
                                as={FiEdit}
                                color="green"
                                sx={{
                                  _hover: {
                                    cursor: "pointer",
                                  },
                                }}
                              ></Icon>
                            </Link>

                            <Icon
                              w="22px"
                              h="22px"
                              as={IoIosCloseCircleOutline}
                              onClick={() => deleteCategory(address?.id)}
                              color="red"
                              sx={{
                                _hover: {
                                  cursor: "pointer",
                                },
                              }}
                            ></Icon>
                          </Center>
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                  <Center>
                    <Link to={"/add-address/" + User_id} as={ReachLink}>
                      <Button
                        bgColor="#2C3639"
                        _hover={{
                          bg: "white",
                          color: "#2C3639",
                          border: "2px solid white",
                        }}
                      >
                        Tambah Alamat Baru
                      </Button>
                    </Link>
                  </Center>
                  <AlertDialog
                    motionPreset="slideInBottom"
                    isOpen={openAddressDialog}
                    leastDestructiveRef={cancelRef}
                    onClose={handleCategoryCancelDelete}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader
                          fontSize="lg"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          Delete Address
                        </AlertDialogHeader>

                        <AlertDialogBody textAlign="center">
                          Are you sure you want to delete this Address?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button
                            ref={cancelRef}
                            onClick={handleCategoryCancelDelete}
                          >
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={categoryConfirmDelete}
                            ml={3}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </Flex>
              </Flex>
            </Center>
          </Flex>
        </Flex>
      </Center>
    </Stack>
  );
}
