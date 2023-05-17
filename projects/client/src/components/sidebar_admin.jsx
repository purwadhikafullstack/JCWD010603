import { Flex, Image, Center, Link, Text, useToast } from "@chakra-ui/react";
import Logo from "../asset/logo.png";
import LogoSM from "../asset/coffee.png";
import {
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaBoxes,
  FaRegCreditCard,
  FaChartLine,
  FaCashRegister,
  FaCog,
  FaFolder,
} from "react-icons/fa";
import {AiOutlineHistory} from "react-icons/ai";
import { useDispatch } from "react-redux";
import user_types from "../redux/auth/types";

import { useNavigate } from "react-router-dom";
import { Link as ReachLink } from "react-router-dom";
export default function SidebarAdmin() {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  const toast = useToast();
  const superAdmin = JSON.parse(localStorage.getItem("data"))
  ? JSON.parse(localStorage.getItem("data")).isSuperAdmin
  : null;

  const linkStyles = {
    fontSize: "2xl",
    pl: 4,
    userSelect: "none",
    _hover: {
      backdropFilter: "blur(10px) saturate(100%)",
      bgColor: "rgba(255, 255, 255, 0.05)",
      transform: "scale(1.05)",
      transition: "1ms all",
      color: "white",
    },
    _active: {
      transform: "scale(1.04)",
      transition: "1ms all",
      backdropFilter: "blur(20px) saturate(150%)",
      bgColor: "rgba(255, 255, 255, 0.05)",
    },
  };
  const spacing = {
    ml: "1.2em",
  };

  function logOut() {
    dispatch({
      type: user_types.USER_LOGOUT,
    });
    localStorage.clear();
    // window.location.reload(true);
    navigate('/admin_login')

  }
  const userData = JSON.parse(localStorage.getItem("data"));

  return (
    <>
      <Flex
        h="100vh"
        direction="column"
        justify="space-between"
        bg="#2C3639"
        boxShadow="rgba(0,0,0,0.56) 4px 0px 19px -2px"
        className="sidebar"
      >
        <Flex direction="column" w="80%" color="white" m="0 auto">
          <Center w="80%" h="150px" m="0 auto">
            <Image src={Logo} h="auto" className="sidebar-text" />
            <Image src={LogoSM} h="auto" className="small-logo" />
          </Center>

          <Link
            sx={linkStyles}
            to="/dashboard"
            as={ReachLink}
            display="flex"
            alignItems="center"
            className="sidebar-link"
          >
            <FaChalkboardTeacher />
            <Text sx={spacing} className="sidebar-text">
              Dashboard
            </Text>
          </Link>

          {superAdmin === 0 ?
          <Link
            to="/list-product"
            as={ReachLink}
            sx={linkStyles}
            display="flex"
            alignItems="center"
            className="sidebar-link"
            onClick={() => {
              if (!userData || userData.isSuperAdmin) {
                toast({
                  title: "Unauthorized",
                  description: "You are not authorized to access this page.",
                  status: "warning",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          >
            <FaBoxes />
            <Text sx={spacing} className="sidebar-text">
              Products
            </Text>
          </Link>
          : null
          }
          {
            superAdmin === 1 ? 
          <Link
            sx={linkStyles}
            display="flex"
            alignItems="center"
            className="sidebar-link"
            to="/admin_category"
            as={ReachLink}
            onClick={() => {
              if (!userData || !userData.isSuperAdmin) {
                toast({
                  title: "Unauthorized",
                  description: "You are not authorized to access this page.",
                  status: "warning",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          >
            <FaFolder />
            <Text sx={spacing} className="sidebar-text">
              Categories
            </Text>
          </Link>
          : null
          }

          {
            superAdmin === 0 ? 
            <Link
            sx={linkStyles}
            to="/record-stock"
            as={ReachLink}
            display="flex"
            alignItems="center"
            className="sidebar-link"
            onClick={() => {
              if (!userData || userData.isSuperAdmin) {
                toast({
                  title: "Unauthorized",
                  description: "You are not authorized to access this page.",
                  status: "warning",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          >
            <AiOutlineHistory />
            <Text sx={spacing} className="sidebar-text">
              Record Stock
            </Text>
          </Link>
          :
          null
          }

          


          <Link
            sx={linkStyles}
            to="/all-branch-transactions"
            as={ReachLink}
            display="flex"
            alignItems="center"
            className="sidebar-link"
          >
            <FaRegCreditCard />
            <Text sx={spacing} className="sidebar-text">
              Transaction
            </Text>
          </Link>
          <Link
            sx={linkStyles}
            to="/sales_report"
            as={ReachLink}
            display="flex"
            alignItems="center"
            className="sidebar-link"
          >
            <FaChartLine />
            <Text sx={spacing} className="sidebar-text">
              Report
            </Text>
          </Link>
          <Link
            sx={linkStyles}
            to="/discount_voucher"
            as={ReachLink}
            display="flex"
            alignItems="center"
            className="sidebar-link"
          >
            <FaCashRegister />
            <Text sx={spacing} className="sidebar-text">
              Discount
            </Text>
          </Link>
          <Link
            sx={linkStyles}
            to="/admin_setting"
            as={ReachLink}
            display="flex"
            alignItems="center"
            className="sidebar-link"
            onClick={() => {
              if (!userData || !userData.isSuperAdmin) {
                toast({
                  title: "Unauthorized",
                  description: "You are not authorized to access this page.",
                  status: "warning",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          >
            <FaCog />
            <Text sx={spacing} className="sidebar-text">
              Setting
            </Text>
          </Link>
        </Flex>

        <Flex color="white" justify="flex-end" pr="6" mb={6} align="center">
          <Link
            fontSize="xl"
            mr={2}
            to="/admin_login"
            as={ReachLink}
            display="flex"
            alignItems="center"
            onClick={logOut}
            className="sidebar-link"
          >
            <Text mr={2} className="sidebar-text">
              Logout
            </Text>
            <FaSignOutAlt />
          </Link>
        </Flex>
      </Flex>
    </>
  );
}
