import { Flex, Image, Center, Link, Text } from "@chakra-ui/react";
import Logo from "../asset/logo.png";
import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import user_types from "../redux/auth/types";
import { useLocation } from "react-router-dom";

export default function SidebarAdmin() {

    let dispatch = useDispatch();
    function logOut() {
        dispatch({
            type: user_types.USER_LOGOUT,
        });
        localStorage.clear();
        window.location.reload(true);
    }

    return (
        <>
            <Flex h='100vh' w='325px' bg='#2c3639' direction='column' justify='space-between'>

                <Flex direction='column' w='80%' color='white' m='0 auto'>
                    <Center w='80%' h='150px' m='0 auto' mb="4em">
                        <Image src={Logo} h='auto' />
                    </Center>

                    <Link fontSize="2xl" pl={8} borderRadius='lg' userSelect="none"
                        sx={{
                            _hover: {
                                bg: '#DCD7C9',
                                color: '#2c3639',
                                fontWeight: 'bold',
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                            },
                            _active: {
                                transform: "scale(0.95)",
                                transition: "1ms all",
                                bg: "#d9d9d9"
                            }
                        }}
                    >
                        Dashboard
                    </Link>
                    <Link fontSize="2xl" pl={8} borderRadius='lg' userSelect="none"
                        sx={{
                            _hover: {
                                bg: '#DCD7C9',
                                color: '#2c3639',
                                fontWeight: 'bold',
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                            },
                            _active: {
                                transform: "scale(0.95)",
                                transition: "1ms all",
                                bg: "#d9d9d9"
                            }
                        }}
                    >
                        Product
                    </Link>
                    <Link fontSize="2xl" pl={8} borderRadius='lg' userSelect="none"
                        sx={{
                            _hover: {
                                bg: '#DCD7C9',
                                color: '#2c3639',
                                fontWeight: 'bold',
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                            },
                            _active: {
                                transform: "scale(0.95)",
                                transition: "1ms all",
                                bg: "#d9d9d9"
                            }
                        }}
                    >
                        Transaction
                    </Link>
                    <Link fontSize="2xl" pl={8} borderRadius='lg' userSelect="none"
                        sx={{
                            _hover: {
                                bg: '#DCD7C9',
                                color: '#2c3639',
                                fontWeight: 'bold',
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                            },
                            _active: {
                                transform: "scale(0.95)",
                                transition: "1ms all",
                                bg: "#d9d9d9"
                            }
                        }}
                    >
                        Report
                    </Link>
                    <Link fontSize="2xl" pl={8} borderRadius='lg' userSelect="none"
                        sx={{
                            _hover: {
                                bg: '#DCD7C9',
                                color: '#2c3639',
                                fontWeight: 'bold',
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                            },
                            _active: {
                                transform: "scale(0.95)",
                                transition: "1ms all",
                                bg: "#d9d9d9"
                            }
                        }}
                    >
                        Discount
                    </Link>
                    <Link fontSize="2xl" pl={8} borderRadius='lg' userSelect="none"
                        href="/admin_setting"
                        sx={{
                            _hover: {
                                bg: '#DCD7C9',
                                color: '#2c3639',
                                fontWeight: 'bold',
                                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
                            },
                            _active: {
                                transform: "scale(0.95)",
                                transition: "1ms all",
                                bg: "#d9d9d9"
                            }
                        }}
                    >
                        Setting
                    </Link>
                </Flex>

                <Flex color='white' justify='flex-end' pr="6" mb={6} align='center'>
                    <Link fontSize="xl" mr={2} display='flex' alignItems='center' onClick={logOut}>
                        <Text mr={2}>
                            Logout
                        </Text>
                        <FaSignOutAlt />
                    </Link>
                </Flex>
            </Flex>
        </>
    );
}