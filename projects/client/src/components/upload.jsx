import {
  Button,
  Icon,
  Center,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Link,
  Stack,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { IoIosArrowBack } from "react-icons/io";

import { axiosInstance } from "../config/config";
import { useNavigate } from "react-router-dom";
import { Link as ReachLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

import { useRef } from "react";

export default function UpdateProfile(props) {
  const [imgUser, setImgUser] = useState(
    "https://support.photoshelterbrands.com/hc/article_attachments/115000967094/Screen_Shot_2017-07-12_at_5.32.17_PM.png"
  );
  const data = props.data;

  const location = useLocation();
  const toast = useToast();
  const [noTrans, setNoTrans] = useState(0);

  const [selectedFile, setSelectedFile] = useState(null);
  const inputFileRef = useRef(null);
  const [enable, setEnable] = useState(false);
  useEffect(() => {
    setNoTrans(location.pathname?.split("/")[2]);
  }, []);

  const navigate = useNavigate();

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    const url = URL.createObjectURL(event.target.files[0]);
    formik.setFieldValue("image_url", url);
  };

  const SUPPORTED_FORMATS = ["image/jpg", "image/png", "image/jpeg"];
  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      image: selectedFile,
      image_url: data?.imgUser || imgUser,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Mohon isi email @"),
      firstName: Yup.string().min(3, "min 3 huruf"),
      image: Yup.mixed()
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
            // console.log(value);
            !value || (value && SUPPORTED_FORMATS.includes(value?.type))
        ),
    }),
    onSubmit: async (value) => {
      const { image } = value;
      const formData = new FormData();
      formData.append("image", image);
      await axiosInstance
        .patch(`transaction/uploadfoto/${noTrans}`, formData)
        .then(async (res) => {
          console.log(res.data.result);
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
      navigate("/product-list-user");
    },
  });
  useEffect(() => {
    let { image } = formik.values;
    if (!image) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [formik.values]);

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
          gap={2}
        >
          <Flex w="430px" h="80px" bgColor="#2C3639" flexDir={"column"}>
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

            <Center flexDir={"column"} gap={3}>
              <Flex flexDir={"column"}>
                <Center fontSize={"30px"}> Upload Payment</Center>
              </Flex>
            </Center>
          </Flex>
          <FormControl id="productName">
            <FormLabel> </FormLabel>

            <Stack direction={["column"]} gap={3} justifyContent={"center"}>
              <Flex flexDir={"column"} gap={2} color="black">
                Preview
                <Center flexDir={"column"}>
                  <Image
                    src={formik.values.image_url || imgUser}
                    id="image"
                    w="350px"
                    h="540px"
                  ></Image>
                  <FormHelperText color={"black"}>
                    {formik.errors.image}
                  </FormHelperText>
                </Center>
                <Center
                  w="full"
                  justifyContent={"center"}
                  flexDir="column"
                  gap={2}
                >
                  <Flex flexDir={"column"}>
                    <Text
                      color="black"
                      fontWeight="bold"
                      cursor={"pointer"}
                      onClick={() => inputFileRef.current.click()}
                    >
                      {" "}
                      Select File
                    </Text>

                    <Input
                      id=""
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleFile(e);
                        formik.setFieldValue("image", e.target.files[0]);
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
              <Center>
                <Button
                  colorScheme={"black"}
                  variant={"solid"}
                  w="350px"
                  color="black"
                  _hover={{
                    bg: "white",
                    color: "black",
                  }}
                  type="submit"
                  onClick={formik.handleSubmit}
                  isDisabled={enable ? true : null}
                >
                  Upload Payment
                </Button>
              </Center>
            </Stack>
          </FormControl>
        </Flex>
      </Center>
    </>
  );
}
