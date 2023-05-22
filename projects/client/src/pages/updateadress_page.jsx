import Adress from "../components/address_update";
import { Stack, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function UpdateAdressPage() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const userSelector = useSelector((state) => state.auth);
  const [utama, setUtama] = useState([]);
  const [idAddress, setidAddress] = useState(0);
  const location = useLocation();
  useEffect(() => {
    setidAddress(location.pathname?.split("/")[2]);
  }, []);
  async function fetchData() {
    setIsLoading(true);
    await axiosInstance
      .get("/api/address/editdetailaddress/" + idAddress)
      .then((res) => {
        setData(res.data.result[0]);
        console.log(res.data.result[0]);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    document.title = "KOPIO | Address Update";
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Center w={"100vw"} h="100vh" alignContent={"center"}>
          <Spinner size={"xl"} thickness="10px" color="blue.500" />
        </Center>
      ) : (
        <>
          <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
            <Adress
              user={userSelector}
              utama={[...utama]}
              setUtama={setUtama}
              data={data}
            />
          </Stack>
        </>
      )}
    </>
  );
}
