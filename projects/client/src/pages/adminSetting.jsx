import {
  Flex,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  FormControl,
  Select,
  FormLabel,
  Input,
  InputGroup,
  FormHelperText,
  Stack,
  Button,
  Heading,
  Text,
  Icon,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  getToken,
} from "@chakra-ui/react";
import React from "react";
import {
  FaUserFriends,
  FaWarehouse,
  FaHouseUser,
  FaCodeBranch,
  FaUserSlash,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";
import { axiosInstance } from "../config/config";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { useFormik } from "formik";
import SidebarAdmin from "../components/sidebar_admin";
import { useEffect, useState } from "react";
import "../style/admin.css";

export default function AdminSetting() {
  YupPassword(Yup);
  const [enable, setEnable] = useState(false);
  const [branchenable, setBranchEnable] = useState(false);
  const [status, setStatus] = useState("");
  const [msg, setMsg] = useState("");
  const [branchstatus, setBranchStatus] = useState("");
  const [branchmsg, setBranchMsg] = useState("");
  const [data, setData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [adminToDeleteId, setAdminToDeleteId] = useState(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [branchToDeleteId, setBranchToDeleteId] = useState(null);
  const [branchAlertDialogOpen, setBranchAlertDialogOpen] = useState(false);
  const cancelRef = React.useRef();
  const webkit = {
    "::-webkit-scrollbar": {
      height: "0.3em",
      width: "0.3em",
      backgroundColor: "none",
      borderRadius: "10px",
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "gray.200",
      borderRadius: "10px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555555",
      borderRadius: "10px",
    },
  };
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
  const [idProv, setIdProv] = useState(0);
  const fetchProvince = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/api_rajaongkir/province"
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

  const fetchCity = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/api_rajaongkir/city/${idProv}`
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

  function deleteAdmin(id) {
    setAdminToDeleteId(id);
    setIsAlertDialogOpen(true);
  }
  function deleteBranch(id) {
    setBranchToDeleteId(id);
    setBranchAlertDialogOpen(true);
  }

  async function fetchData() {
    await axiosInstance.get("/api/admin/branches").then((res) => {
      setData([...res.data.result]);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchAdmin() {
    await axiosInstance.get("/api/admin/adminlist").then((res) => {
      setAdminData([...res.data.result]);
    });
  }

  useEffect(() => {
    fetchAdmin();
  }, []);

  function handleDeleteConfirmation() {
    axiosInstance
      .delete(`/api/admin/deleteAdmin/${adminToDeleteId}`)
      .then(() => {
        setAdminData((prevState) =>
          prevState.filter((admin) => admin.id !== adminToDeleteId)
        );
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsAlertDialogOpen(false);
      });
  }
  function handleBranchDeleteConfirmation() {
    axiosInstance
      .delete(`/api/admin/deleteBranch/${branchToDeleteId}`)
      .then(() => {
        setData((prevState) =>
          prevState.filter((branch) => branch.id !== branchToDeleteId)
        );
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setBranchAlertDialogOpen(false);
      });
  }

  function handleCancelDelete() {
    setIsAlertDialogOpen(false);
  }
  function handleBranchCancelDelete() {
    setBranchAlertDialogOpen(false);
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      branches: 0,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Please enter a username"),
      email: Yup.string()
        .required("Email is required")
        .email("Please enter a valid email"),
      password: Yup.string().required("Password is required"),
      passwordConfirm: Yup.string()
        .required("Password must match")
        .oneOf([Yup.ref("password"), null], "Password must match"),
      branches: Yup.number().required("Select branches"),
    }),
    onSubmit: async () => {
      const res = await axiosInstance
        .post("/admin/register_branch_admin", formik.values, {
          headers: {
            Authorization:
              "Bearer" + " " + JSON.parse(localStorage.getItem("admintoken")),
          },
        })
        .then((res) => {
          setStatus("success");
          setMsg("New Admin Created");
        })
        .catch((error) => {
          console.log(error);
          setStatus("error");
          setMsg(error.response.data.error);
        })
        .finally(() => {
          fetchAdmin();
        });
    },
  });

  useEffect(() => {
    let { username, email, password, branches } = formik.values;
    if (username && email && password && branches) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [formik.values]);

  const branchformik = useFormik({
    initialValues: {
      name: "",
      district: "",
      city: "",
      province: "",
      postalCode: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Please enter a name for your branch"),
      district: Yup.string().required("Please enter a district"),
      city: Yup.string().required("Please enter a city"),
      province: Yup.string().required("Please enter a province"),
      postalCode: Yup.number().required("Please enter a postal code"),
    }),
    onSubmit: async () => {
      const res = await axiosInstance
        .post("/admin/create_branch", branchformik.values, {
          headers: {
            Authorization:
              "Bearer" + " " + JSON.parse(localStorage.getItem("admintoken")),
          },
        })
        .then((res) => {
          setBranchStatus("success");
          setBranchMsg("Branch Created Succesfully");
        })
        .catch((error) => {
          setBranchStatus("error");
          setBranchMsg(error.response.data.err);
        })
        .finally(() => {
          fetchData();
        });
    },
  });

  useEffect(() => {
    let { name, district, city, province, postalCode } = branchformik.values;
    if (name && district && city && province && postalCode) {
      setBranchEnable(true);
    } else {
      setBranchEnable(false);
    }
  }, [branchformik.values]);

  return (
    <Flex w="100%" bg="gray.100">
      <SidebarAdmin />
      <Flex
        p={3}
        className="admin-setting-container"
        h="100vh"
        m="0 auto"
        overflow="auto"
        sx={webkit}
      >
        <Tabs
          w="100%"
          p={5}
          variant="enclosed"
          bg="white"
          borderRadius={10}
          sx={webkit}
          overflow="auto"
        >
          <TabList>
            <Tab _selected={{ color: "#2c3639", bg: "gray.100" }}>
              <Icon as={FaHouseUser} mr={2} />
              <Text className="sidebar-text">Create Admin</Text>
            </Tab>
            <Tab _selected={{ color: "#2c3639", bg: "gray.100" }}>
              <Icon as={FaCodeBranch} mr={2} />
              <Text className="sidebar-text"> Create Branch</Text>
            </Tab>
            <Tab _selected={{ color: "#2c3639", bg: "gray.100" }}>
              <Icon as={FaUserFriends} mr={2} />
              <Text className="sidebar-text">Admin List</Text>
            </Tab>
            <Tab _selected={{ color: "#2c3639", bg: "gray.100" }}>
              <Icon as={FaWarehouse} mr={2} />
              <Text className="sidebar-text">Branch List</Text>
            </Tab>
          </TabList>
          <TabPanels>
            {/* Admin Creation */}
            <TabPanel>
              <Flex align={"center"} justify={"center"}>
                <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                  <Stack align={"center"}>
                    <Heading
                      fontSize={["lg", "2xl", "4xl"]}
                      textAlign={"center"}
                      color="#2c3639"
                    >
                      Create Admin
                    </Heading>
                    <Text fontSize={["sm", "md", "lg"]} color={"gray.600"}>
                      Setting Up Administrative Access
                    </Text>
                  </Stack>
                  <Box
                    p={["0", "5", "8"]}
                    border="1px solid rgba(255, 255, 255, 0.3)"
                    w={["250px", "300px", "400px"]}
                  >
                    <Stack spacing={4}>
                      <Box>
                        <FormControl id="username">
                          {status === "success" ? (
                            <Alert
                              status="success"
                              zIndex={2}
                              variant="top-accent"
                            >
                              <AlertIcon />
                              {msg}
                            </Alert>
                          ) : status === "error" ? (
                            <Alert
                              status="error"
                              zIndex={2}
                              variant="top-accent"
                            >
                              <AlertIcon />
                              {msg}
                            </Alert>
                          ) : null}
                          <FormLabel>Username</FormLabel>
                          <Input
                            name="username"
                            type="text"
                            onChange={(e) =>
                              formik.setFieldValue("username", e.target.value)
                            }
                            placeholder={"Username"}
                          />
                        </FormControl>
                      </Box>

                      <FormControl id="email">
                        <FormLabel>Email address</FormLabel>
                        <Input
                          name="email"
                          onChange={(e) =>
                            formik.setFieldValue("email", e.target.value)
                          }
                          placeholder={"Email"}
                          type="email"
                        />
                        <FormHelperText w={"268px"} paddingX="1" color={"red"}>
                          {formik.errors.email}
                        </FormHelperText>
                      </FormControl>

                      <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                          <Input
                            type="password"
                            name="password"
                            onChange={(e) =>
                              formik.setFieldValue("password", e.target.value)
                            }
                            placeholder={"Password"}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl id="confirmpassword">
                        <FormLabel>Confirm Password</FormLabel>
                        <InputGroup>
                          <Input
                            type="password"
                            name="password"
                            onChange={(e) =>
                              formik.setFieldValue(
                                "passwordConfirm",
                                e.target.value
                              )
                            }
                            placeholder="Confirm Password"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Branch</FormLabel>
                        <Select
                          placeholder="Select a branch"
                          name="branches"
                          onChange={(e) =>
                            formik.setFieldValue("branches", e.target.value)
                          }
                        >
                          {data?.map((val) => {
                            return (
                              <option value={val.id} key={val.id}>
                                {val.name}
                              </option>
                            );
                          })}
                        </Select>
                        <FormHelperText w={"268px"} color={"red"}>
                          {formik.errors.branches}
                        </FormHelperText>
                      </FormControl>
                      <br />
                      <Stack spacing={10} pt={2}>
                        <Button
                          onClick={formik.handleSubmit}
                          disabled={enable ? null : "disabled"}
                          loadingText="Submitting"
                          size="lg"
                          bg="#2c3639"
                          color="white"
                          _hover={{
                            bg: "#3F4E4F",
                            color: "white",
                          }}
                          _active={{
                            transform: "scale(0.98)",
                            transition: "1ms all",
                          }}
                        >
                          Create
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Flex>
            </TabPanel>
            {/* Setup new Branch */}
            <TabPanel>
              <Flex align={"center"} justify={"center"}>
                <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                  <Stack align={"center"}>
                    <Heading
                      fontSize={["lg", "2xl", "4xl"]}
                      textAlign={"center"}
                      color="#2c3639"
                    >
                      Setup new Branches
                    </Heading>
                    <Text fontSize={["sm", "md", "lg"]} color={"gray.600"}>
                      Expand your business with new branches
                    </Text>
                  </Stack>
                  <Box
                    p={["0", "5", "8"]}
                    border="1px solid rgba(255, 255, 255, 0.3)"
                    w={["250px", "300px", "400px"]}
                  >
                    <Stack spacing={4}>
                      <Box>
                        <FormControl id="branchname">
                          {branchstatus === "success" ? (
                            <Alert
                              status="success"
                              zIndex={2}
                              variant="top-accent"
                            >
                              <AlertIcon />
                              {branchmsg}
                            </Alert>
                          ) : branchstatus === "error" ? (
                            <Alert
                              status="error"
                              zIndex={2}
                              variant="top-accent"
                            >
                              <AlertIcon />
                              {branchmsg}
                            </Alert>
                          ) : null}
                          <FormLabel>Branch Name</FormLabel>
                          <Input
                            name="branchname"
                            type="text"
                            onChange={(e) =>
                              branchformik.setFieldValue("name", e.target.value)
                            }
                            placeholder={"Set a Branch Name"}
                          />
                        </FormControl>
                      </Box>

                      <FormControl id="province">
                        <FormLabel>Province</FormLabel>

                        <Select
                          placeholder="-"
                          name="province"
                          onChange={(e) => {
                            const selectedProvince = province.find(
                              (val) => val.province === e.target.value
                            );
                            branchformik.setFieldValue(
                              "province",
                              selectedProvince.province
                            );
                            handleId(selectedProvince.province_id);
                          }}
                        >
                          {province?.map((val) => {
                            return (
                              <option
                                key={val.province_id}
                                value={val.province}
                              >
                                {val.province}
                              </option>
                            );
                          })}
                        </Select>
                      </FormControl>

                      <FormControl id="city">
                        <FormLabel>City</FormLabel>
                        {/* <InputGroup>
                                                    <Input type='text' name="city" onChange={(e) => branchformik.setFieldValue('city', e.target.value)} placeholder={'City'} />
                                                </InputGroup> */}
                        <Select
                          placeholder="-"
                          name="city"
                          onChange={(e) =>
                            branchformik.setFieldValue("city", e.target.value)
                          }
                        >
                          {city?.map((val) => {
                            return (
                              <option value={val.city_name}>
                                {val.city_name}
                              </option>
                            );
                          })}
                        </Select>
                      </FormControl>

                      <FormControl id="district">
                        <FormLabel>District</FormLabel>
                        <Input
                          name="district"
                          onChange={(e) =>
                            branchformik.setFieldValue(
                              "district",
                              e.target.value
                            )
                          }
                          placeholder={"District"}
                          type="text"
                        />
                      </FormControl>

                      <FormControl id="postalCode">
                        <FormLabel>Postal Code</FormLabel>
                        <InputGroup>
                          <Input
                            type="text"
                            name="postalCode"
                            onChange={(e) =>
                              branchformik.setFieldValue(
                                "postalCode",
                                e.target.value
                              )
                            }
                            placeholder="Postal Code"
                          />
                        </InputGroup>
                      </FormControl>
                      <br />
                      <Stack spacing={10} pt={2}>
                        <Button
                          onClick={branchformik.handleSubmit}
                          disabled={branchenable ? null : "disabled"}
                          loadingText="Submitting"
                          size="lg"
                          bg="#2c3639"
                          color="white"
                          _hover={{
                            bg: "#3F4E4F",
                            color: "white",
                          }}
                          _active={{
                            transform: "scale(0.98)",
                            transition: "1ms all",
                          }}
                        >
                          Add new branch
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Flex>
            </TabPanel>
            {/* Admin List */}
            <TabPanel>
              <Flex
                h="85vh"
                overflow="auto"
                justify="flex-start"
                direction="column"
                sx={webkit}
              >
                {adminData?.map((val) => {
                  return (
                    <Flex
                      borderBottom="1px solid black"
                      p={3}
                      align="center"
                      justify="space-between"
                      w="100%"
                      h="100px"
                      bg={val.isSuperAdmin ? "gray.100" : "null"}
                    >
                      <Stack>
                        <Heading fontSize={["md", "lg", "xl", "2xl"]}>
                          {val.username}
                        </Heading>
                        <Text fontSize={["sm", "md"]}>
                          {val.isSuperAdmin ? "Super Admin" : "Admin"}
                        </Text>
                      </Stack>
                      <Flex w="50%" justify="space-between">
                        <Text fontSize={["sm", "md"]}>{val.Branch.city}</Text>

                        <IconButton
                          as={FaUserSlash}
                          mr={2}
                          bg="none"
                          size="sm"
                          color={"#A84448"}
                          p={1}
                          borderRadius="full"
                          onClick={() => deleteAdmin(val.id)}
                          sx={{
                            _hover: {
                              transform: "scale(0.98)",
                              bg: "#A84448",
                              color: "#F6E1C3",
                              cursor: "pointer",
                            },
                            _active: {
                              bg: "#6b2a2c",
                              color: "#F7F1E5",
                              transform: "scale(0.95)",
                            },
                          }}
                        />
                      </Flex>
                    </Flex>
                  );
                })}
                <AlertDialog
                  motionPreset="slideInBottom"
                  isOpen={isAlertDialogOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={handleCancelDelete}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader
                        fontSize="lg"
                        fontWeight="bold"
                        textAlign="center"
                      >
                        Delete Admin
                      </AlertDialogHeader>

                      <AlertDialogBody textAlign="center">
                        Are you sure you want to delete this admin?
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={handleCancelDelete}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={handleDeleteConfirmation}
                          ml={3}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Flex>
            </TabPanel>
            {/* Branch List */}
            <TabPanel>
              <Flex
                h="85vh"
                overflow="auto"
                justify="flex-start"
                direction="column"
                sx={{
                  "::-webkit-scrollbar": {
                    height: "0.3em",
                    width: "0.3em",
                    backgroundColor: "none",
                    borderRadius: "10px",
                  },
                  "::-webkit-scrollbar-thumb": {
                    backgroundColor: "gray.200",
                    borderRadius: "10px",
                  },
                  "::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555555",
                    borderRadius: "10px",
                  },
                }}
              >
                {data?.map((val) => {
                  return (
                    <Flex
                      borderBottom="1px solid black"
                      p={3}
                      align="center"
                      justify="space-between"
                      w="100%"
                      h="100px"
                    >
                      <Stack>
                        <Heading fontSize={["md", "lg", "xl", "2xl"]}>
                          {val.city}
                        </Heading>
                        <Text fontSize={["sm", "md"]}>{val.province}</Text>
                      </Stack>
                      <Flex w="50%" justify="space-between">
                        <Text fontSize={["sm", "md"]}>{val.district}</Text>

                        <IconButton
                          as={FaTimesCircle}
                          mr={2}
                          bg="none"
                          size="sm"
                          color={"#A84448"}
                          p={1}
                          borderRadius="full"
                          onClick={() => deleteBranch(val.id)}
                          sx={{
                            _hover: {
                              transform: "scale(0.98)",
                              bg: "#A84448",
                              color: "#F6E1C3",
                              cursor: "pointer",
                            },
                            _active: {
                              bg: "#6b2a2c",
                              color: "#F7F1E5",
                              transform: "scale(0.95)",
                            },
                          }}
                        />
                      </Flex>
                    </Flex>
                  );
                })}
                <AlertDialog
                  motionPreset="slideInBottom"
                  isOpen={branchAlertDialogOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={handleBranchCancelDelete}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader
                        fontSize="lg"
                        fontWeight="bold"
                        textAlign="center"
                      >
                        Delete Branch
                      </AlertDialogHeader>

                      <AlertDialogBody textAlign="center">
                        Are you sure you want to delete this branch?
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button
                          ref={cancelRef}
                          onClick={handleBranchCancelDelete}
                        >
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={handleBranchDeleteConfirmation}
                          ml={3}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}
