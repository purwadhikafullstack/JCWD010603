import NavBar from "../components/navbar";
import Banner from "../components/banner";
import { Flex, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";

export default function UserPage() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // fetchPosts();

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  return (
    <>
      {isLoading ? (
        <Center w={"100vw"} h="100vh" alignContent={"center"}>
          <Spinner size={"xl"} thickness="10px" color="blue.500" />
        </Center>
      ) : (
        <>
          <NavBar />
          <Banner />
        </>
      )}
    </>
  );
}
