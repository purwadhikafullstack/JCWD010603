import {
  Button,
  Icon,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Heading,
  Accordion,
  Avatar,
  AvatarBadge,
  IconButton,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  Box,
  Select,
  Input,
  Spacer,
  Link,
  Stack,
  InputGroup,
  Image,
  Alert,
  AlertIcon,
  Badge,
  useToast,
  InputRightElement,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { IoIosArrowBack, IoIosCloseCircleOutline } from "react-icons/io";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { FaUserCircle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { GrClose } from "react-icons/gr";

import { AiFillCamera } from "react-icons/ai";
import { userLogin } from "../redux/middleware/userauth";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/config";
import { useNavigate } from "react-router-dom";
import { Link as ReachLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";
import { useSelector } from "react-redux";

export default function ListAdress(props) {
  const [imgUser, setImgUser] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [district, setDistrict] = useState("");
  const [addressList, setAddressList] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const data = props.data;
  const location = useLocation();
  const toast = useToast();
  const [User_id, setUser_id] = useState(0);
  const userSelector = useSelector((state) => state.auth);
  console.log(userSelector);
  useEffect(() => {
    setUser_id(userSelector?.id);
    fetchuserdetail(userSelector?.id);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saveImage, setSaveImage] = useState(null);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [userdetail, setUserDetail] = useState([]);
  const [enable, setEnable] = useState(false);

  const handleFile = (event) => {
    const uploaded = event.target.files[0];
    console.log(uploaded);
    setImgUser(URL.createObjectURL(uploaded));
  };

  const handleEditToAddress = (product) => {
    setAddressList([...addressList, product]);
  };
  useEffect(() => {
    fetchuserdetail(User_id);
  }, []);
  const fetchuserdetail = async (User_id) => {
    await axiosInstance
      .get("/address/" + User_id)
      .then((response) => {
        setUserDetail(response.data.result);
        console.log(response.data.result);
        setDistrict(response.data.result.district);
        setProvince(response.data.result.province);
        setAddress(response.data.result.address);
        setPostalCode(response.data.result.postalCode);
        setCity(response.data.result.city);
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  function inputHandler(event) {
    const { name, value } = event.target;

    setUser({
      ...user,
      [name]: value,
    });
  }

  const saveUser = async (e) => {
    e.preventDefault();
    const Data = {
      User_id,
      district,
      province,
      postalCode,
      address,
      city,
    };

    try {
      console.log(Data);
      await axiosInstance.patch("/editaddress?id=" + User_id, Data);
      navigate("/userpage");
      console.log("user edited");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
            <Link to="/userpage" as={ReachLink}>
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
                    {data?.map((address) => (
                      <Address
                        delete={props.delete}
                        address={address}
                        handleEditToAddress={handleEditToAddress}
                      />
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
                </Flex>
              </Flex>
            </Center>
          </Flex>
        </Flex>
      </Center>
    </>
  );
}

function Address(props) {
  const [qty, setQty] = useState(1);
  const data = props.data;
  return (
    <>
      <Flex p={2} gap={2} fontFamily={"Tw Cen MT"} px="5px" bgColor={"white"}>
        <Flex flexDir={"row"} fontSize="12px" w="350px" h="90px" px={5}>
          <Flex flexDir={"column"} w="260px">
            <Flex gap={5}>
              <Flex fontSize="14px" color="#2C3639">
                {props.address?.Ket}
              </Flex>
              <Flex fontSize="14px" color="#2C3639">
                {props.address?.isPrimary == 1 ? (
                  <Badge variant="solid" colorScheme="green">
                    Alamat Utama
                  </Badge>
                ) : null}
              </Flex>
            </Flex>
            <Flex fontSize="12px" color="#2C3639">
              {props.address?.address}
            </Flex>
            <Flex fontSize="12px" color="#2C3639">
              {props.address?.district}, {props.address?.city},{" "}
              {props.address?.province}
            </Flex>
            <Flex fontSize="12px" color="#2C3639">
              {props.address?.postalCode}
            </Flex>
          </Flex>

          <Center gap={1} w="40px">
            <Link to={"/update-address/" + props.address?.id} as={ReachLink}>
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
              onClick={() => props.delete(props.address?.id)}
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
    </>
  );
}
