import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Icon,
  Link,
  Image,
  Grid,
  Textarea,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/config";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import Logo from "../assets/logo.png";

const queryParams = new URLSearchParams(window.location.search);
const token = queryParams.get("token");
// console.log(token);

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    description: "Reset password success",
    status: "success",
    duration: 5000,
    isClosable: true,
    position: "bottom-left",
  });

  const handleError = (e) => {
    console.log(e);
    setMsg(e);
    NotifyError();
  };

  const handleSuccess = () => {
    NotifySuccess();
    setInterval(() => {
      navigate("/userlogin");
    }, 6000);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required("Password must be filled")
        .min(8, "Password length should have min 8 characters")
        .max(16, "Password length should have max 16 characters")
        .matches(
          /^[ A-Za-z0-9_@-]*$/,
          `Only "_", "@","-" characters are allowed`
        ),
      passwordConfirm: Yup.string()
        .required("Password confirm must be filled")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async () => {
      try {
        await axiosInstance.post(
          `/user/reset-password/${token}`,
          formik.values
        );
        handleSuccess();
      } catch (err) {
        handleError(err.response.data.message);
      }
    },
  });

  const [enable, setEnable] = useState(false);

  useEffect(() => {
    let { email } = formik.values;
    if (email) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [formik.values]);

  return (
    <>
      <Center flex={1} align={"center"} justifyContent={"center"}>
        <Center
          paddingY={"25px"}
          spacing={4}
          maxW={"md"}
          bgColor="#2C3639"
          w="430px"
          h="760px"
          color="white"
          flexDir="column"
          gap={8}
        >
          <Flex fontSize={"2xl"} flexDir="column" color="#DCD7C9">
            Setup New Password
          </Flex>
          <Image
            fontSize={"26px"}
            color="#F68522"
            justifyContent="center"
            src={Logo}
          ></Image>

          <Center w="282px" flexDir="column" gap={3} color="#DCD7C9">
            <FormControl id="password">
              <FormLabel marginTop={"-7px"} fontSize={"14px"} w={"inherit"}>
                New Password
              </FormLabel>
              <Input
                type="password"
                name="password"
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
              <FormLabel marginTop={"-7px"} fontSize={"14px"} w={"inherit"}>
                Password Confirm
              </FormLabel>
              <Input
                type="password"
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
              onClick={formik.handleSubmit}
              disabled={enable ? null : "disabled"}
              marginTop={"25px"}
              colorScheme={"white"}
              variant={"solid"}
              color="#2C3639"
              w={"inherit"}
              borderRadius="3%"
              bgColor={"#DCD7C9"}
            >
              <Center>Submit</Center>
            </Button>
          </Center>
        </Center>
      </Center>
    </>
  );
}
