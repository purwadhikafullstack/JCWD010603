import NavBar from "../components/navbar";
import DetailProduct from "../components/detail_product";
import { Flex, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function DetailProductPage() {
  const navigate = useNavigate();
  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    document.title = 'KOPIO | Product Detail'
    // fetchPosts();

    setTimeout(() => {
      setIsLoading(false);
      // if (!state) navigate("/");
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
          <DetailProduct />
        </>
      )}
    </>
  );
}
