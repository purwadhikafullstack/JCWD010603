import {
  Flex,
  Button,
  Stack,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Heading,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SidebarAdmin from "../components/sidebar_admin";
import { axiosInstance } from "../config/config";
import { FiEdit3, FiX } from "react-icons/fi";
import React from "react";

export default function AdminCategory() {
  const { isOpen, onOpen, onClose } = useDisclosure(); //UNTUK MODAL CREATE CATEGORY
  const [category, setCategory] = useState(""); //UNTUK INPUT E.TARGET.VALUE CREATE CATEGORY
  const [dataCat, setDataCat] = useState([]); //VARIABEL UNTUK FETCH-DATA CATEGORY
  const [categoryId, setCategoryId] = useState(null); //HANDLE DELETE ID CATEGORY
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false); //HANDLE DIALOG DELETE CATEGORY
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editInput, setEditInput] = useState("");
  const cancelRef = React.useRef();
  const toast = useToast();

  const webkit = {
    "::-webkit-scrollbar": {
      height: "0.3em",
      width: "0.3em",
      backgroundColor: "none",
      borderRadius: "10px",
    },
    "::-webkit-scrollbar-thumb": {
      // backgroundColor: '#181D31',
      backgroundColor: "gray.200",
      borderRadius: "10px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555555",
      borderRadius: "10px",
    },
  };

  // handle delete feature
  function deleteCategory(id) {
    setCategoryId(id);
    setOpenCategoryDialog(true);
  }
  function handleCategoryCancelDelete() {
    setOpenCategoryDialog(false);
  }
  async function categoryConfirmDelete() {
    await axiosInstance
      .delete(`/api/admin/delete_category/${categoryId}`)
      .then(() => {
        fetchCategory();
      })
      .finally(() => {
        setOpenCategoryDialog(false);
      });
  }
  // handle delete feature

  // handle edit feature
  function editCategory(id) {
    setEditCategoryId(id);
    setEditDialog(true);
  }
  function handleCloseEditDialog() {
    setEditDialog(false);
  }
  async function confirmEditCategory() {
    const data = {
      name: editInput,
    };
    await axiosInstance
      .patch(`/api/admin/update_category/${editCategoryId}`, data)
      .then(() => {
        fetchCategory();
      })
      .finally(() => {
        setEditDialog(false);
        setEditInput("");
      });
  }
  function handleEditInput(e) {
    setEditInput(e.target.value);
  }
  // handle edit feature

  function pressEnter(e) {
    if (e.key === "Enter") {
      createCategory();
      fetchCategory();
    }
  }

  async function createCategory() {
    const data = {
      name: category,
    };

    await axiosInstance
      .post("/api/admin/create_category", data)
      .then(() => {
        toast({
          title: "New category added",
          description: "Successfully added a new category",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
        fetchCategory();
      })
      .finally(() => {
        setCategory("");
      });
  }

  async function fetchCategory() {
    await axiosInstance.get("/api/admin/categories").then((res) => {
      setDataCat([...res.data.result]);
    });
  }

  useEffect(() => {
    document.title = 'KOPIO | Categories'
    fetchCategory();
  }, []);

  return (
    <>
      <Flex w="100%" bg="gray.100">
        <SidebarAdmin />

        <Flex h="100vh" w="80%" direction="column" p={[2, 4, 8, 10]}>
          <Center w="100%" h="100%">
            <Flex
              w={["100%", "100%", "70%", "50%"]}
              h="100%"
              overflow="auto"
              sx={webkit}
              bg="white"
              borderRadius={10}
            >
              <Stack w={"80%"} m="0 auto" spacing={3} py={4}>
                <Heading
                  mt={3}
                  color="#2C3639"
                  textAlign="center"
                  fontSize={["lg", "xl", "2xl", "3xl"]}
                >
                  Product Categories
                </Heading>
                <Flex
                  h="85%"
                  w="100%"
                  overflow="auto"
                  sx={webkit}
                  direction="column"
                  color="#2C3639"
                  borderBottom="4px solid #2C3639"
                  borderTop="4px solid #2C3639"
                >
                  {dataCat?.map((val, idx) => {
                    return (
                      <Flex
                        w="100%"
                        p="3px 2px 2px 20px"
                        borderBottom="1px solid #2C3639"
                        justify={"space-between"}
                        _hover={{
                          backgroundColor: "gray.200",
                        }}
                      >
                        <Center>
                          <Heading fontSize={["md", "lg", "xl", "2xl"]}>
                            {idx + 1 + ". " + val.name}
                          </Heading>
                        </Center>

                        <Flex w="100px" justify="space-around">
                          <Tooltip label="Edit" placement="top-start">
                            <IconButton // edit button
                              icon={<FiEdit3 />}
                              borderRadius="full"
                              _hover={{
                                color: "green",
                                backgroundColor: "none",
                              }}
                              bg="none"
                              onClick={() => editCategory(val.id)}
                            />
                          </Tooltip>

                          <Tooltip label="Delete" placement="top-start">
                            <IconButton //delete button
                              icon={<FiX />}
                              borderRadius="full"
                              bg="none"
                              onClick={() => deleteCategory(val.id)}
                              _hover={{
                                color: "maroon",
                                backgroundColor: "none",
                              }}
                            />
                          </Tooltip>
                        </Flex>
                      </Flex>
                    );
                  })}
                  {/* DELETE DIALOG */}
                  <AlertDialog
                    motionPreset="slideInBottom"
                    isOpen={openCategoryDialog}
                    leastDestructiveRef={cancelRef}
                    onClose={handleCategoryCancelDelete}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader
                          fontSize="lg"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          Delete Category
                        </AlertDialogHeader>

                        <AlertDialogBody textAlign="center">
                          Are you sure you want to delete this category?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button
                            ref={cancelRef}
                            onClick={handleCategoryCancelDelete}
                          >
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={categoryConfirmDelete}
                            ml={3}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                  {/* EDIT DIALOG */}
                  <AlertDialog
                    motionPreset="slideInBottom"
                    isOpen={editDialog}
                    leastDestructiveRef={cancelRef}
                    onClose={handleCloseEditDialog}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader
                          fontSize="lg"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          Update Category
                        </AlertDialogHeader>

                        <AlertDialogBody textAlign="center">
                          <FormControl id="username">
                            <Input
                              name="edit"
                              type="text"
                              placeholder={"Edit category name"}
                              onChange={handleEditInput}
                            />
                          </FormControl>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button
                            ref={cancelRef}
                            onClick={handleCloseEditDialog}
                          >
                            Cancel
                          </Button>
                          <Button
                            colorScheme="green"
                            onClick={confirmEditCategory}
                            ml={3}
                          >
                            Edit
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </Flex>
                <Button
                  alignSelf="end"
                  onClick={onOpen}
                  onClose={onClose}
                  bg="#2C3639"
                  color="white"
                  sx={{
                    _hover: {
                      bg: "#3F4E4F",
                    },
                  }}
                >
                  Create Category
                </Button>
                {/* MODAL CREATE */}
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Create a new category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <FormControl>
                        <Input
                          placeholder="Category name"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          onKeyDown={(e) => pressEnter(e)}
                        />
                      </FormControl>
                    </ModalBody>

                    <ModalFooter>
                      <Button variant="ghost" onClick={createCategory}>
                        Create
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                {/* MODAL UPDATE */}

                {/* MODAL ENDING*/}
              </Stack>
            </Flex>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}
