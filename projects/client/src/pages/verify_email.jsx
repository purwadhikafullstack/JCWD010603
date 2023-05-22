import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import {
  Center,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from "@chakra-ui/react";

export default function VerifyEmail() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState();

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

  // next step axios to backend to verify token and get response
  const verify = () => {
    return axiosInstance
      .get(`/api/user/verify/${token}`)
      .then((result) => {
        if (result.status === 201) setStatus(true);
        setMsg(result.data.message);
      })
      .catch((error) => {
        if (error.response.status === 401) setStatus(false);
        setMsg(error.response.data.message);
      });
  };
  // console.log(status)
  // console.log(msg)

  useEffect(() => {
    document.title = 'KOPIO | Email Verify'
    verify();
  }, []);

  return (
    <>
      {status ? (
        <Center flex={1} align={"center"} justifyContent={"center"}>
          <Center
            //   paddingY={"25px"}
            spacing={4}
            maxW={"md"}
            bgColor="#2C3639"
            w="430px"
            h="932px"
            color="white"
            flexDir="column"
            gap={8}
          >
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="inherit"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                {msg}
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Thanks for verify your email accout. Now you have access for
                transactions
              </AlertDescription>
            </Alert>
          </Center>
        </Center>
      ) : (
        <Center flex={1} align={"center"} justifyContent={"center"}>
          <Center
            //   paddingY={"25px"}
            spacing={4}
            maxW={"md"}
            bgColor="#2C3639"
            w="430px"
            h="932px"
            color="white"
            flexDir="column"
            gap={8}
          >
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="inherit"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Failed Verify User!
              </AlertTitle>
              <AlertDescription maxWidth="sm">{msg}</AlertDescription>
            </Alert>
          </Center>
        </Center>
      )}
    </>
  );
}
