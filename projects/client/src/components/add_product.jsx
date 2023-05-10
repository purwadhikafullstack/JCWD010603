import {
  Button,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  FormHelperText,
  ModalContent,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function InitialFocus() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  // const finalRef = React.useRef(null)

  const [cat, setCat] = useState([
    {
      id: 0,
      name: "",
    },
  ]);

  const fetchCategory = async () => {
    const response = await axiosInstance("/api/admin/categories");
    const result = response.data.result;
    // console.log(result)
    setCat(result);
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "image/gif",
  ];

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      imgProduct: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name must be filled"),
      imgProduct: Yup.mixed()
        .nullable()
        .required("Image product must be a filled")
        .test(
          "type",
          "Invalid file format selection",
          (value) =>
            // console.log(value);
            !value || (value && SUPPORTED_FORMATS.includes(value?.type))
        )
        .test(
          "size",
          "File size is too big",
          (value) => value && value.size <= 1000 * 1000 // 1MB
        ),
    }),
    onSubmit: async () => {
      try {
        console.log(formik.values);
        //   await axiosInstance.post("/user/register", formik.values)
        //   handleSuccess()
      } catch (err) {
        //   setMsg(err.response.data.errors[0].msg);
        //   handleError()
      }
    },
  });

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Products</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl id="name">
              <FormLabel>Product Name</FormLabel>
              <Input
                type="text"
                name="name"
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.name}
              </FormHelperText>
            </FormControl>
            <FormControl id="price">
              <FormLabel>Product Price</FormLabel>
              <Input
                type="text"
                name="price"
                onChange={(e) => formik.setFieldValue("price", e.target.value)}
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.price}
              </FormHelperText>
            </FormControl>
            <FormControl id="category">
              <FormLabel>Product Category</FormLabel>
              <Select
                name="category"
                placeholder="Select"
                onChange={(e) =>
                  formik.setFieldValue("category", e.target.value)
                }
              >
                {cat.map((c) => {
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
                {formik.errors.category}
              </FormHelperText>
            </FormControl>

            <FormControl id="imgProduct">
              <FormLabel>Product Image</FormLabel>
              <Input
                paddingTop="4px"
                type="file"
                name="imgProduct"
                onChange={(e) =>
                  formik.setFieldValue("imgProduct", e.target.value)
                }
              />
              <FormHelperText
                w={"inherit"}
                marginTop={"5px"}
                color={"red.500"}
                fontSize={"9px"}
              >
                {formik.errors.imgProduct}
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={formik.handleSubmit}>
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

//   validationSchema: Yup.object().shape({
//     price: Yup.number("Price should be a number"),

//   <Input
//   id=""
//   type="file"
//   accept="image/*"
//   onChange={(e) => {
//     handleFile(e);
//     formik.setFieldValue("avatar", e.target.files[0]);
//   }}
//   w="full"
//   placeholder="Image URL"
//   display="none"
//   ref={inputFileRef}
//   name={imgUser}
// ></Input>
