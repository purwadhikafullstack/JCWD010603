import {
  Center,
  Box,
  Heading,
  Text,
  Stack,
  Flex,
  Link,
  Image,
  Highlight,
} from "@chakra-ui/react";
import "../style/admin.css";
import Logo from "../asset/logo.png";
import { Link as ReachLink } from "react-router-dom";
import { useEffect } from "react";
export default function Page404() {
  useEffect(()=> {
    document.title = 'KOPIO | Error 404'
  },[])
  return (
    <>
      <Center
        h="100vh"
        bg="url(https://images.unsplash.com/photo-1533478684236-61e1192879e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80)"
      >
        <Box w={["100%", "90%", "70%", "50%"]} h="60%">
          <Center
            h="100%"
            backdropFilter="blur(7.5px) saturate(100%)"
            bgColor="rgba(0, 0, 0, 0.4)"
            borderRadius="2xl"
            border="1px solid rgba(255, 255, 255, 0.125)"
          >
            <Stack spacing={7} p={10} color="white">
              <Box w="350px" m="0 auto">
                <Image src={Logo} />
              </Box>
              <Heading textAlign="center">
                <Highlight
                  query="PAGE NOT FOUND"
                  styles={{ px: "1", py: "1", bg: "#2c3639", color: "white" }}
                >
                  404 PAGE NOT FOUND
                </Highlight>
              </Heading>
              <Text textAlign="center" fontWeight="bold">
                Oops! the page you were looking for does not exist
              </Text>
              <Flex w="100%" justify="center" pt={4}>
                <Link to="/" as={ReachLink}>
                  <button class="bn-32 bn32">Go back</button>
                </Link>
              </Flex>
            </Stack>
          </Center>
        </Box>
      </Center>
    </>
  );
}
