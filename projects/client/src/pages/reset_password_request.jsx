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
  Icon,
  Link,
  Textarea,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import { userLogin } from "../redux/middleware/userauth";
// import user_types from "../redux/auth/types";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/config";
import { useNavigate } from "react-router-dom";
import { Link as ReachLink } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import * as Yup from "yup";
// import YupPassword from 'yup-password';
import { useFormik } from "formik";
import axios from "axios";
// import AsyncSelect from "react-select/async"
import Logo from "../assets/logo.png";

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
    description: "Reset password link has been send to your email",
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

  const handleSuccess = (e) => {
    NotifySuccess();
    setInterval(() => {
      navigate("/userlogin");
    }, 6000);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email must be filled")
        .email("This is not email"),
    }),
    onSubmit: async () => {
      try {
        await axiosInstance.post("/api/user/request-reset", formik.values);
        handleSuccess();
      } catch (err) {
        handleError(err.response.data.errors);
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
        <Flex
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
          <Link to="/userlogin" as={ReachLink}>
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
              Reset Password
            </Flex>
            <Image
              fontSize={"26px"}
              color="#F68522"
              justifyContent="center"
              src={Logo}
            ></Image>

            <Center w="282px" flexDir="column" gap={3} color="#DCD7C9">
              <Flex
                fontSize={"xl"}
                fontWeight={"medium"}
                flexDir="column"
                color="#DCD7C9"
              >
                Forget your password?
              </Flex>
              <FormControl id="email">
                <FormLabel fontSize={"13px"} w={"inherit"}>
                  You'll get an email with a reset link
                </FormLabel>
                <Input
                  type="text"
                  name="email"
                  placeholder="your-email@example.com"
                  onChange={(e) =>
                    formik.setFieldValue("email", e.target.value)
                  }
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
        </Flex>
      </Center>
    </>
  );
}
