import {
  Flex,
  Box,
  IconButton,
  Image,
  Text,
  Heading,
  Button,
  Link,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import React from "react";
import NavBar from "../components/navbarhome"; //not loggedin
import Navbar from "../components/navbar"; //loggedin
import { axiosInstance } from "../config/config";
import { BiTrash, BiEdit, BiChevronRight, BiChevronLeft } from "react-icons/bi";
import { Link as ReachLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";

export default function UserTrans() {
  const cancelRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen : isOpen1, onOpen : onOpen1, onClose : onClose1 } = useDisclosure();
  const { isOpen : isOpen2, onOpen : onOpen2, onClose : onClose2 } = useDisclosure();
  const [userTrans, setUserTrans] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [pages, setPages] = useState(10);
  const [rows, setRows] = useState(0);
  const [order, setOrder] = useState("DESC");

  const [cancelDialog, setCancelDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const toast = useToast();

  const [idTrans, setIdTrans] = useState({});

  // STYLE
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
      border: "2px solid #1F8A70",
      color: "#1F8A70",
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
  const scrollStyle = {
    "::-webkit-scrollbar": {
      height: "0.2em",
      width: "0.2em",
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

  const changePage = ({ selected }) => {
    setPage(parseInt(selected) + 1);
  };

  function handleCloseCancelDialog() {
    setCancelDialog(false);
  }

  const statusTrans = async (e) => {
    console.log(e);
    console.log(idTrans);
    try {
      await axiosInstance.patch(
        `/api/transaction/userTransactionStatus/${e.id}?status=${e.status}`
        );
        fetchTransactions();
        handleCloseCancelDialog()
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

  const fetchTransactions = () => {
    axiosInstance
      .get(
        `/api/transaction/userTransactionList/${localStorage.getItem(
          "userID"
        )}?page=${page}&limit=${limit}&order=${order}`
      )
      .then((res) => {
        setUserTrans(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
      });
  };

  const changeStatus = (e) => {
    setIdTrans(e);
    onOpen();
  };
  const cancelStatus1 = (e) => {
    setIdTrans(e);
    onOpen1();
  };

  const cancelStatus2 = (e) => {
    setIdTrans(e);
    onOpen2();
  };

  const alertCancel = (e) => {
    setCancelDialog(true);
    if(e === 1) onClose()
    if(e === 2) onClose2()
  }

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  return (
    <Flex direction="column">
      {localStorage.getItem("userID") ? <Navbar /> : <NavBar />}

      <Flex w="430px" h="90vh" m="0 auto" direction="column" sx={scrollStyle}>
        {" "}
        {/* Cart Body */}
        {/* <Heading textAlign='center' color='#2C3639' my={5}>
                      Cart
                  </Heading> */}
        <Flex w="85%" m="0 auto">
          <Text my={3} fontWeight="bold" color="#2C3639">
            Transaction List
          </Text>
        </Flex>
        <Flex
          direction="column"
          w="85%"
          h="560px"
          m="0 auto"
          py={5}
          borderBottom="4px solid #2C3639"
          borderTop="4px solid #2C3639"
          overflow="auto"
          sx={scrollStyle}
          borderRadius={5}
        >
          {userTrans.length === 0 ? (
            <Center w="100%" h="100%">
              <Flex
                direction="column"
                h="100px"
                align="center"
                justify="space-between"
              >
                <Text
                  textAlign="center"
                  fontSize={["md", "lg"]}
                  fontWeight="bold"
                >
                  Your transaction list is empty
                </Text>
                <Link to="/product-list-user" as={ReachLink}>
                  <Button>Start Shopping 🛒</Button>
                </Link>
              </Flex>
            </Center>
          ) : (
            <>
              {userTrans?.map((val) => {
                return (
                  <>
                    <Flex w="100%" align="center" m="10px auto 0px">
                      <Flex
                        w={["80px", "85px", "90px"]}
                        h={["80px", "85px", "90px"]}
                        borderRadius={5}
                        overflow="hidden"
                      >
                        <Image
                          src={val.Transaction_items[0]?.Product.imgProduct}
                          objectFit="cover"
                          w="100%"
                          h="auto"
                        />
                      </Flex>
                      <Flex
                        w={["55%", "60%", "65%", "70%"]}
                        h={["80px", "85px", "90px"]}
                        pl={3}
                        direction="column"
                        justify="space-between"
                      >
                        <Box>
                          <Text
                            color="#2C3639"
                            fontWeight="bold"
                            fontSize={["sm", "md"]}
                            letterSpacing={2}
                          >
                            {val.noTrans}
                          </Text>
                          <Text
                            color="#2C3639"
                            fontWeight="bold"
                            fontSize={["xs", "sm"]}
                          >
                            Rp.{val.grandPrice.toLocaleString()}
                          </Text>
                          <Text
                            color="#2C3639"
                            fontSize={["xs", "sm"]}
                            fontWeight="bold"
                          >
                            {val.totalWeight} gr
                          </Text>
                        </Box>
                        <Text
                          color="#2C3639"
                          fontSize={["xs", "sm"]}
                          fontWeight="bold"
                        >
                          {val.createdAt.split("T")[0]}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex
                      justify="center"
                      w="100%"
                      h={["30px", "35px", "40px"]}
                      m="0px auto 10px"
                      borderBottom="1px solid rgba(44, 54, 57, 0.1)"
                      align="center"
                    >
                      {val.Transaction_status.id === 1 &&
                      val.imgUpload === null ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#FFB84C"
                          cursor="pointer"
                          mr={3}
                          onClick={() =>
                            cancelStatus1({ id: val.id, noTrans: val.noTrans })
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
                          onClick={() => cancelStatus2({id: val.id, noTrans: val.noTrans})}
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
                          onClick={() => changeStatus({id: val.id, noTrans: val.noTrans})}
                          sx={deliveredButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      ) :  val.Transaction_status.id === 4 ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#1F8A70"
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
                      {/* <Flex mr={4} py={2}>
                          <IconButton
                            size="xs"
                            as={BiEdit}
                            color="gray.400"
                            bg="none"
                            cursor="pointer" onClick={() => editCart(val.id)}
                            sx={editButtonStyle}
                          />
                        </Flex> */}
                    </Flex>
                  </>
                );
              })}
            </>
          )}
        </Flex>
        <Flex w="100%" h="50px" m="0 auto" justify={"center"} align="center">
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
        </Flex>
        <Box w="85%" m="0 auto" textAlign={"right"}>
          Total Data: {rows} | Page: {rows ? page : 0} of {pages}
        </Box>
        <Button
          w="85%"
          h="40px"
          m="20px auto 0px"
          // bg={cartData.length > 0 ? "#2C3639" : "#BEBEBE"}
          color="white"
          // sx={cartData.length > 0 ? confirmButtonStyle : {}}
          // disabled={cartData.length === 0}
          p="0px"
          // cursor={cartData.length > 0 ? "pointer" : "context-menu"}
        >
          {/* {cartData.length > 0 ? (
              <Link href="/new-order" w="100%" h="100%" _hover={{ textStyle: 'none' }}>
                <Center h="100%">Confirm & Buy</Center>
              </Link>
            ) : (
              <Center h="100%">Confirm & Buy</Center>
            )} */}
        </Button>
      </Flex>
      <Modal margin onClose={onClose1} isOpen={isOpen1} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"2xl"} fontWeight={"bold"}>
            Transaction Status
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody paddingBottom={9}>
            <Center display={"Grid"} textAlign={"center"} rowGap={"35px"}>
              <Text fontSize={"lg"} fontWeight={"semibold"}>
                You must upload payment proof
              </Text>
              <Flex justify={"center"} columnGap={"35px"}>
                <Button sx={uploadButtonStyle}>
                  <Link
                    to={`/upload-payment/${idTrans.noTrans}`}
                    as={ReachLink}
                  >
                    Upload
                  </Link>
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
                Your payment has been approve by admin, waiting admin to send your order
              </Text>
              <Flex justify={"center"} columnGap={"35px"}>
                {/* <Button sx={uploadButtonStyle}>
                  <Link
                    to={`/upload-payment/${idTrans.noTrans}`}
                    as={ReachLink}
                  >
                    Upload
                  </Link>
                </Button> */}
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
      <Modal margin onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"2xl"} fontWeight={"bold"}>
            Transaction Status
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody paddingBottom={9}>
            <Center display={"Grid"} textAlign={"center"} rowGap={"35px"}>
              <Text fontSize={"lg"} fontWeight={"semibold"}>
                Are you sure the product has been arrived at destination?
              </Text>
              <Flex justify={"center"} columnGap={"35px"}>
                {/* <Button sx={uploadButtonStyle}>
                  <Link
                    to={`/upload-payment/${idTrans.noTrans}`}
                    as={ReachLink}
                  >
                    Upload
                  </Link>
                </Button> */}
                <Button
                    onClick={() => {
                    statusTrans({
                      id: idTrans.id,
                      status: 4,
                      msg: `Order Complete`,
                    });
                    onClose()
                  }}
                  sx={completeButtonModalStyle}
                >
                  Order Complete
                </Button>
              </Flex>
            </Center>
          </ModalBody>
        </ModalContent>
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
    </Flex>
  );
}
