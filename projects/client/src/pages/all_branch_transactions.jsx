import {
  Spinner,
  Flex,
  Button,
  Stack,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
  IconButton,
  Tooltip,
  Table,
  Tr,
  Td,
  Tbody,
  Select,
  Grid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Box,
  TableContainer,
  TableCaption,
  GridItem,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Text,
  Link,
  Image,
  useToast

} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SidebarAdmin from "../components/sidebar_admin";
import { axiosInstance } from "../config/config";
import { RiFileUserLine } from "react-icons/ri";
import { MdOutlineImageSearch } from "react-icons/md";
import React from "react";
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import { Link as ReachLink } from "react-router-dom";

export default function Record() {
  const initialFocusRef = React.useRef();
  const cancelRef = React.useRef();
  const [cancelDialog, setCancelDialog] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen : isOpenCheck, onOpen : onOpenCheck, onClose : onCloseCheck } = useDisclosure();
  const { isOpen : isOpen1, onOpen : onOpen1, onClose : onClose1 } = useDisclosure();
  const { isOpen : isOpen2, onOpen : onOpen2, onClose : onClose2 } = useDisclosure();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [pages, setPages] = useState(10);
  const [rows, setRows] = useState(0);
  const [allBranchTrans, setAllBranchTrans] = useState([]);
  const [dataTrans, setDataTrans] = useState([]);
  const [branches, setBranches] = useState([]);
  const [order, setOrder] = useState("DESC");
  const [detailTrans, setDetailTrans] = useState({});
  const [transactionStatus, setTransactionStatus] = useState([]);
  const [idTrans, setIdTrans] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [imgPayment, setImgPayment] = useState("")
  const toast = useToast();

  const superAdmin = JSON.parse(localStorage.getItem("data"))
    ? JSON.parse(localStorage.getItem("data")).isSuperAdmin
    : null;

  const webkit = {
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
  };

  const requestButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #FFB84C",
      color: "#FFB84C",
      transform: "scale(1.10)",
 },
    _active: {
      size: "sm",
    },
  };
  const confirmButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #0E8388",
      color: "#0E8388",
      transform: "scale(1.10)",
 },
    _active: {
      size: "sm",
    },
  };
  const deliveredButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #3E54AC",
      color: "#3E54AC",
      transform: "scale(1.10)",
 },
    _active: {
      size: "sm",
    },
  };
  const arrivedButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #6D5D6E",
      color: "#6D5D6E",
      transform: "scale(1.10)",
 },
    _active: {
      size: "sm",
    },
  };
  const canceledButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #F45050",
      color: "#F45050",
      transform: "scale(1.10)",
 },
    _active: {
      size: "sm",
    },
  };
  const uploadButtonStyle = {
    _hover: {
      bg: "#F7D060",
      // border: "2px solid #9e3939",
      color: "#F1F6F9",
      transform: "scale(1.05)",
    },
    _active: {
      size: "sm",
    },
  };
  const checkButtonModalStyle = {
    _hover: {
      bg: "#1F8A70",
      // border: "2px solid #9e3939",
      color: "#F1F6F9",
      transform: "scale(1.05)",
    },
    _active: {
      size: "sm",
    },
  };
  const cancelButtonModalStyle = {
    _hover: {
      bg: "#F45050",
      // border: "2px solid #9e3939",
      color: "#F1F6F9",
      transform: "scale(1.05)",
    },
    _active: {
      size: "sm",
    },
  };
  const completeButtonModalStyle = {
    _hover: {
      bg: "#1F8A70",
      // border: "2px solid #9e3939",
      color: "#F1F6F9",
      transform: "scale(1.05)",
    },
    _active: {
      size: "sm",
    },
  };

  const changePage = ({ selected }) => {
    setPage(parseInt(selected) + 1);
  };

  const handleDataTrans = (e) => {
    setDetailTrans({ ...e });
    axiosInstance
      .get(`/api/transaction/getTransactionItem/${e.id}`)
      .then((res) => {
        setDataTrans([...res.data.result]);
      });
    setTimeout(() => {
      onOpen();
    }, 100);
  };

  const fetchAllTrans = (e) => {
    if (e) {
      axiosInstance
        .get(
          `/api/transaction/allBranchTransaction?search=${e}&page=${page}&limit=${limit}&order=${order}`
        )
        .then((res) => {
          setAllBranchTrans(res.data.result);
          setPage(res.data.page);
          setPages(res.data.totalPage);
          setRows(res.data.totalRows);
        });
    } else {
      axiosInstance
        .get(
          `/api/transaction/allBranchTransaction?page=${page}&limit=${limit}&order=${order}`
        )
        .then((res) => {
          setAllBranchTrans(res.data.result);
          setPage(res.data.page);
          setPages(res.data.totalPage);
          setRows(res.data.totalRows);
        });
    }
  };

  const fetchAllTransByBranch = (e) => {
    if (e) {
      console.log(e);
      axiosInstance
        .get(
          `/api/transaction/allTransactionByBranch/${
            JSON.parse(localStorage.getItem("data"))
              ? JSON.parse(localStorage.getItem("data")).BranchId
              : null
          }?search=${e}&page=${page}&limit=${limit}&order=${order}`
        )
        .then((res) => {
          setAllBranchTrans(res.data.result);
          setPage(res.data.page);
          setPages(res.data.totalPage);
          setRows(res.data.totalRows);
        });
    } else {
      axiosInstance
        .get(
          `/api/transaction/allTransactionByBranch/${
            JSON.parse(localStorage.getItem("data"))
              ? JSON.parse(localStorage.getItem("data")).BranchId
              : null
          }?page=${page}&limit=${limit}&order=${order}`
        )
        .then((res) => {
          setAllBranchTrans(res.data.result);
          setPage(res.data.page);
          setPages(res.data.totalPage);
          setRows(res.data.totalRows);
        });
    }
  };

  const fetchBranch = () => {
    axiosInstance.get("/api/admin/branches").then((res) => {
      setBranches(res.data.result);
    });
  };
  const fetchStatus = () => {
    axiosInstance.get("/api/transaction/transactionStatus").then((res) => {
      setTransactionStatus(res.data.result);
    });
  };

  // FUNCTION CANCEL ORDER
  async function cancelOrder(orderId) {
    try {
      await axiosInstance
        .patch(`/api/transaction/admincancelorder/${orderId}`)
        .then(() => {
          superAdmin ? fetchAllTrans() : fetchAllTransByBranch();
        });
    } catch (err) {
      console.log(err);
    }
  }
  // FUNCTION SEND ORDER
  async function sendOrder(orderId) {
    try {
      await axiosInstance
        .patch(`/api/transaction/adminsendorder/${orderId}`)
        .then(() => {
          superAdmin ? fetchAllTrans() : fetchAllTransByBranch();
        });
    } catch (err) {
      console.log(err);
    }
  }

  const statusTrans = async (e) => {
    console.log(e);
    console.log(idTrans);
    try {
      await axiosInstance.patch(
        `/api/transaction/userTransactionStatus/${e.id}?status=${e.status}`
        );
        onClose1()
        onClose2()
        handleCloseCancelDialog()
        superAdmin ? fetchAllTrans() : fetchAllTransByBranch();
      toast({
        title: "Status",
        description: `${e.msg} success`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Status",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const checkPayment = (e) => {
    setIdTrans(e);
    onOpen1();
  };

  const deliveredStatus = (e) => {
    setIdTrans(e);
    onOpen2();
  }
  
  const paymentProof = (e) => {
    setImgPayment(e)

    console.log(imgPayment);
  }


  function handleCloseCancelDialog() {
    setCancelDialog(false);
  }

  const alertCancel = (e) => {
    setCancelDialog(true);
    if(e == 1) onClose1()
    if(e == 2) onClose2()
  }

  useEffect(() => {
    superAdmin ? fetchBranch() : fetchStatus();
  }, []);
  useEffect(() => {
    superAdmin ? fetchAllTrans() : fetchAllTransByBranch();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [page, order]);

  return (
    <>
    {isLoading ? (
      <Center w={"100vw"} h="100vh" alignContent={"center"}>
        <Spinner size={"xl"} thickness="10px" color="blue.500" />
      </Center>
    ) : (
    <>
      <Flex w="100%" bg="gray.100">
        <SidebarAdmin />

        <Flex h="100vh" w="100%" direction="column" p={[2, 4, 8, 10]}>
          <Center w="100%" h="100%">
            <Flex
              w={["70%", "80%", "100%"]}
              h="100%"
              overflow="auto"
              sx={webkit}
              bg="white"
              borderRadius={10}
            >
              <Stack w={"80%"} m="0 auto" spacing={3} py={4}>
                <Heading
                  mt={3}
                  color="#2C3639"
                  textAlign="center"
                  fontSize={["lg", "xl", "2xl", "3xl"]}
                >
                  Transactions list
                </Heading>
                <Flex
                  h="85%"
                  w="100%"
                  overflow="auto"
                  sx={webkit}
                  direction="column"
                  color="#2C3639"
                  borderBottom="4px solid #2C3639"
                  borderTop="4px solid #2C3639"
                  alignItems={"center"}
                >
                  <Table
                    fontSize={["md", "lg", "xl"]}
                    w="900px"
                    gridGap={0}
                    margin={0}
                    padding={0}
                  >
                    {
                      !allBranchTrans ?
                      <Tr
                            w="inherit"
                            _hover={{
                              backgroundColor: "gray.200",
                            }}
                          >
                          <Flex
                          flexDir={"column"}
                          w="inherit"
                          h="440px"
                              justify={"center"}
                              textAlign={"center"} fontSize={["xl", "3xl"]}
                  fontWeight="semibold"
                            >
                            Transactions is empty
                              </Flex>
                          </Tr>
                      :
                      
                      allBranchTrans?.map((val, idx) => {
                      return (
                        <Tr
                          w={"inherit"}
                          key={idx}
                          p="3px 2px 2px 20px"
                          borderBottom="1px solid #2C3639"
                          _hover={{
                            backgroundColor: "gray.200",
                          }}
                          padding={"0"}
                          margin={0}
                          h="70px"
                        >
                          <Grid
                            w={"inherit"}
                            templateColumns={"3fr 3fr 3fr"}
                            placeItems={"center"}
                          >
                            <Td textAlign={"center"} border={0}>
                            {val.noTrans}
                            </Td>
                            <Td textAlign={"center"} border={0}>
                            {val.Transaction_status.id === 1 ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#FFB84C"
                          cursor="pointer"
                          mr={3}
                          onClick={() =>
                            checkPayment({ id: val.id, noTrans: val.noTrans, img: val.imgUpload })
                          }
                          sx={requestButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      ) :  val.Transaction_status.id === 2 ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#0E8388"
                          cursor="pointer"
                          mr={3}
                          onClick={() => deliveredStatus({id: val.id, noTrans: val.noTrans})}
                          sx={confirmButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      ) :  val.Transaction_status.id === 3 ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#3E54AC"
                          cursor="pointer"
                          mr={3}
                          // onClick={() => changeStatus({id: val.id, noTrans: val.noTrans})}
                          sx={deliveredButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      ) :  val.Transaction_status.id === 4 ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#6D5D6E"
                          cursor="pointer"
                          mr={3}
                          sx={arrivedButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      ):
                      (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#F45050"
                          cursor="pointer"
                          mr={3}
                          // onClick={() => cancelStatus({id: val.id, noTrans: val.noTrans})}
                          sx={canceledButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      )

                      }
                            </Td>
                            <Td textAlign={"center"} border={0}>
                              <Flex gap={"10px"}>
                                <Flex
                                  w="40px"
                                  justify="space-around"
                                  color={"white"}
                                  bgColor={"blue.300"}
                                  borderRadius={"2xl"}
                                >
                                  <Tooltip
                                    label="Transaction Detail"
                                    placement="top-start"
                                  >
                                    <IconButton
                                      icon={<RiFileUserLine />}
                                      borderRadius="2xl"
                                      _hover={{
                                        color: "black",
                                      }}
                                      bg="none"
                                      onClick={() =>
                                        handleDataTrans({
                                          id: val.id,
                                          grandPrice: val.grandPrice,
                                          totalWeight: val.totalWeight,
                                          date: val.createdAt.split("T")[0],
                                        })
                                      }
                                    />
                                  </Tooltip>
                                </Flex>
                                <Popover
                                  initialFocusRef={initialFocusRef}
                                  placement="bottom"
                                  closeOnBlur={false}
                                >
                                  <PopoverTrigger>
                                    <Flex
                                      w="40px"
                                      justify="space-around"
                                      color={"white"}
                                      bgColor={"yellow.500"}
                                      borderRadius={"2xl"}
                                    >
                                      <Tooltip
                                        label="Transaction Data"
                                        placement="top-start"
                                      >
                                        <IconButton
                                          icon={<RiFileUserLine />}
                                          borderRadius="2xl"
                                          _hover={{
                                            color: "black",
                                          }}
                                          bg="none"
                                        />
                                      </Tooltip>
                                    </Flex>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    w={"350px"}
                                    color="white"
                                    bg="blue.800"
                                    borderColor="blue.800"
                                  >
                                    <PopoverHeader
                                      pt={5}
                                      fontSize={"20px"}
                                      fontWeight="bold"
                                      borderBottom="1"
                                      paddingBottom={"20px"}
                                    >
                                      Transaction Data
                                    </PopoverHeader>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody
                                      paddingX={"10px"}
                                      paddingY={"15px"}
                                    >
                                      <Grid rowGap={"20px"} fontSize={"18px"}>
                                        <Grid rowGap={"10px"}>
                                          <Box>Branch</Box>
                                          <Box>{val.Branch?.name}</Box>
                                        </Grid>
                                        <Grid rowGap={"10px"}>
                                          <Box>Email</Box>
                                          <Box>{val.User?.email}</Box>
                                        </Grid>
                                      </Grid>
                                      {superAdmin ? null : (
                                        <Flex
                                          w="100%"
                                          justify="space-between"
                                          mt="4"
                                        >
                                          <Button
                                            variant="outline"
                                            colorScheme="yellow"
                                            onClick={() => cancelOrder(val.id)}
                                          >
                                            <b>Cancel</b>
                                          </Button>
                                          <Button
                                            colorScheme="teal"
                                            variant="solid"
                                            onClick={() => sendOrder(val.id)}
                                          >
                                            Send
                                          </Button>
                                        </Flex>
                                      )}
                                    </PopoverBody>
                                  </PopoverContent>
                                </Popover>
                              </Flex>
                            </Td>
                          </Grid>
                        </Tr>
                      );
                    })}
                    {/* </Tbody> */}
                  </Table>

                    {
                      allBranchTrans ?
                    <>
                  <Box w={"100%"} textAlign={"right"}>
                    Total Transaction: {rows} | Page: {rows ? page : 0} of {pages}
                  </Box>
                  <Box marginTop={"19px"}>
                    <nav
                      role={"navigation"}
                      aria-label={"pagination"}
                      className="pagination is-small is-centered"
                    >
                      <ReactPaginate
                      pageRangeDisplayed={1}
            marginPagesDisplayed={2}
                        previousLabel={"< Prev"}
                        nextLabel={"Next >"}
                        pageCount={pages}
                        onPageChange={changePage}
                        containerClassName={"pagination-list"}
                        pageLinkClassName={"pagination-link"}
                        previousLinkClassName={"pagination-previous"}
                        nextLinkClassName={"pagination-next"}
                        activeLinkClassName={"pagination-link is-current"}
                        disableLinkClassName={"pagination-link is-disabled"}
                      />
                    </nav>
                  </Box>
                  </>
                  :
                  null
                    }
                </Flex>

                {
                  allBranchTrans ?
                <Flex flexDirection={"row-reverse"} gap={"10px"}>
                  {superAdmin ? (
                    <Select
                      w={"200px"}
                      className="is-hovered"
                      name="idBranch"
                      placeholder="All Branch"
                      onClick={(e) => fetchAllTrans(e.target.value)}
                    >
                      {branches.map((b) => {
                        return (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        );
                      })}
                    </Select>
                  ) : (
                    <Select
                      w={"200px"}
                      className="is-hovered"
                      name="idTransStatus"
                      placeholder="All Transactions Status"
                      onClick={(e) => fetchAllTransByBranch(e.target.value)}
                    >
                      {transactionStatus.map((b) => {
                        return (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        );
                      })}
                    </Select>
                  )}
                  <Select
                    w={"200px"}
                    className="is-hovered"
                    name="idSort"
                    placeholder="Latest Transactions"
                    onClick={(e) => setOrder(e.target.value)}
                  >
                    <option value="ASC">Earliest Transactions</option>
                  </Select>
                </Flex>
                :
                      null
      }
              </Stack>

            </Flex>
          </Center>
        </Flex>
                      
      </Flex>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Grid gridTemplateColumns={"3fr 1fr 1fr"} w="250px">
                <GridItem>Grand Price</GridItem>
                <GridItem>:</GridItem>
                <GridItem>Rp. {detailTrans.grandPrice}</GridItem>
                <GridItem>Total Weight</GridItem>
                <GridItem>:</GridItem>
                <GridItem>{detailTrans.totalWeight} gr</GridItem>
                <GridItem>Date Transaction</GridItem>
                <GridItem>:</GridItem>
                <GridItem>{detailTrans.date}</GridItem>
              </Grid>
              <Table variant="striped" w={"100%"} border={1}>
                <TableCaption>Transaction Items</TableCaption>
                <Tbody>
                  {dataTrans?.map((val, idx) => {
                    return (
                      <Tr w={"100%"} key={idx}>
                        <Grid templateColumns={"1fr 1fr 1fr"}>
                          <Td textAlign={"center"}>{val.Product?.name}</Td>
                          <Td textAlign={"center"}>Rp. {val.Product?.price}</Td>
                          <Td textAlign={"center"}>{val.Product?.weight} gr</Td>
                        </Grid>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal margin onClose={onClose1} isOpen={isOpen1} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"2xl"} fontWeight={"bold"}>
            Transaction Status
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody paddingBottom={9}>
            <Center display={"Grid"} textAlign={"center"} rowGap={"35px"}>
            {!idTrans.img?
              <Text fontSize={"lg"} fontWeight={"semibold"}>
                User still not upload payment proof
              </Text>
              :
              <IconButton
              icon={<RiFileUserLine size={"22px"} />}
              sx={checkButtonModalStyle}
              onClick={()=> {onOpenCheck()}}
              />
            }
              <Flex justify={"center"} columnGap={"35px"}>
                <Button sx={uploadButtonStyle} onClick={() => {
                    statusTrans({
                      id: idTrans.id,
                      status: 2,
                      msg: `Order Confirm`,
                    });
                    onClose()}}>
                    Confirm Order
                </Button>
                <Button
                  onClick={()=> {alertCancel(1)}}
                  sx={cancelButtonModalStyle}
                >
                  Cancel Order
                </Button>
              </Flex>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal margin onClose={onClose2} isOpen={isOpen2} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"2xl"} fontWeight={"bold"}>
            Transaction Status
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody paddingBottom={9}>
            <Center display={"Grid"} textAlign={"center"} rowGap={"35px"}>
              <Text fontSize={"lg"} fontWeight={"semibold"}>
                Order has been delivered?
              </Text>
              <Flex justify={"center"} columnGap={"35px"}>
                <Button sx={uploadButtonStyle} onClick={() => {
                    statusTrans({
                      id: idTrans.id,
                      status: 3,
                      msg: `Order Delivered`,
                    });
                    onClose()}}>
                    Order Delivered
                </Button>
                <Button
                  onClick={()=> {alertCancel(2)}}
                  sx={cancelButtonModalStyle}
                >
                  Cancel Order
                </Button>
              </Flex>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal margin onClose={onCloseCheck} isOpen={isOpenCheck} size={"full"} isCentered>
        <ModalOverlay  bg='blackAlpha.500'
      backdropFilter='blur(10px) hue-rotate(90deg)' >
       
          <ModalHeader fontSize={"2xl"} color={'white'} fontWeight={"bold"}>
            Payment Proof [{idTrans?.noTrans}]
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Center h={"500px"}>
            {idTrans.img?
              <Image
                          src={idTrans?.img}
                          alt={idTrans?.noTrans}
                          objectFit="cover"
                          w="auto"
                          h="100%"
                        />
                        : null
            }
            </Center>
          </ModalBody>
        </ModalOverlay>
      </Modal>
      <AlertDialog
            motionPreset="slideInBottom"
            isOpen={cancelDialog}
            leastDestructiveRef={cancelRef}
            onClose={handleCloseCancelDialog}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader
                  fontSize="lg"
                  fontWeight="bold"
                  textAlign="center"
                >
                  Transaction Cancel
                </AlertDialogHeader>

                <AlertDialogBody textAlign="center">
                  Are you sure you want cancel this order?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={handleCloseCancelDialog}>
                    Back
                  </Button>
                  <Button colorScheme="red" onClick={() => {
                    statusTrans({
                      id: idTrans.id,
                      status: 5,
                      msg: `Order Canceled`,
                    });
                  }} ml={3}>
                    Cancel this order
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
    </>
    )}
    </>
  );
}
