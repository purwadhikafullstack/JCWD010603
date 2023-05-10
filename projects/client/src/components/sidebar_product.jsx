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
  Tooltip,
  Center,
  Stack,
  Checkbox,
  Select,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";

import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { BsPlusCircleFill } from "react-icons/bs";
import {
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaBoxes,
  FaRegCreditCard,
  FaChartLine,
  FaCashRegister,
  FaCog,
  FaFolder,
} from "react-icons/fa";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Link as ReachLink } from "react-router-dom";
import { useRef } from "react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiBox,
  FiWatch,
} from "react-icons/fi";
import { FaPowerOff } from "react-icons/fa";
import {Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, ModalFooter, FormHelperText, ModalContent, Textarea} from '@chakra-ui/react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "../config/config";

import { useEffect, useState } from "react";


export default function Sidebar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const data = props.data;
  const initialRef = useRef(null);
  const finalRef = useRef(null);

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

  const [imgProduct, setImgProduct] = useState("");
  const [saveImage, setSaveImage] = useState(null);
  const [cat, setCat] = useState([{
    'id' : 0,
    'name': ""
  }])

  const handleFile = (event) => {
    const uploaded = event.target.files[0];
    console.log(uploaded);
    formik.setFieldValue("imgProduct", event.target.value)
    setImgProduct(URL.createObjectURL(uploaded));
    setSaveImage(uploaded);
  };

  const fetchCategory = async () => {
    const response = await axiosInstance("/admin/categories")
    const result = response.data.result
    // console.log(result)
    setCat(result)
    
  }
  useEffect(() => {
    fetchCategory()
  },[])

  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];

  const formik = useFormik({
      initialValues : {   
          name : "",
          price : 0,
          desc : "",
          imgProduct : ""
      } ,
      validationSchema : Yup.object().shape({
          name: Yup.string().required("Name must be filled"),
          imgProduct: Yup.mixed()
          .nullable()
          .required("Image product must be a filled")
          .test(
            "type",
            "Invalid file format selection",
            (value) =>
              !value || (value && SUPPORTED_FORMATS.includes(value?.type))
          ).test(
            "size",
            "File size is too big",
            (value) => value && value.size <= 1000 * 1000 // 1MB
          )
         ,
    
      }),
      onSubmit:  async ()=> {
          try{
          console.log(formik.values)
          //   await axiosInstance.post("/user/register", formik.values)
          //   handleSuccess()
          }catch(err){
          //   setMsg(err.response.data.errors[0].msg);
          //   handleError()        
          }
          
      }
  })


  return (
    <>
      <Flex
        zIndex={90}
        px={2}
        w={"245px"}
        backgroundColor="white"
        justifyContent="center"
        minH={"100vh"}
        left="209"
        padding="5px"
        display={"flex"}
        borderRight={"2px solid #E2E8F0"}
        overflow="hidden"
      >
        <Flex
          flexDir={"column"}
          paddingBottom={"5px"}
          maxH={"685px"}
          overflowY="auto"
          overflowX={"hidden"}
          py="165px"
        >
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
            <Box as="b" mx={3} fontSize={18} color="black" textAlign={"center"}>
              {" "}
              CATEGORIES
            </Box>
          </Flex>

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
                <Flex px={5} spacing={2} direction="column" fontSize="10px">
                  {data?.map((product) => {
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
                <Flex flexDir={"column"} alignItems={"center"} gap={2}>
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
          <Flex gap={5} flexDir="column">
            <Flex
              w="200px"
              h="56px"
              alignItems={"center"}
              borderRadius={"2%"}
              onClick={props?.filter}
              _hover={{
                bg: "#DCD7C9",
                color: "white",
                cursor: "pointer",
              }}
              py={2}
            >
              <Icon as={AiOutlineSearch} color="black" mx={2} />
              <Box
                as="b"
                mx={3}
                fontSize={18}
                color="black"
                textAlign={"center"}
              >
                {" "}
                FILTER
              </Box>
            </Flex>
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

              <Box
                onClick={onOpen}
                as="b"
                mx={3}
                fontSize={18}
                color="black"
                textAlign={"center"}
              ><Icon as={BsPlusCircleFill} color="black" mx={2} /> ADD PRODUCT
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Modal
          initialFocusRef={initialRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Products</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
  
              <FormControl id="name">
                <FormLabel>Product Name</FormLabel>
                <Input type="text" name="name" onChange={(e)=> formik.setFieldValue("name", e.target.value )} />
                <FormHelperText  w={"inherit"} marginTop={"5px"} color={"red.500"} fontSize={"9px"} >
                    {formik.errors.name}
                </FormHelperText>
              </FormControl>
              <FormControl id="price">
                <FormLabel>Product Price</FormLabel>
                <Input type="text" name="price" onChange={(e)=> formik.setFieldValue("price", e.target.value )} />
                <FormHelperText  w={"inherit"} marginTop={"5px"} color={"red.500"} fontSize={"9px"} >
                    {formik.errors.price}
                </FormHelperText>
              </FormControl>
              <FormControl id="category">
                <FormLabel>Product Category</FormLabel>
                <Select  name='category' placeholder='Select' onChange={(e)=> formik.setFieldValue("category", e.target.value )}>
                {
                      cat.map((c)=> {
                        return (
                        <option key = {c.id} value= {c.id}>{c.name}</option>
                        )
                      })
                    }
                </Select>
                <FormHelperText  w={"inherit"} marginTop={"5px"} color={"red.500"} fontSize={"9px"} >
                    {formik.errors.category}
                </FormHelperText>
              </FormControl>
              <FormControl id="address">
              <FormLabel>Product Description</FormLabel>
              <Textarea
                type="text"
                name="address"
                bgColor="white"
                maxH={"150px"}
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
              <FormControl id="imgProduct">
                <FormLabel>Product Image</FormLabel>
                <Input paddingTop="4px" type="file" name="imgProduct" onChange={handleFile} />
                <FormHelperText  w={"inherit"} marginTop={"5px"} color={"red.500"} fontSize={"9px"} >
                    {formik.errors.imgProduct}
                </FormHelperText>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={formik.handleSubmit}>
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </>
  );
}
