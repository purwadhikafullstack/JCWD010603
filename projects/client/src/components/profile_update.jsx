import {
  Button,
  Icon,
  Center,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Avatar,
  Select,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { axiosInstance } from "../config/config";
import { useNavigate } from "react-router-dom";
import { Link as ReachLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRef } from "react";
import user_types from "../redux/auth/types";
export default function UpdateProfile(props) {
  const [imgUser, setImgUser] = useState("");
  const data = props.data;
  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setbirthDate] = useState(new Date());
  const [gender, setGender] = useState(0);

  const toast = useToast();
  const [User_id, setUser_id] = useState(0);
  const userSelector = useSelector((state) => state.auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputFileRef = useRef(null);
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    setUser_id(userSelector?.id);
    fetchuserdetail(userSelector?.id);
  }, []);

  const navigate = useNavigate();

  const [userdetail, setUserDetail] = useState([]);

  useEffect(() => {
    fetchuserdetail(User_id);
  }, []);
  const fetchuserdetail = async (User_id) => {
    await axiosInstance
      .get("/api/user/" + User_id)
      .then((response) => {
        setUserDetail(response.data.result);

        setFirstName(response.data.result.User_detail.firstname);
        setLastName(response.data.result.User_detail.lastname);
        setEmail(response.data.result.email);
        setbirthDate(response.data.result.User_detail.birthDate);
        setImgUser(response.data.result.User_detail.imgUser);
        setGender(response.data.result.User_detail.gender);
      })
      .catch((error) => {
        console.log({ error });
      });
  };

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    const url = URL.createObjectURL(event.target.files[0]);
    formik.setFieldValue("avatar_url", url);
  };

  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];
  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      avatar: selectedFile,
      avatar_url: data?.imgUser || imgUser,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Mohon isi email @"),
      firstName: Yup.string().min(3, "min 3 huruf"),
      avatar: Yup.mixed()
        .nullable()
        .required("Required Field")
        .test(
          "size",
          "File size is too big",
          (value) => value && value.size <= 1000 * 1000 // 1MB
        )
        .test(
          "type",
          "Invalid file format selection",
          (value) =>
            !value || (value && SUPPORTED_FORMATS.includes(value?.type))
        ),
    }),
    onSubmit: async (value) => {
      const { avatar } = value;
      const formData = new FormData();
      formData.append("image", avatar);
      await axiosInstance
        .patch(`/api/user/updatefoto/${props?.user.id}`, formData)
        .then(async (res) => {
          toast({
            title: "Account created",
            description: " Your Profile has been Updated",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.message,
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        });
    },
  });
  useEffect(() => {
    let { avatar } = formik.values;
    if (!avatar) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [formik.values]);

  const saveUser = async (e) => {
    e.preventDefault();
    const Data = {
      User_id,
      firstName,
      lastName,
      birthDate,
      email,
      gender,
    };

    try {
      await axiosInstance.patch("/api/user/editprofile/" + User_id, Data);
      navigate("/userpage");
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
            h="358px"
            bgColor="#2C3639"
            flexDir={"column"}
            gap={5}
          >
            <Link to="/" as={ReachLink}>
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

            <Center flexDir={"column"} gap={3}>
              <Flex flexDir={"column"}>
                <FormControl id="productName">
                  <FormLabel>
                    {" "}
                    <Center fontSize={"30px"}> EDIT PROFILE</Center>
                  </FormLabel>

                  <Stack direction={["column"]} spacing={6} py={3}>
                    <Flex>
                      <Flex flexDir={"column"}>
                        <Avatar
                          size="2xl"
                          src={formik.values.avatar_url || imgUser}
                          id="avatar"
                        ></Avatar>
                        <FormHelperText color={"white"}>
                          {formik.errors.avatar}
                        </FormHelperText>
                      </Flex>
                      <Center
                        w="full"
                        justifyContent={"center"}
                        flexDir="column"
                        gap={3}
                      >
                        <Flex flexDir={"column"}>
                          <Text fontWeight="bold">{props?.user.username}</Text>
                          <Text
                            color="#0095F6"
                            fontWeight="bold"
                            cursor={"pointer"}
                            onClick={() => inputFileRef.current.click()}
                          >
                            Change Profile Picture
                          </Text>

                          <Input
                            id=""
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleFile(e);
                              formik.setFieldValue("avatar", e.target.files[0]);
                            }}
                            w="full"
                            placeholder="Image URL"
                            display="none"
                            ref={inputFileRef}
                            name={imgUser}
                          ></Input>
                        </Flex>
                      </Center>
                    </Flex>

                    <Button
                      colorScheme={"black"}
                      variant={"solid"}
                      w="350px"
                      color="white"
                      _hover={{
                        bg: "white",
                        color: "#2C3639",
                      }}
                      type="submit"
                      onClick={formik.handleSubmit}
                      isDisabled={enable ? true : null}
                    >
                      Upload
                    </Button>
                  </Stack>
                </FormControl>
                <Flex justifyContent={"bottom"}></Flex>
              </Flex>
            </Center>
          </Flex>

          <Flex w="430px" flexDir="column" gap={5} color="#2C3639" px="40px">
            <FormControl id="firstname">
              <FormLabel>Firstname</FormLabel>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  formik.setFieldValue("firstName", e.target.value);
                }}
                bgColor="white"
              />
              <FormHelperText>{formik.errors.firstName}</FormHelperText>
            </FormControl>
            <FormControl id="lastname">
              <FormLabel>Lastname</FormLabel>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                bgColor="white"
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  formik.setFieldValue("email", e.target.value);
                }}
                bgColor="white"
              />
              <FormHelperText>{formik.errors.email}</FormHelperText>
            </FormControl>

            <FormControl id="gender">
              <FormLabel>Gender</FormLabel>
              <Select
                variant="outline"
                bgColor="white"
                value={gender}
                placeholder={gender ? "MEN" : "WOMEN"}
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              >
                {gender ? (
                  <option value="0">WOMEN</option>
                ) : (
                  <option value="1">MEN</option>
                )}
              </Select>
            </FormControl>
            <FormControl id="birthday">
              <FormLabel>Birthday</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="date"
                bgColor="white"
                value={birthDate}
                onChange={(e) => {
                  setbirthDate(e.target.value);
                }}
              />
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
              type="submit"
              onClick={(e) => saveUser(e)}
            >
              UPDATE
            </Button>
          </Flex>
        </Flex>
      </Center>
    </>
  );
}
