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
  TableContainer,
  TableCaption,
  Table,
  Tbody,
  Tr,
  Grid,
  Td,
  GridItem,
  Icon,
  Tooltip,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import React from "react";
import NavBar from "../components/navbarhome"; //not loggedin
import Navbar from "../components/navbar"; //loggedin
import { axiosInstance } from "../config/config";
import { Link as ReachLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TbListDetails } from "react-icons/tb";
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";

export default function UserTrans() {
  let navigate = useNavigate();
  const cancelRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const {
    isOpen: isOpenDetail,
    onOpen: onOpenDetail,
    onClose: onCloseDetail,
  } = useDisclosure();


  const [userTrans, setUserTrans] = useState([]);
  const [detailTrans, setDetailTrans] = useState([]);
  const [idTrans, setIdTrans] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [pages, setPages] = useState(10);
  const [rows, setRows] = useState(0);
  const [order, setOrder] = useState("DESC");
  const [cancelDialog, setCancelDialog] = useState(false);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("userID"))
    ? JSON.parse(localStorage.getItem("userID"))
    : null;

  // STYLE
  const requestButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #FFB84C",
      borderRight:0,
      color: "#FFB84C",     
 },

    _active: {
      size: "sm",
    },
  };
  const confirmButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #0E8388",
      borderRight:0,
      color: "#0E8388",
 },
    _active: {
      size: "sm",
    },
  };
  const deliveredButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #3E54AC",
      borderRight:0,
      color: "#3E54AC",      
 },
    _active: {
      size: "sm",
    },
  };
  const arrivedButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #6D5D6E",
      borderRight:0,
      color: "#6D5D6E",      
 },
    _active: {
      size: "sm",
    },
  };
  const canceledButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #F45050",
      borderRight:0,
      color: "#F45050",
      
 },
    _active: {
      size: "sm",
    },
  };
  const detailButtonStyle = {
    _hover: {
      bg: "none",
      border: "2px solid #BACDDB",
      borderLeft:0,
      color: "#BACDDB",
      
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
      bg: "#6D5D6E",
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

  const handleDetailTrans = (e) => {

    setTimeout(()=> {
      setDetailTrans(e)
      onOpenDetail()
    },100)

    console.log(detailTrans);
  }

  const changePage = ({ selected }) => {
    setPage(parseInt(selected) + 1);
  };

  function handleCloseCancelDialog() {
    setCancelDialog(false);
  }

  const statusTrans = async (e) => {
    try {
      await axiosInstance.patch(
        `/api/transaction/userTransactionStatus/${e.id}?status=${e.status}`
      );
      fetchTransactions();
      handleCloseCancelDialog();
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
    if (e === 1) onClose();
    if (e === 2) onClose2();
  };

  useEffect(() => {
    !user?
    navigate('/login')
    :
    fetchTransactions();
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [page]);

  useEffect(()=> {
    document.title = 'KOPIO | Transactions'
  }, [])

  return (
    <Flex direction="column">
      {localStorage.getItem("userID") ? <Navbar /> : <NavBar />}

      {isLoading ? (
      <Center w={"100vw"} h="100vh" alignContent={"center"}>
        <Spinner size={"xl"} thickness="10px" color="blue.500" />
      </Center>
    ) : (
      <Flex w="430px" h="90vh" m="0 auto" direction="column" sx={scrollStyle}>
        <Flex w="85%" m="0 auto">
          <Text my={3} fontWeight="bold" color="#2C3639">
            Transaction List
          </Text>
        </Flex>
        <Flex
          direction="column"
          w="85%"
          h="600px"
          m="0 auto"
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
                <Link to="/product-list" as={ReachLink}>
                  <Button>Start Shopping 🛒</Button>
                </Link>
              </Flex>
            </Center>
          ) : (
            <>
              {userTrans?.map((val,idx) => {
                console.log(val)
                return (
                  <>
                    <Flex w="100%" align="center" m="10px auto 0px" key={idx}>
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
                      {val.TransactionStatusId === 1 &&
                      val.imgUpload === null ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#FFB84C"
                          cursor="pointer"
                          borderLeftRadius={10}
                          borderRightRadius={0}
                          onClick={() =>
                            cancelStatus1({ id: val.id, noTrans: val.noTrans })
                          }
                          sx={requestButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      ) : val.TransactionStatusId === 2 ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#0E8388"
                          cursor="pointer"
                          borderLeftRadius={10}
                          borderRightRadius={0}
                          onClick={() => cancelStatus2({id: val.id, noTrans: val.noTrans})}
                          sx={confirmButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      ) : val.TransactionStatusId === 3 ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#3E54AC"
                          cursor="pointer"
                          borderLeftRadius={10}
                          borderRightRadius={0}

                          onClick={() => changeStatus({id: val.id, noTrans: val.noTrans})}
                          sx={deliveredButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      ) : val.TransactionStatusId === 4 ? (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#6D5D6E"
                          cursor="pointer"
                          borderLeftRadius={10}
                          borderRightRadius={0}
                          sx={arrivedButtonStyle}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#F45050"
                          cursor="pointer"
                          sx={canceledButtonStyle}
                          borderLeftRadius={10}
                          borderRightRadius={0}
                        >
                          {val.Transaction_status?.name}
                        </Button>
                      )

                      }
                        <Tooltip label='Order details' placement="top" fontSize='md' bg="#BACDDB">
                      <Button 
                      sx={detailButtonStyle}
                      size="xs"
                          // as={BiTrash}
                          color="white"
                          bg="#BACDDB"
                          cursor="pointer"
                          borderLeftRadius={0}
                          borderRightRadius={10}
                      onClick={() => {handleDetailTrans(val.Transaction_items)}}>
                      <Icon as={TbListDetails}/></Button>
                      </Tooltip>
                    </Flex>
                  </>
                );
              })}
            </>
          )}
        </Flex>
        {userTrans ? (
          <>
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
        </>
        ) : null }
      </Flex>
    )}
      <Modal margin onClose={onClose1} isOpen={isOpen1} isCentered>
        <ModalOverlay />
        <ModalContent maxW="430px" fontSize={["sm", "md"]}>
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
                  onClick={() => {
                    alertCancel(1);
                  }}
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
        <ModalContent maxW="430px" fontSize={["sm", "md"]}>
          <ModalHeader fontSize={"2xl"} fontWeight={"bold"}>
            Transaction Status
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody paddingBottom={9}>
            <Center display={"Grid"} textAlign={"center"} rowGap={"35px"}>
              <Text fontSize={"lg"} fontWeight={"semibold"}>
                Your payment has been approve by admin, waiting admin to send
                your order
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
                    alertCancel(2);
                  }}
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
        <ModalContent maxW="430px" fontSize={["sm", "md"]}>
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
                    onClose();
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
      <Modal onClose={onCloseDetail} isOpen={isOpenDetail} isCentered>
        <ModalOverlay />
        <ModalContent maxW="430px" fontSize={["sm", "md"]}>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={"35px"}>

          {detailTrans.length > 0 ? 
            <>
          <Grid fontWeight={"semibold"} bg={"#86A3B8"} textAlign={"center"} width={"inherit"} templateColumns={"2fr 2fr 1fr 1fr"}>
          <GridItem border={"1px"}>Product Name</GridItem>
          <GridItem border={"1px"}>Price</GridItem>
          <GridItem border={"1px"}>Weight</GridItem>
          <GridItem  border={"1px"}>Qty</GridItem>
          </Grid>
          
          {detailTrans?.map((val, idx) => {
                    return (
                        <Grid width={"inherit"} textAlign={"center"} templateColumns={"2fr 2fr 1fr 1fr"} key={idx} >
                      {/* <Tr w={"100%"} key={idx}> */}
                          <GridItem bg={"#DDDDDD"} border={"1px"}>{val.Product?.name}</GridItem>
                          <GridItem bg={"#EEEEEE"} border={"1px"}>Rp. {(val.Product?.price).toLocaleString()}</GridItem>
                          <GridItem bg={"#DDDDDD"} border={"1px"}>{val.Product?.weight} gr</GridItem>
                          <GridItem bg={"#EEEEEE"} border={"1px"}>{val.qty} pcs</GridItem>
                      {/* </Tr> */}
                        </Grid>
                    );
                  })}
                  </>
                  : <Flex
                          flexDir={"column"}
                          w="inherit"
                              justify={"center"}
                              textAlign={"center"} fontSize={["xl", "2xl"]}
                  fontWeight="semibold"
                            >
                            Order details is empty
                              </Flex>
                }
            {/* <TableContainer>
              <Table variant="striped" w={"100%"} border={1}>
                <Tbody>
                </Tbody>
              </Table>
            </TableContainer> */}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseDetail}>Close</Button>
          </ModalFooter>
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
              <Button
                colorScheme="red"
                onClick={() => {
                  statusTrans({
                    id: idTrans.id,
                    status: 5,
                    msg: `Order Canceled`,
                  });
                }}
                ml={3}
              >
                Cancel this order
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
