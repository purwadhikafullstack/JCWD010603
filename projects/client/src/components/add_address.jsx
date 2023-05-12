import {
  Button,
  Icon,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Checkbox,
  Select,
  Input,
  Link,
  useToast,
  FormHelperText,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { IoIosArrowBack } from "react-icons/io";

import { axiosInstance } from "../config/config";
import { useNavigate } from "react-router-dom";
import { Link as ReachLink } from "react-router-dom";

import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
export default function AddAdress(props) {
  const [isPrimary, setIsPrimary] = useState(false);
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const toast = useToast();
  const [status, setStatus] = useState(false);
  const [msg, setMsg] = useState("");
  const userSelector = useSelector((state) => state.auth);
  const [idProv, setIdProv] = useState(0);

  const navigate = useNavigate();
  const handleId = (e) => {
    setIdProv(e);
  };
  const [cityAPI, setCityAPI] = useState([
    {
      city_id: 0,
      city_name: "",
      type: "",
      postal_code: "",
      province_id: 0,
      province: "",
    },
  ]);
  const [provinceAPI, setProvinceAPI] = useState([
    {
      province_id: 0,
      province: "",
    },
  ]);
  const fetchProvince = async () => {
    try {
      const response = await axiosInstance.get(
        "https://jcwd010603.purwadhikabootcamp.com/api/api_rajaongkir/province"
      );
      const result = response.data;

      setProvinceAPI(result);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchProvince();
  }, []);

  const fetchCity = async () => {
    try {
      const response = await axiosInstance.get(
        `https://jcwd010603.purwadhikabootcamp.com/api/api_rajaongkir/city/${idProv}`
      );
      const result = response.data;
      setCityAPI(result);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchCity();
  }, [idProv]);

  const formik = useFormik({
    initialValues: {
      UserId: userSelector?.id,
      district: "",
      province: "",
      postalCode: 0,
      address: "",
      city: "",
      isPrimary: 0,
      Ket: "",
      idCity: 0,
      idProv: 0,
    },
    validationSchema: Yup.object().shape({
      city: Yup.string().required("City must be filled"),
      province: Yup.string().required("Province must be filled"),
      district: Yup.string().required("District must be filled"),
      address: Yup.string().required("Address must be filled"),
      postalCode: Yup.number().required("maksimal 5 dan harus angka"),
    }),
    onSubmit: async () => {
      const res = await axiosInstance
        .post("/api/address/addaddress", formik.values)
        .then(async (res) => {
          toast({
            title: "Address created.",
            description: "Your Address has been added",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          navigate("/list-address");
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "ERROR",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          console.log(error);
          setStatus(true);
          setMsg(error.response.data.message);
        });

      if (res.status === 200) {
        navigate("/list-address", { replace: true });
      }
    },
  });

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
            h="140px"
            bgColor="#2C3639"
            flexDir={"column"}
            gap={5}
          >
            <Link to="/list-address" as={ReachLink}>
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
                    <Center fontSize={"30px"}> ADD ADDRESS</Center>
                  </FormLabel>
                </FormControl>
              </Flex>
            </Center>
          </Flex>

          <Flex w="430px" flexDir="column" gap={5} color="#2C3639" px="40px">
            <FormControl id="address">
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  formik.setFieldValue("address", e.target.value)
                }
                bgColor="white"
              />
              <FormHelperText w={"268px"}>
                {formik.errors.address}
              </FormHelperText>
            </FormControl>

            <FormControl id="email">
              <FormLabel>Province</FormLabel>

              <Select
                name="province"
                bgColor="white"
                onChange={(e) => {
                  const selectedProvince = provinceAPI.find(
                    (val) => val.province === e.target.value
                  );
                  formik.setFieldValue("province", selectedProvince.province);
                  formik.setFieldValue("idProv", selectedProvince.province_id);
                  handleId(selectedProvince.province_id);
                }}
              >
                <option>{province}</option>
                {provinceAPI?.map((val) => {
                  return (
                    <option key={val.province_id} value={val.province}>
                      {val.province}
                    </option>
                  );
                })}
              </Select>
              <FormHelperText w={"268px"}>
                {formik.errors.province}
              </FormHelperText>
            </FormControl>
            <FormControl id="email">
              <FormLabel>City</FormLabel>

              <Select
                name="city"
                bgColor="white"
                onChange={(e) => {
                  const selectedCity = cityAPI.find(
                    (val) => val.city_name === e.target.value
                  );
                  formik.setFieldValue("city", e.target.value);
                  formik.setFieldValue("idCity", selectedCity.city_id);
                }}
              >
                <option>{city}</option>
                {cityAPI.map((c) => {
                  return (
                    <option key={c.city_id} value={c.city_name}>
                      {c.city_name}
                    </option>
                  );
                })}
              </Select>
              <FormHelperText w={"268px"}>{formik.errors.city}</FormHelperText>
            </FormControl>
            <FormControl id="district">
              <FormLabel>District</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  formik.setFieldValue("district", e.target.value)
                }
                bgColor="white"
              />{" "}
              <FormHelperText w={"268px"}>
                {formik.errors.district}
              </FormHelperText>
            </FormControl>
            <FormControl id="postalCode">
              <FormLabel>Postal Code</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  formik.setFieldValue("postalCode", e.target.value)
                }
                bgColor="white"
              />{" "}
              <FormHelperText w={"268px"}>
                {formik.errors.postalCode}
              </FormHelperText>
            </FormControl>

            <FormControl id="ket">
              <FormLabel>Ket</FormLabel>
              <Input
                type="text"
                onChange={(e) => formik.setFieldValue("Ket", e.target.value)}
                bgColor="white"
              />
            </FormControl>
            <FormControl id="email">
              <Center gap={3}>
                <Checkbox
                  onChange={(e) => {
                    setIsPrimary(!isPrimary);
                    formik.setFieldValue("isPrimary", !isPrimary);
                  }}
                >
                  Primary Address
                </Checkbox>
              </Center>
            </FormControl>
            <Button
              colorScheme={"black"}
              variant={"solid"}
              w="350px"
              color="#2C3639"
              _hover={{
                bg: "white",
                color: "#2C3639",
              }}
              onClick={formik.handleSubmit}
            >
              ADD
            </Button>
          </Flex>
        </Flex>
      </Center>
    </>
  );
}
