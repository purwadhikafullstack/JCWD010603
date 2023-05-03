import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Image,
  Grid,
  Textarea,
  Link,
  Icon,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/config";
import { useNavigate } from "react-router-dom";
import { Link as ReachLink } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
// import user_types from "../redux/auth/types";
// import { userLogin } from "../redux/middleware/userauth";
// import YupPassword from 'yup-password';
import axios from "axios";
// import AsyncSelect from "react-select/async"
import Logo from "../assets/logo.png";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [province, setProvince] = useState([
    {
      province_id: 0,
      province: "",
    },
  ]);

  const [city, setCity] = useState([
    {
      city_id: 0,
      city_name: "",
      type: "",
      postal_code: "",
      province_id: 0,
      province: "",
    },
  ]);

  const [msg, setMsg] = useState("");

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
    description: "Create Account",
    status: "success",
    duration: 5000,
    isClosable: true,
    position: "bottom-left",
  });

  const [idProv, setIdProv] = useState(0);

  // province
  const fetchProvince = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api_rajaongkir/province"
      );
      const result = response.data;

      setProvince(result);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchProvince();
  }, []);

  const handleId = (e) => {
    setIdProv(e);
  };

  const handleError = () => {
    NotifyError();
  };

  const handleSuccess = () => {
    NotifySuccess();
    setInterval(() => {
      navigate("/userlogin");
    }, 6000);
  };

  // city
  const fetchCity = async () => {
    try {
      console.log(idProv);
      const response = await axios.get(
        `http://localhost:8000/api_rajaongkir/city/${idProv}`
      );
      const result = response.data;
      setCity(result);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchCity();
  }, [idProv]);

  // console.log(province)

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      gender: "",
      birthDate: "",
      province: "",
      city: "",
      postalCode: "",
      address: "",
      phoneNumber: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email must be filled")
        .email("This is not email"),
      username: Yup.string()
        .required("Username must be filled")
        .min(8, "Username should have min 8 characters"),
      phoneNumber: Yup.string(),
      city: Yup.string().required("City must be filled"),
      province: Yup.string().required("Province must be filled"),
      district: Yup.string().required("District must be filled"),
      address: Yup.string().required("Address must be filled"),
      gender: Yup.string().required("Gender must be filled"),
      birthDate: Yup.string().required("Birth Date must be filled"),
      firstName: Yup.string()
        .required("First Name must be filled")
        .min(3, "First Name should have min 8 characters"),
      password: Yup.string()
        .required("Password must be filled")
        .min(8, "Password length should have min 8 characters")
        .max(16, "Password length should have max 16 characters")
        .matches(
          /^[ A-Za-z0-9_@-]*$/,
          `only "_", "@","-" characters are allowed`
        ),
      passwordConfirm: Yup.string()
        .required("Password confirm must be filled")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async () => {
      try {
        await axiosInstance.post("/user/register", formik.values);
        handleSuccess();
      } catch (err) {
        setMsg(err.response.data.errors[0].msg);
        handleError();
      }
    },
  });

  const [enable, setEnable] = useState(false);

  useEffect(() => {
    let {
      email,
      password,
      username,
      address,
      city,
      province,
      district,
      postalCode,
      birthDate,
      firstName,
      passwordConfirm,
    } = formik.values;
    if (
      email &&
      password &&
      username &&
      address &&
      city &&
      province &&
      district &&
      postalCode &&
      birthDate &&
      firstName &&
      passwordConfirm
    ) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [formik.values]);

  return (
    <>
      <Center flex={1} align={"center"} justifyContent={"center"}>
        <Center
          spacing={4}
          maxW={"md"}
          // bgColor="#2C3639"
          bgColor="#DCD7C9"
          w="430px"
          color="#black"
          flexDir="column"
          gap={3}
        >
          <Flex
            w="430px"
            h="250px"
            bgColor="#2C3639"
            flexDir={"column"}
            gap={3}
            py={5}
          >
            <Link to="/" as={ReachLink}>
              <Flex textAlign={"left"} color="white" py={3} px={3}>
                <Icon
                  boxSize={"7"}
                  // as={IoIosArrowBack}
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
            <Image
              fontSize={"26px"}
              color="#2C3639"
              justifyContent="center"
              src={Logo}
            ></Image>
            <Flex fontSize={"2xl"} flexDir="column" color="#DCD7C9">
              REGISTER USER
            </Flex>
          </Flex>
          <Center w="282px" flexDir="column" gap={2} color="#2C3639">
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                bgColor="white"
                name="email"
                onChange={(e) => formik.setFieldValue("email", e.target.value)}
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.email}
              </FormHelperText>
            </FormControl>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                bgColor="white"
                onChange={(e) =>
                  formik.setFieldValue("username", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.username}
              </FormHelperText>
            </FormControl>
            <FormControl id="firstName">
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                bgColor="white"
                onChange={(e) =>
                  formik.setFieldValue("firstName", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.firstName}
              </FormHelperText>
            </FormControl>
            <FormControl id="lastName">
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                bgColor="white"
                onChange={(e) =>
                  formik.setFieldValue("lastName", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.lastName}
              </FormHelperText>
            </FormControl>
            <Grid w={"inherit"} templateColumns="repeat(2, 1fr)" gap="3">
              <FormControl id="gender" w={"100%"}>
                <FormLabel>Gender</FormLabel>
                <Select
                  name="gender"
                  textAlign={"center"}
                  bgColor="white"
                  placeholder="Select"
                  onChange={(e) =>
                    formik.setFieldValue("gender", e.target.value)
                  }
                >
                  <option value="0">Woman</option>
                  <option value="1">Man</option>
                </Select>
                <FormHelperText
                  w={"inherit"}
                  marginTop={"5px"}
                  color={"red.500"}
                  fontSize={"9px"}
                >
                  {formik.errors.gender}
                </FormHelperText>
              </FormControl>
              <FormControl id="birthDate" w={"100%"}>
                <FormLabel>Birth Date</FormLabel>
                <Input
                  type="date"
                  name="birthDate"
                  bgColor="white"
                  onChange={(e) =>
                    formik.setFieldValue("birthDate", e.target.value)
                  }
                  fontSize="15px"
                />
                <FormHelperText
                  w={"inherit"}
                  marginTop={"5px"}
                  color={"red.500"}
                  fontSize={"9px"}
                >
                  {formik.errors.birthDate}
                </FormHelperText>
              </FormControl>
            </Grid>

            <FormControl id="province">
              <FormLabel>Province</FormLabel>
              <Select
                placeholder="Select"
                name="province"
                textAlign={"center"}
                onChange={(e) => {
                  formik.setFieldValue("province", e.target.value);
                  handleId(e.target.value);
                }}
              >
                {province.map((p) => {
                  return (
                    <option key={p.province_id} value={p.province_id}>
                      {p.province}
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
                {formik.errors.province}
              </FormHelperText>
            </FormControl>

            <Grid w={"inherit"} templateColumns="repeat(2, 1fr)" gap="3">
              <FormControl id="city">
                <FormLabel>City</FormLabel>
                <Select
                  placeholder="Select "
                  name="city"
                  textAlign={"center"}
                  onChange={(e) => formik.setFieldValue("city", e.target.value)}
                >
                  {city.map((c) => {
                    return (
                      <option key={c.city_id} value={c.city_id}>
                        {c.city_name}
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
                  {formik.errors.city}
                </FormHelperText>
              </FormControl>
              <FormControl id="postalCode">
                <FormLabel>Postal Code</FormLabel>
                <Input
                  bgColor={"white"}
                  type="text"
                  name="postalCode"
                  onChange={(e) =>
                    formik.setFieldValue("postalCode", e.target.value)
                  }
                />
                <FormHelperText
                  w={"inherit"}
                  marginTop={"5px"}
                  color={"red.500"}
                  fontSize={"9px"}
                >
                  {formik.errors.postalCode}
                </FormHelperText>
              </FormControl>
            </Grid>
            <FormControl id="district">
              <FormLabel>District</FormLabel>
              <Input
                type="text"
                bgColor="white"
                name="district"
                onChange={(e) =>
                  formik.setFieldValue("district", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.district}
              </FormHelperText>
            </FormControl>
            <FormControl id="address">
              <FormLabel>Address</FormLabel>
              <Textarea
                type="text"
                name="address"
                bgColor="white"
                maxH={"150px"}
                onChange={(e) =>
                  formik.setFieldValue("address", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.address}
              </FormHelperText>
            </FormControl>
            <FormControl id="phoneNumber">
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                bgColor="white"
                name="phoneNumber"
                onChange={(e) =>
                  formik.setFieldValue("phoneNumber", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.phoneNumber}
              </FormHelperText>
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                bgColor="white"
                onChange={(e) =>
                  formik.setFieldValue("password", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.password}
              </FormHelperText>
            </FormControl>
            <FormControl id="passwordConfirm">
              <FormLabel>Password Confirmation</FormLabel>
              <Input
                type="password"
                bgColor="white"
                name="passwordConfirm"
                onChange={(e) =>
                  formik.setFieldValue("passwordConfirm", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.passwordConfirm}
              </FormHelperText>
            </FormControl>

            <Button
              marginBottom={"50px"}
              onClick={formik.handleSubmit}
              disabled={enable ? null : "disabled"}
              marginTop={"25px"}
              colorScheme={"white"}
              variant={"solid"}
              color="#2C3639"
              w={"inherit"}
              _hover={{
                bg: "#E1E1E1",
                color: "#2C3639",
              }}
              borderRadius="7px"
              bgColor={"white"}
            >
              Submit
            </Button>
          </Center>
        </Center>
      </Center>
    </>
  );
}
