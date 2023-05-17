import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Icon,
  Image,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  FormHelperText,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../config/config";
import { Link as ReachLink } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import Logo from "../assets/logo.png";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function ChangePassword({ id }) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const handleClick = () => setShow(!show);
  const handleClick2 = () => setShow2(!show2);
  const handleClick3 = () => setShow3(!show3);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const userSelector = useSelector((state) => state.auth);
  const [enable, setEnable] = useState(false);
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      oldPassword: Yup.string().required("Password wajib diisi!"),
      newPassword: Yup.string()
        .required("Password wajib diisi!")
        .min(5, "Minimal terdapat 5 digit"),
      confirmPassword: Yup.string()
        .required("Passwords harus sama")
        .oneOf([Yup.ref("newPassword"), null], "Passwords harus sama"),
    }),
  });
  useEffect(() => {
    let { oldPassword, newPassword, confirmPassword } = formik.values;
    if (!oldPassword || !newPassword || !confirmPassword) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [formik.values]);
  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match");
      return;
    }
    try {
      const userId = localStorage.getItem("userID");
      const response = await axiosInstance.patch(
        `/api/user/password/${userId}`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: "Bearer" + " " + localStorage.getItem("token"),
          },
        }
      );
      navigate("/userpage");
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to change password");
    }
  };
  return (
    <>
      <Flex flex={1} align={"center"} justifyContent={"center"}>
        <Flex
          spacing={4}
          maxW={"md"}
          bgColor="#2C3639"
          w="430px"
          h="932px"
          color="white"
          flexDir="column"
          gap={8}
        >
          <Link to="/" as={ReachLink}>
            <Flex textAlign={"left"} py={5} color="white">
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
          <Center flexDir="column" justifyContent={"center"} gap={10}>
            <Image
              fontSize={"26px"}
              color="#F68522"
              justifyContent="center"
              src={Logo}
              py={10}
            ></Image>
            <Flex fontSize={"2xl"} flexDir="column" color="#DCD7C9">
              CHANGE PASSWORD
            </Flex>
            <form onSubmit={handleChangePassword}>
              <Center w="282px" flexDir="column" gap={5} color="#DCD7C9">
                <FormControl id="email">
                  <FormLabel>Ketikan Password Lama</FormLabel>

                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      name="password"
                      value={oldPassword}
                      onChange={(event) => {
                        setOldPassword(event.target.value);
                        formik.setFieldValue("oldPassword", event.target.value);
                      }}
                    />

                    <InputRightElement>
                      <Center h="2.5rem" size="sm" onClick={handleClick}>
                        {show ? (
                          <Icon
                            boxSize={"5"}
                            as={FaEyeSlash}
                            color="#white"
                            sx={{
                              _hover: {
                                cursor: "pointer",
                              },
                            }}
                          ></Icon>
                        ) : (
                          <Icon
                            boxSize={"5"}
                            as={FaEye}
                            color="#white"
                            sx={{
                              _hover: {
                                cursor: "pointer",
                              },
                            }}
                          ></Icon>
                        )}
                      </Center>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText color="white">
                    {formik.errors.oldPassword}
                  </FormHelperText>
                </FormControl>
                <FormControl id="email">
                  <FormLabel>Ketikan Password Baru</FormLabel>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={show2 ? "text" : "password"}
                      name="password"
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        formik.setFieldValue("newPassword", event.target.value);
                      }}
                    />
                    <InputRightElement>
                      <Center h="2.5rem" size="sm" onClick={handleClick2}>
                        {show2 ? (
                          <Icon
                            boxSize={"5"}
                            as={FaEyeSlash}
                            color="#white"
                            sx={{
                              _hover: {
                                cursor: "pointer",
                              },
                            }}
                          ></Icon>
                        ) : (
                          <Icon
                            boxSize={"5"}
                            as={FaEye}
                            color="#white"
                            sx={{
                              _hover: {
                                cursor: "pointer",
                              },
                            }}
                          ></Icon>
                        )}
                      </Center>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText color="white">
                    {formik.errors.newPassword}
                  </FormHelperText>
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Ketikan Ulang Password Baru</FormLabel>
                  <InputGroup size="md">
                    <Input
                      pr="4.5rem"
                      type={show3 ? "text" : "password"}
                      name="password"
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        formik.setFieldValue(
                          "confirmPassword",
                          event.target.value
                        );
                      }}
                    />
                    <InputRightElement>
                      <Center h="2.5rem" size="sm" onClick={handleClick3}>
                        {show3 ? (
                          <Icon
                            boxSize={"5"}
                            as={FaEyeSlash}
                            color="#white"
                            sx={{
                              _hover: {
                                cursor: "pointer",
                              },
                            }}
                          ></Icon>
                        ) : (
                          <Icon
                            boxSize={"5"}
                            as={FaEye}
                            color="#white"
                            sx={{
                              _hover: {
                                cursor: "pointer",
                              },
                            }}
                          ></Icon>
                        )}
                      </Center>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText color="white">
                    {formik.errors.confirmPassword}
                  </FormHelperText>
                </FormControl>

                <Button
                  colorScheme={"black"}
                  variant={"solid"}
                  w="280px"
                  color="white"
                  _hover={{
                    bg: "white",
                    color: "#2C3639",
                  }}
                  type="submit"
                >
                  CHANGE PASSWORD
                </Button>
                {errorMessage && (
                  <Flex>
                    <Alert
                      status="error"
                      zIndex={2}
                      variant="top-accent"
                      color={"black"}
                    >
                      <AlertIcon />
                      {errorMessage}
                    </Alert>
                  </Flex>
                )}
              </Center>
            </form>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}
