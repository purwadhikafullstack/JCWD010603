import { useEffect, useState } from "react";
import "../css/pagination.css";
import axios from "axios";
import { Link as ReachLink } from "react-router-dom";
import {
  Flex,
  Image,
  InputGroup,
  Divider,
  InputRightElement,
  Input,
  InputRightAddon,
  List,
  ListItem,
  Button,
  Select,
  Grid,
  GridItem,
  Box,
  Icon,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  useDisclosure,
  ButtonGroup,
  PopoverFooter,
  IconButton,
  Slide,
  Text,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  Checkbox,
} from "@chakra-ui/react";
import { TbFilter } from "react-icons/tb";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { GrSort, GrFilter } from "react-icons/gr";
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
import { Link } from "react-router-dom";
import React from "react";

import { axiosInstance, beautyScroll } from "../config/config";
export default function ProductUserPage(props) {
  const data = props.data;
  const datacat = props.datacat;
  const databranch = props.databranch;
  const branchProduct = props.branchProduct;
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [closeFilterDialog, setCloseFilterDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState([]);
  // const [branchId, setBranchId] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [branch, setBranch] = useState("");
  const [idBranch, setIdBranch] = useState(localStorage.getItem("branchID"));
  const [page, setPage] = useState(1);

  const handleId = (e) => {
    setIdBranch(e);
  };

  const selectPageHandle = (selectPage) => {
    if (
      selectPage >= 1 &&
      selectPage <= Math.ceil(data.length / 6) &&
      selectPage !== page
    ) {
      setPage(selectPage);
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

  return (
    <>
      <Center
        w="430px"
        zIndex={20}
        gap={2}
        paddingTop="20px"
        paddingBottom={"20px"}
        justifyContent="start"
        fontFamily={"Tw Cen MT"}
        flexWrap="wrap"
        position={"relative"}
        flexDir={"column"}
        fontSize="30px"
        overflow={"hidden"}
      >
        PRODUCT LIST
        <Center fontSize={"14px"} gap={3} justifyContent="left">
          Branch
          <Select
            name="city"
            bgColor="white"
            value={idBranch}
            onChange={(e) => {
              setBranch(e.target.value);
              handleId(e.target.value);
              props.setIdBranch(e.target.value);
            }}
          >
            {databranch.map((branch) => {
              return (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              );
            })}
          </Select>
        </Center>
        <Divider orientation="horizontal" m={2} />
        <Flex>
          <InputGroup gap={3}>
            <Input
              onKeyDown={(e) =>
                e.key === "Enter" ? props?.fin(e.target.value) : null
              }
              backgroundColor={"white"}
              type="tel"
              placeholder="Search"
              w="200px"
              h="35px"
              borderRadius={"none"}
              onChange={inputHandler}
              name="search"
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
            <Popover placement="bottom-start" isOpen={isOpen} onClose={onClose}>
              <PopoverTrigger>
                <Flex
                  justifyContent="center"
                  textAlign="center"
                  h="35px"
                  w="35px"
                  _hover={{
                    bg: "grey",
                    color: "black",
                    cursor: "pointer",
                  }}
                  borderRadius="100%"
                  bgColor={"#DCD7C9"}
                  onClick={onOpen}
                  // onClick={setOpenFilterDialog(true)}
                >
                  {" "}
                  <Center>
                    <Icon as={TbFilter} justifyContent="center"></Icon>
                  </Center>{" "}
                </Flex>
              </PopoverTrigger>
              <PopoverContent color="white" bg="#DCD7C9">
                <PopoverHeader fontWeight="bold" border="0">
                  <Flex alignItems={"center"} borderRadius={"2%"}>
                    <Icon as={FaFolder} color="black" mx={5} />
                    <Box
                      as="b"
                      fontSize={18}
                      color="black"
                      textAlign={"center"}
                    >
                      CATEGORIES
                    </Box>
                  </Flex>
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton
                  color={"white"}
                  bgColor={"red"}
                  borderRadius="100%"
                />
                <PopoverBody>
                  <Accordion defaultIndex={[0]} allowMultiple color={"black"}>
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
                          color={"black"}
                        >
                          {datacat?.map((product) => {
                            return (
                              <>
                                <Checkbox
                                  colorScheme="cyan"
                                  borderColor={"black"}
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

                  <Accordion defaultIndex={[0]} allowToggle color={"black"}>
                    <AccordionItem>
                      <h2>
                        <AccordionButton color={"black"}>
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
                            bgColor={"white"}
                            color="black"
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
                            bgColor={"white"}
                            color="black"
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
                </PopoverBody>
                <PopoverFooter
                  border="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="right"
                  pb={4}
                >
                  <ButtonGroup size="sm">
                    <Flex
                      borderRadius={"2%"}
                      onClick={
                        props?.filter
                        // setCloseFilterDialog(true);
                      }
                      _hover={{
                        bg: "#DCD7C9",
                        color: "white",
                        cursor: "pointer",
                      }}
                      py={2}
                    >
                      <Button
                        colorScheme="green"
                        fontSize={"18px"}
                        onClick={onClose}
                      >
                        Filter
                      </Button>
                    </Flex>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </InputGroup>
        </Flex>
        <Center>
          <Center
            w="430px"
            gap={5}
            paddingTop="20px"
            paddingBottom={"20px"}
            justifyContent="center"
            flexDir={"row"}
            flexWrap="wrap"
            overflowX={"auto"}
            overflowY={"auto"}
            sx={beautyScroll}
            h="465px"
          >
            {branchProduct
              .slice(page * 6 - 6, page * 6)
              ?.map((product, index) => {
                return (
                  <>
                    <Box minW="135px" h="250px">
                      <Flex
                        onClick={localStorage.setItem("branchID", idBranch)}
                      >
                        <Link
                          to={"/detail-product/" + product?.id}
                          as={ReachLink}
                        >
                          <Image
                            w={["50px", "100px", "135px"]}
                            h={["50px", "100px", "135px"]}
                            src={product?.imgProduct}
                            alt={`Picture of ${product?.name}`}
                            roundedTop="lg"
                          />
                        </Link>
                      </Flex>
                      <Flex
                        mt="1"
                        justifyContent="space-between"
                        alignContent="center"
                        flexDir={"column"}
                        w="150px"
                      >
                        <Box
                          fontSize="12px"
                          fontWeight="semibold"
                          as="h4"
                          lineHeight="tight"
                        >
                          {product?.category}
                        </Box>
                        <Box
                          fontSize="12px"
                          as="h4"
                          lineHeight="tight"
                          fontWeight={"bold"}
                        >
                          {product?.name}
                        </Box>

                        <Box fontSize="12px" as="h4">
                          <Text>
                            {" "}
                            Price : Rp. {product?.price.toLocaleString()}
                          </Text>
                        </Box>
                        <Box fontSize="12px" as="h4"></Box>
                      </Flex>
                    </Box>
                  </>
                );
              })}
          </Center>
        </Center>
        <Center
          gap={5}
          w="430px"
          position={"fixed"}
          bottom={0}
          p={2}
          bgColor="white"
        >
          {branchProduct.length > 0 && (
            <Flex gap={5}>
              <Button
                className="arrows"
                onClick={() => selectPageHandle(page - 1)}
              >
                <BiLeftArrowAlt />
              </Button>
              <Flex gap={5} className="pageNumbers">
                {[...Array(Math.ceil(branchProduct.length / 6))].map((n, i) => {
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
              <Button
                className="arrows"
                onClick={() => selectPageHandle(page + 1)}
              >
                {" "}
                <BiRightArrowAlt />
              </Button>
            </Flex>
          )}
        </Center>
      </Center>
    </>
  );
}
