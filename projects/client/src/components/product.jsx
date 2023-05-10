import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import {
  Spacer,
  Flex,
  Image,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  FormLabel,
  useDisclosure,
  Textarea,
  InputGroup,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  Divider,
  Input,
  Checkbox,
  Button,
  Select,
  Box,
  Icon,
  Center,
  Text,
  Stack,
  useToast,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  ModalFooter,
  FormHelperText,
  ModalContent,
} from "@chakra-ui/react";
import { FaFolder } from "react-icons/fa";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineDelete, MdBorderColor } from "react-icons/md";
import { Link } from "react-router-dom";
import { TbFilter } from "react-icons/tb";
import { BsPlusCircleFill } from "react-icons/bs";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ProductPage(props) {
  const data = props.data;
  const datacat = props.datacat;
  const fetchData = props.fetchData;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(1);

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDelModal,
    onOpen: onOpenDelModal,
    onClose: onCloseDelModal,
  } = useDisclosure();
  const initialRef = React.useRef(null);

  const selectPageHandle = (selectPage) => {
    if (
      selectPage >= 1 &&
      selectPage <= Math.ceil(data.length / 6) &&
      selectPage !== page
    ) {
      setPage(selectPage);
    }
  };
  const CheckCategories = (e, param) => {
    let newCat;
    if (e.target.checked) {
      props.setCat([...props.cat, param]);
    } else {
      newCat = props.cat.filter((val) => {
        return val !== param;
      });
      props.setCat([...newCat]);
    }
  };
  function inputHandler(event) {
    const { value, name } = event.target;

    name === "search"
      ? setSearch(value)
      : setProduct({
          ...product,
          [name]: value,
        });
  }

  // IAN
  const [cat, setCat] = useState([
    {
      id: 0,
      name: "",
    },
  ]);

  const [msg, setMsg] = useState("");

  const [userData, setUserData] = useState([{}]);

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

  const handleFile = (e) => {
    const uploaded = e.target.files[0];

    formikEdit.setFieldValue("imgProduct", uploaded);
  };

  const stockSubmit = (e) => {
    formikEdit.setFieldValue("stock", e.target.value);
    formik.setFieldValue("stock", e.target.value);
    formikEdit.setFieldValue("status", 1);
    formik.setFieldValue("status", 1);
  };

  const [editProd, setEditProd] = useState([
    {
      id: 0,
      name: "",
      price: 0,
      stock: 0,
      weight: 0,
      CategoryId: 0,
      imgProduct: "",
      desc: "",
      BranchId: 0,
    },
  ]);

  const deleteSubmit = async (id) => {
    try {
      await axiosInstance.delete(
        `/api/product/delete/${id}?BranchId=${userData.BranchId}`
      );
      setTimeout(() => {
        NotifySuccess();
        fetchData();
        onCloseDelModal();
      }, 300);
    } catch (err) {
      setMsg(err.response.data.message);
      setTimeout(() => {
        NotifyError();
        fetchData();
        onCloseDelModal();
      }, 300);
    }
  };

  const editSubmit = () => {
    formikEdit.setFieldValue("id", editProd.id);
    formikEdit.handleSubmit();
  };

  const editHandlerModal = async (id) => {
    const response = await axiosInstance.get(
      `/api/product/detail-product/${id}`
    );
    // .then((res)=> {
    //   setEditProd(res.data.result)
    //   console.log(res.data.result.CategoryId);
    // })
    const result = response.data.result;
    setEditProd(result);

    setTimeout(() => {
      onOpenEditModal();
    }, 100);
  };

  const deleteHandlerModal = async (id) => {
    const response = await axiosInstance.get(
      `/api/product/detail-product/${id}`
    );
    const result = response.data.result;
    // console.log(result);
    setEditProd(result);

    // console.log(result);
    onOpenDelModal();
  };

  const fetchCategory = async () => {
    const response = await axiosInstance.get("/api/admin/categories");
    const result = response.data.result;
    setCat(result);
  };
  useEffect(() => {
    fetchCategory();
    setUserData(JSON.parse(localStorage.getItem("data")));
  }, []);

  const submitData = () => {
    formik.setFieldValue("BranchId", userData?.BranchId ?? 0);
    formik.handleSubmit();
  };
  // console.log(userData?.BranchId);
  // console.log(JSON.parse(localStorage.getItem("data")));
  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      stock: 0,
      weight: 0,
      desc: "",
      imgProduct: "",
      category: 0,
      status: 0,
      BranchId: 0,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Product name must be filled"),
      category: Yup.number().required("Category must be choosed"),
      price: Yup.number("Price must be a number").nullable(),
      stock: Yup.number("Stock must be a number"),
      imgProduct: Yup.mixed()
        .nullable()
        .required("Product image must be a filled")
        .test("type", "Invalid file format selection", (e) => {
          return (
            e &&
            (e.type === "image/jpg" ||
              e.type === "image/jpeg" ||
              e.type === "image/png" ||
              e.type === "image/gif")
          );
        })
        .test(
          "size",
          "File size is too big",
          (e) => {
            return e && e.size <= 1000 * 1000;
          } // 1MB
        ),
    }),
    onSubmit: async (values) => {
      try {
        const {
          name,
          price,
          stock,
          weight,
          desc,
          imgProduct,
          category,
          BranchId,
          status,
        } = values;
        const formData = new FormData();

        formData.append("name", name);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("weight", weight);
        formData.append("desc", desc);
        formData.append("imgProduct", imgProduct);
        formData.append("CategoryId", category);
        formData.append("BranchId", BranchId);

        await axiosInstance.post(
          `/api/product/create?status=${status}`,
          formData
        );
        setTimeout(() => {
          NotifySuccess();
          fetchData();
          onCloseModal();
        }, 300);
      } catch (err) {
        console.log(err);
        setMsg(err.response.data.message);
        setTimeout(() => {
          NotifyError();
          fetchData();
          onCloseModal();
        }, 300);
      }
    },
  });

  const formikEdit = useFormik({
    initialValues: {
      id: editProd?.id ?? "",
      name: editProd?.name ?? "",
      price: editProd?.price ?? 0,
      stock: editProd?.stock ?? 0,
      weight: editProd?.weight ?? 0,
      category: editProd?.CategoryId ?? 0,
      imgProduct: editProd?.imgProduct ?? "",
      desc: editProd?.desc ?? "",
      BranchId: editProd?.BranchId ?? "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      imgProduct: Yup.mixed()
        .test("type", "Invalid file format selection", (e) => {
          return (
            !e ||
            e ||
            e.type === "image/jpg" ||
            e.type === "image/jpeg" ||
            e.type === "image/png" ||
            e.type === "image/gif"
          );
        })
        .test(
          "size",
          "File size is too big",
          (e) => {
            return !e || e || e.size <= 1000 * 1000;
          } // 1MB
        ),
    }),
    onSubmit: async (values) => {
      const {
        id,
        imgProduct,
        name,
        price,
        stock,
        weight,
        category,
        desc,
        status,
        BranchId,
      } = values;

      const formData = new FormData();
      formData.append("id", id);
      formData.append("imgProduct", imgProduct);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("weight", weight);
      formData.append("CategoryId", category);
      formData.append("desc", desc);
      formData.append("BranchId", BranchId);

      // console.log(formData);
      try {
        await axiosInstance.patch(
          `/api/product/edit/${id}?status=${status}`,
          formData
        );
        setTimeout(() => {
          NotifySuccess();
          fetchData();
          onCloseEditModal();
        }, 300);
      } catch (err) {
        console.log(err);
        setMsg(err.response.data.message);
        setTimeout(() => {
          NotifyError();
          fetchData();
          onCloseEditModal();
        }, 300);
      }
    },
  });
  return (
    <>
      <Flex
        zIndex={40}
        w={["200px", "400px", "600px", "800px"]}
        gap={2}
        paddingTop="20px"
        paddingBottom={"20px"}
        justifyContent="start"
        // fontFamily={"Roboto"}
        flexWrap="wrap"
        flexDir={"column"}
        overflowX={"auto"}
        overflowY={"auto"}
        fontSize="30px"
        h="full"
      >
        PRODUCT LIST
        <Divider orientation="horizontal" m={2} />
        <Flex gap={3}>
          <InputGroup gap={3}>
            <Input
              onKeyDown={(e) =>
                e.key === "Enter" ? props?.fin(e.target.value) : null
              }
              backgroundColor={"white"}
              type="tel"
              placeholder="Search"
              w="400px"
              h="35px"
              borderRadius={"none"}
              onChange={inputHandler}
              name="search"
              gap={3}
            ></Input>
            <Flex
              justifyContent="center"
              textAlign="center"
              h="35px"
              w="35px"
              onClick={() => props?.fin(search)}
              _hover={{
                bg: "grey",
                color: "black",
                cursor: "pointer",
              }}
              borderRadius="100%"
              bgColor={"#DCD7C9"}
            >
              {" "}
              <Center>
                <Icon as={AiOutlineSearch} justifyContent="center"></Icon>
              </Center>{" "}
            </Flex>
            <Button leftIcon={<TbFilter />} colorScheme="teal" onClick={onOpen}>
              Filter
            </Button>
            <Drawer
              isOpen={isOpen}
              placement="right"
              initialFocusRef={firstField}
              onClose={onClose}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px">
                  <Flex
                    w="200px"
                    h="56px"
                    alignItems={"center"}
                    borderRadius={"2%"}
                    _hover={{
                      bg: "#DCD7C9",
                      color: "white",
                      cursor: "pointer",
                    }}
                    py={2}
                  >
                    <Icon as={FaFolder} color="black" mx={2} />
                    <Box
                      as="b"
                      mx={3}
                      fontSize={18}
                      color="black"
                      textAlign={"center"}
                    >
                      {" "}
                      CATEGORIES
                    </Box>
                  </Flex>
                </DrawerHeader>

                <DrawerBody>
                  <Stack spacing="24px">
                    <Accordion defaultIndex={[0]} allowMultiple>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Flex
                                px={2}
                                fontSize="18px"
                                color={"#2C3639"}
                                fontWeight="bold"
                                maxH={"500px"}
                              >
                                TYPES OF COFFEE
                              </Flex>
                            </Box>

                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Flex
                            px={5}
                            spacing={2}
                            direction="column"
                            fontSize="10px"
                          >
                            {datacat?.map((product) => {
                              return (
                                <>
                                  <Checkbox
                                    colorScheme="cyan"
                                    onChange={(e) => {
                                      CheckCategories(e, `${product?.name}`);
                                    }}
                                  >
                                    {product?.name}
                                  </Checkbox>
                                </>
                              );
                            })}
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>

                    <Accordion defaultIndex={[0]} allowToggle>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box as="span" flex="1" textAlign="left">
                              <Flex
                                px={2}
                                fontSize="18px"
                                color={"#2C3639"}
                                fontWeight="bold"
                              >
                                SORT
                              </Flex>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <Flex
                            flexDir={"column"}
                            alignItems={"center"}
                            gap={2}
                          >
                            <Select
                              variant="outline"
                              onChange={(e) => {
                                props.setSortBy(e.target.value);
                              }}
                            >
                              <option value="name" selected>
                                NAME
                              </option>
                              <option value="price">PRICE</option>
                            </Select>

                            <Select
                              variant="outline"
                              onChange={(e) => {
                                props.setSort(e.target.value);
                              }}
                            >
                              <option value="ASC" selected>
                                A - Z / MIN - MAX
                              </option>
                              <option value="DESC">Z - A / MAX KE MIN</option>
                            </Select>
                          </Flex>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </Stack>
                </DrawerBody>

                <DrawerFooter borderTopWidth="1px">
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>

                  <Button colorScheme="blue" onClick={props?.filter}>
                    Filter
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
            <Button
              leftIcon={<BsPlusCircleFill />}
              colorScheme="blue"
              onClick={onOpenModal}
            >
              Add Product
            </Button>
          </InputGroup>
          {/* <Select variant="outline">
            <option value="Arabica" selected>
              Arabica
            </option>
            <option value="Robusta">Robusta</option>
          </Select> */}
        </Flex>
        <Flex
          zIndex={40}
          w="800px"
          gap={2}
          paddingTop="20px"
          paddingBottom={"20px"}
          justifyContent="start"
          flexDir={"row"}
          flexWrap="wrap"
          overflowX={"auto"}
          overflowY={"auto"}
          h="full"
        >
          {data.slice(page * 6 - 6, page * 6)?.map((product, index) => {
            return (
              <>
                <Center
                  minW={["100px", "150px", "200px", "250px"]}
                  h={["100px", "150px", "200px", "250px"]}
                  border="2px solid #E2E8F0"
                  borderRadius={"5%"}
                  boxShadow="rgba(0,0,0,0.56) 4px 0px 19px -2px"
                >
                  <Flex justifyContent="center">
                    <Link to={`/`}>
                      <Box
                        roundedTop="lg"
                        w={["50px", "100px", "150px", "190px"]}
                        h={["50px", "100px", "150px", "190px"]}
                        px={2}
                      >
                        <Image
                          src={product?.imgProduct}
                          alt={`Picture of ${product?.name}`}
                          w="inherit"
                          h="inherit"
                          roundedTop={"inherit"}
                          zIndex="0"
                        />
                      </Box>
                    </Link>
                  </Flex>
                  <Flex
                    mt="1"
                    justifyContent="space-between"
                    alignContent="center"
                    flexDir={"column"}
                    w="200px"
                    h="175px"
                  >
                    <Flex h="75px" flexDir={"column"}>
                      <Box
                        fontSize="14px"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                      >
                        {product?.category}
                      </Box>
                      <Box
                        fontSize="16px"
                        fontWeight={"Bold"}
                        as="h4"
                        lineHeight="tight"
                      >
                        {product?.name}
                      </Box>

                      <Box fontSize="14px" as="h4">
                        <Text>
                          {" "}
                          Harga : Rp. {product?.price.toLocaleString()}
                        </Text>
                      </Box>
                      <Stack
                        w={"inherit"}
                        borderRadius={"50%"}
                        marginY={"5px"}
                        height={"2px"}
                        bgColor={`rgb(111,111,111,0.1)`}
                      />
                    </Flex>
                    <Center marginTop={"3px"} paddingX={"35px"} gap={3}>
                      <Button
                        onClick={() => {
                          editHandlerModal(product?.id);
                        }}
                        colorScheme="yellow"
                        h={"50px"}
                        w={"50px"}
                        borderRadius={"100%"}
                        fontSize={"14px"}
                      >
                        <MdBorderColor color="white" size={15} />
                      </Button>
                      <Spacer />
                      <Button
                        onClick={() => {
                          deleteHandlerModal(product?.id);
                        }}
                        colorScheme="red"
                        h={"50px"}
                        w={"50px"}
                        borderRadius={"100%"}
                        fontSize={"14px"}
                      >
                        <MdOutlineDelete size={18} />
                      </Button>
                    </Center>
                  </Flex>
                </Center>
              </>
            );
          })}
        </Flex>
        <Center gap={10}>
          {/* <Center minW="60px" h={"60px"}>
            <IconButton
              aria-label="right-arrow"
              colorScheme="grey"
              borderRadius="full"
              borderStyle={"none"}
              variant="outline"
              zIndex={2}
              onClick={() => {
                if (props.page - 6 < 0) {
                  props.setPage(0);
                } else {
                  props.setPage(props.page - 6);
                }

                props.fetchData(props.page - 6);
              }}
            >
              <BiLeftArrowAlt />
            </IconButton>
          </Center>
         
          <Center minW="60px" h={"60px"}>
            <IconButton
              aria-label="right-arrow"
              colorScheme="gray"
              borderRadius="full"
              borderStyle={"none"}
              variant="outline"
              zIndex={2}
              onClick={() => {
                props.setPage(props.page + 6);
                props.fetchData(props.page + 6);
              }}
            >
              <BiRightArrowAlt />
            </IconButton>
          </Center> */}
          {data.length > 0 && (
            <Flex gap={5}>
              <Button onClick={() => selectPageHandle(page - 1)}>
                <BiLeftArrowAlt />
              </Button>
              <Flex gap={5}>
                {[...Array(Math.ceil(data.length / 6))].map((n, i) => {
                  return (
                    <>
                      <Box
                        className={`num ${page === i + 1 ? `numActive` : ""}`}
                        onClick={() => selectPageHandle(i + 1)}
                        // bgColor="#2C3639"
                      >
                        {i + 1}
                      </Box>
                    </>
                  );
                })}
              </Flex>
              <Button onClick={() => selectPageHandle(page + 1)}>
                {" "}
                <BiRightArrowAlt />
              </Button>
            </Flex>
          )}
        </Center>
      </Flex>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpenEditModal}
        onClose={onCloseEditModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              type="hidden"
              name="id"
              defaultValue={editProd?.id}
              onChange={(e) => formikEdit.setFieldValue("id", e.target.value)}
            />
            <FormControl id="name">
              <FormLabel>Product Name</FormLabel>
              <Input
                placeholder="Name"
                type="text"
                name="name"
                defaultValue={editProd?.name}
                onChange={(e) =>
                  formikEdit.setFieldValue("name", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formikEdit.errors.name}
              </FormHelperText>
            </FormControl>
            <FormControl id="price">
              <FormLabel>Product Price</FormLabel>
              <Input
                placeholder="Price"
                type="text"
                name="price"
                defaultValue={editProd?.price}
                onChange={(e) =>
                  formikEdit.setFieldValue("price", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formikEdit.errors.price}
              </FormHelperText>
            </FormControl>
            <FormControl id="weight">
              <FormLabel>Product Weight</FormLabel>
              <Input
                placeholder="In grams"
                type="text"
                name="weight"
                defaultValue={editProd?.weight}
                onChange={(e) =>
                  formikEdit.setFieldValue("weight", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formikEdit.errors.weight}
              </FormHelperText>
            </FormControl>
            <FormControl id="stock">
              <FormLabel>Product Stock</FormLabel>
              <Input
                placeholder="Stock"
                type="text"
                name="stock"
                defaultValue={editProd?.stock}
                onChange={(e) => stockSubmit(e)}
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formikEdit.errors.stock}
              </FormHelperText>
            </FormControl>
            <FormControl id="category">
              <FormLabel>Product Category</FormLabel>
              <Select
                name="category"
                placeholder="Select"
                defaultValue={editProd?.CategoryId}
                onChange={(e) =>
                  formikEdit.setFieldValue("category", e.target.value)
                }
              >
                {cat.map((c) => {
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
                {formikEdit.errors.category}
              </FormHelperText>
            </FormControl>
            <FormControl id="description">
              <FormLabel>Product Description</FormLabel>
              <Textarea
                placeholder="Description"
                type="text"
                name="description"
                bgColor="white"
                maxH={"150px"}
                validationSchema
                defaultValue={editProd?.desc}
                onChange={(e) =>
                  formikEdit.setFieldValue("desc", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formikEdit.errors.desc}
              </FormHelperText>
            </FormControl>
            <FormControl id="imgProduct">
              <FormLabel>Product Image</FormLabel>
              <Input
                paddingTop="4px"
                type="file"
                name="imgProduct"
                onChange={handleFile}
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formikEdit.errors.imgProduct}
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={editSubmit}>
              Submit
            </Button>
            <Button onClick={onCloseEditModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpenModal}
        onClose={onCloseModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Products</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl id="name">
              <FormLabel>Product Name</FormLabel>
              <Input
                placeholder="Name"
                type="text"
                name="name"
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.name}
              </FormHelperText>
            </FormControl>
            <FormControl id="price">
              <FormLabel>Product Price</FormLabel>
              <Input
                placeholder="Price"
                type="text"
                name="price"
                onChange={(e) => formik.setFieldValue("price", e.target.value)}
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.price}
              </FormHelperText>
            </FormControl>
            <FormControl id="weight">
              <FormLabel>Product Weight</FormLabel>
              <Input
                placeholder="In grams"
                type="text"
                name="weight"
                onChange={(e) => formik.setFieldValue("weight", e.target.value)}
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.weight}
              </FormHelperText>
            </FormControl>
            <FormControl id="stock">
              <FormLabel>Product Stock</FormLabel>
              <Input
                placeholder="Stock"
                type="text"
                name="stock"
                onChange={(e) => stockSubmit(e)}
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
            <FormControl id="category">
              <FormLabel>Product Category</FormLabel>
              <Select
                name="category"
                placeholder="Select"
                onChange={(e) =>
                  formik.setFieldValue("category", e.target.value)
                }
              >
                {cat.map((c) => {
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
                {formik.errors.category}
              </FormHelperText>
            </FormControl>
            <FormControl id="description">
              <FormLabel>Product Description</FormLabel>
              <Textarea
                placeholder="Description"
                type="text"
                name="description"
                bgColor="white"
                maxH={"150px"}
                onChange={(e) => formik.setFieldValue("desc", e.target.value)}
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
            <FormControl id="imgProduct">
              <FormLabel>Product Image</FormLabel>
              <Input
                paddingTop="4px"
                type="file"
                name="imgProduct"
                onChange={(e) =>
                  formik.setFieldValue("imgProduct", e.target.files[0])
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.imgProduct}
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={submitData}>
              Submit
            </Button>
            <Button onClick={onCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpenDelModal}
        onClose={onCloseDelModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure want to delete product {editProd?.name}?
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              colorScheme={"red"}
              onClick={() => {
                deleteSubmit(editProd?.id);
              }}
            >
              Delete
            </Button>
            <Button onClick={onCloseDelModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
