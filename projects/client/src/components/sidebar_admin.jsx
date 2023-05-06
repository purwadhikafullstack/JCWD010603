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
import { useDispatch } from "react-redux";
import user_types from "../redux/auth/types";

export default function SidebarAdmin() {
  let dispatch = useDispatch();
  const toast = useToast();

  const linkStyles = {
    fontSize: "2xl",
    pl: 4,
    userSelect: "none",
    _hover: {
      backdropFilter: "blur(10px) saturate(100%)",
      bgColor: "rgba(255, 255, 255, 0.05)",
      transform: "scale(1.05)",
      transition: "1ms all",
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
    window.location.reload(true);
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
            href="/dashboard"
            display="flex"
            alignItems="center"
            className="sidebar-link"
          >
            <FaChalkboardTeacher />
            <Text sx={spacing} className="sidebar-text">
              Dashboard
            </Text>
          </Link>
          <Link
            href="/list-product"
            sx={linkStyles}
            display="flex"
            alignItems="center"
            className="sidebar-link"
          >
            <FaBoxes />
            <Text sx={spacing} className="sidebar-text">
              Products
            </Text>
          </Link>
          <Link
            sx={linkStyles}
            href="/admin_category"
            display="flex"
            alignItems="center"
            className="sidebar-link"
          >
            <FaFolder />
            <Text sx={spacing} className="sidebar-text">
              Categories
            </Text>
          </Link>
          <Link
            sx={linkStyles}
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
            href="/sales_report"
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
            href="/discount_voucher"
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
            href="/admin_setting"
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
