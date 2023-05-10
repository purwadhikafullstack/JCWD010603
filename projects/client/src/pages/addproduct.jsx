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
  ModalContent,
  Select,
} from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../config/config";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";

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

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Products</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name Product</FormLabel>
              <Input ref={initialRef} placeholder="Name Product" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <Input placeholder="Price" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Category</FormLabel>
              <Select placeholder="Select">
                {cat.map((c) => {
                  console.log(c);
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Image Product</FormLabel>
              <Input
                paddingY={"5px"}
                type={"file"}
                placeholder="Image Product"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
