import Adress from "../components/address_update";
import { Stack } from "@chakra-ui/react";
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
    await axiosInstance
      .get("/api/address/editdetailaddress/" + idAddress)
      .then((res) => {
        setData(res.data.result[0]);
        console.log(res.data.result[0]);
      });
  }

  useEffect(() => {
    document.title = 'KOPIO | Address Update'
    fetchData();

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Adress
        user={userSelector}
        utama={[...utama]}
        setUtama={setUtama}
        data={data}
      />
    </Stack>
  );
}
