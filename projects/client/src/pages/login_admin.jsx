import {
    Flex, Image, Box, Center, FormControl, FormLabel,
    Input, Stack, Button, Text,
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { adminLogin } from "../redux/middleware/adminauth";

import Logo from "../asset/logo.png";

export default function LoginAdmin() {
    let dispatch = useDispatch();
    let navigate = useNavigate();

    const [status, setStatus] = useState(false);

    async function Login() {
        const isAuth = await dispatch(
            adminLogin({
                email,
                password,
            })
        );
        if (isAuth.status) {
            if (isAuth.data.isSuperAdmin) {
                return navigate('/admin', { state: { admin: isAuth.data }, replace: true });
            }
            return navigate('/login', { state: { admin: isAuth.data }, replace: true });
        }
        return setStatus(true);
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const validateEmail = (event) => {
        let email = event.target.value;
        if (!validator.isEmail(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
            setEmail(event.target.value);
        }
    };

    return (
        <>
            <Center h='100vh' bg='#DCD7C9'>
                <Flex m='0 auto' borderRadius='20' overflow='hidden' boxShadow="rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset">
                    <Box>
                        <Image src="https://images.unsplash.com/photo-1606791405792-1004f1718d0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" />
                    </Box>

                    <Flex
                        align={'center'}
                        justify={'center'}
                        bg="#2c3639"
                    >
                        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={12}>
                            <Center w='200px' m='0 auto'>
                                <Image src={Logo} h='auto' objectFit='fill'/>
                            </Center>
                            <Stack align={'center'} px='8'>
                                <Text fontSize={'lg'} color="white">
                                    Login as an administrator
                                </Text>
                            </Stack>
                            <Box
                                rounded={'lg'}
                            >
                                <Stack spacing={2}>
                                    <FormControl id="email">
                                        <FormLabel color='white' >Email</FormLabel>
                                        <Input type="email" bg="white" placeholder="Email" onChange={(e) => validateEmail(e)} />
                                    </FormControl>
                                    <span
                                        style={{
                                            fontWeight: 'bold',
                                            color: 'red',
                                        }}
                                    >
                                        {emailError}
                                    </span>

                                    <FormControl id="password">
                                        <FormLabel color='white'>Password</FormLabel>
                                        <Input type="password" bg='white' placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                                    </FormControl>
                                </Stack>
                            </Box>

                            <Button
                                bg='#DCD7C9'
                                color='#2C3639'
                                _hover={{
                                    bg: '#a8a396',
                                    color: 'WHITE'
                                }}
                                _active={{
                                    transform: 'scale(0.98)',
                                    transition: '1ms all'
                                }}
                                onClick={Login}
                            >
                                Sign in
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>
            </Center>
        </>
    );
}