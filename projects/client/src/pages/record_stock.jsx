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
  FormControl,
  FormLabel,
  Input,
  useToast,
  Heading,
  IconButton,
  Tooltip,
  Table,
  Tr,
  Td,
  Thead,
  Tbody,
  Select,
  FormHelperText,
  Grid,
  Textarea,
  border,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SidebarAdmin from "../components/sidebar_admin";
import { axiosInstance } from "../config/config";
import { BiDetail } from "react-icons/bi";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
  
export default function Record() {
  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDesc,
    onOpen: onOpenDesc,
    onClose: onCloseDesc,
  } = useDisclosure();
  const [recordStock, setRecordStock] = useState([]);
  const [productData, setProductData] = useState([]);

  const [msg, setMsg] = useState("");
  const [desc, setDesc] = useState({});
  const [isLoading, setIsLoading] = useState(true);


  const NotifyError = useToast({
    title: "Failed",
    description: msg,
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "bottom-left",
  });

  const NotifySuccess = useToast({
    title: "Success",
    status: "success",
    duration: 5000,
    isClosable: true,
    position: "bottom-left",
  });

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

  const detailDesc = (e) => {
    setDesc({ ...e });
    onOpenDesc();
  };

   console.log(recordStock);

  const editStock = (id) => {
    axiosInstance.get(`/api/product/productbybranch/${id}`).then((res) => {
      setProductData([...res.data.result]);
    });
  };

  async function fetchRecord(id) {
    await axiosInstance.get(`/api/stock/fetchRecordById/${id}`).then((res) => {
      setRecordStock([...res.data.result]);
    });
  }

  const formik = useFormik({
    initialValues: {
      idProduct: 0,
      stock: 0,
      desc: "",
    },
    validationSchema: Yup.object().shape({
      idProduct: Yup.number().required("Product must be choosed"),
      stock: Yup.number("Stock must be a number").required(
        "Stock must be filled"
      ),
      desc: Yup.string().required("Description must be filled"),
    }),
    onSubmit: async (values) => {
      try {
        const { stock, desc, idProduct } = values;
        const data = {
          stock: stock,
          desc: desc,
        };

        await axiosInstance.patch(`/stock/repairStock/${idProduct}`, data);
        setTimeout(() => {
          NotifySuccess();
          fetchRecord(JSON.parse(localStorage.getItem("data")).BranchId);
          onClose();
        }, 300);
      } catch (err) {
        setMsg(err.response.data.message);
        setTimeout(() => {
          NotifyError();
          fetchRecord(JSON.parse(localStorage.getItem("data")).BranchId);
          onClose();
        }, 300);
      }
    },
  });

  useEffect(() => {
    JSON.parse(localStorage.getItem("data")).isSuperAdmin ?
    navigate('/dashboard')
    :
    fetchRecord(JSON.parse(localStorage.getItem("data")).BranchId);
    editStock(JSON.parse(localStorage.getItem("data")).BranchId);
    setIsLoading(false)
  }, []);
 


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
                  Record Stock Product
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
                    w="700px"
                    margin={0}
                    padding={0}
                  >
                    <Thead borderBottom={"2px solid #2C3639"}>
                      <Tr>
                        <Grid
                          templateColumns={"1fr 3fr 2fr 2fr 2fr"}
                          placeItems={"center"}
                        >
                          <Td textAlign={"center"} border={0}>
                            No
                          </Td>
                          <Td textAlign={"center"} border={0}>
                            Product Name
                          </Td>
                          <Td textAlign={"center"} border={0}>
                            Stock Before
                          </Td>
                          <Td textAlign={"center"} border={0}>
                            Stock After
                          </Td>
                          <Td textAlign={"center"} border={0}>
                            Description
                          </Td>
                        </Grid>
                      </Tr>
                    </Thead>
                    <Tbody>
                      { !recordStock.length?
                        <Tr
                            w="inherit"
                            _hover={{
                              backgroundColor: "gray.200",
                            }}
                          >
                          <Flex
                          flexDir={"column"}
                          w="700px"
                          h="440px"
                              justify={"center"}
                              textAlign={"center"} fontSize={["xl", "3xl"]}
                  fontWeight="semibold"
                            >
                            Record stock is empty
                              </Flex>
                          </Tr>
                        :
                        recordStock?.map((val, idx) => {
                        return (
                          <Tr
                            key={idx}
                            w="inherit"
                            p="3px 2px 2px 20px"
                            borderBottom="1px solid #2C3639"
                            _hover={{
                              backgroundColor: "gray.200",
                            }}
                          >
                            <Grid
                              templateColumns={"1fr 3fr 2fr 2fr 2fr"}
                              placeItems={"center"}
                            >
                              <Td textAlign={"center"} border={0}>
                                {idx + 1 + "."}
                              </Td>
                              <Td textAlign={"center"} border={0}>
                                {val.Product?.name ?? "error"}
                              </Td>
                              <Td textAlign={"center"} border={0}>
                                {val.stockBefore}
                              </Td>
                              <Td textAlign={"center"} border={0}>
                                {val.stockAfter}
                              </Td>
                              <Td textAlign={"center"} border={0}>
                                <Flex w="100px" justify="space-around">
                                  <Tooltip
                                    label="Description"
                                    placement="top-start"
                                  >
                                    <IconButton // edit button
                                      icon={<BiDetail />}
                                      borderRadius="full"
                                      _hover={{
                                        color: "green",
                                        backgroundColor: "none",
                                      }}
                                      bg="none"
                                      onClick={() =>
                                        detailDesc({
                                          descProd: val.desc,
                                          nameProd: val.Product?.name,
                                        })
                                      }
                                    />
                                  </Tooltip>
                                </Flex>
                              </Td>
                            </Grid>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Flex>
                <Button
                  alignSelf="end"
                  onClick={onOpen}
                  onClose={onClose}
                  bg="#2C3639"
                  color="white"
                  sx={{
                    _hover: {
                      bg: "#3F4E4F",
                    },
                  }}
                >
                  Stock Record Edit
                </Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Repair Stock Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <FormControl id="idProduct">
                        <FormLabel>Product Name</FormLabel>
                        <Select
                          name="idProduct"
                          placeholder="Select"
                          onChange={(e) =>
                            formik.setFieldValue("idProduct", e.target.value)
                          }
                        >
                          {productData.map((p) => {
                            return (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            );
                          })}
                        </Select>
                        <FormHelperText
                          w={"inherit"}
                          marginTop={"5px"}
                          color={"red.500"}
                          fontSize={"9px"}
                        >
                          {formik.errors.idProduct}
                        </FormHelperText>
                      </FormControl>
                      <FormControl id="stock">
                        <FormLabel>Product Stock</FormLabel>
                        <Input
                          placeholder="Stock"
                          type="text"
                          name="stock"
                          onChange={(e) =>
                            formik.setFieldValue("stock", e.target.value)
                          }
                        />
                        <FormHelperText
                          w={"inherit"}
                          marginTop={"5px"}
                          color={"red.500"}
                          fontSize={"9px"}
                        >
                          {formik.errors.stock}
                        </FormHelperText>
                      </FormControl>
                      <FormControl id="description">
                        <FormLabel>Description Repair</FormLabel>
                        <Textarea
                          placeholder="Description"
                          type="text"
                          name="description"
                          bgColor="white"
                          maxH={"150px"}
                          validationSchema
                          onChange={(e) =>
                            formik.setFieldValue("desc", e.target.value)
                          }
                        />
                        <FormHelperText
                          w={"inherit"}
                          marginTop={"5px"}
                          color={"red.500"}
                          fontSize={"9px"}
                        >
                          {formik.errors.desc}
                        </FormHelperText>
                      </FormControl>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        colorScheme="teal"
                        color={"white"}
                        bg="#2C3639"
                        sx={{ _hover: { bg: "#3F4E4F" } }}
                        mr={3}
                        onClick={formik.handleSubmit}
                      >
                        Submit
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Stack>
            </Flex>
          </Center>
        </Flex>
      </Flex>
      <Modal onClose={onCloseDesc} isOpen={isOpenDesc} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{desc.nameProd}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{desc.descProd}</ModalBody>
          <ModalFooter>
            <Button onClick={onCloseDesc}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
    )}
    </>
  );
}
