import AddAddress from "../components/add_address";
import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { useSelector } from "react-redux";

export default function AddAdressPage() {
  const [data, setData] = useState();
  const [utama, setUtama] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userSelector = useSelector((state) => state.auth);
  async function fetchData() {
    await axiosInstance.get("/address/" + userSelector?.id).then((res) => {
      setData(res.data.result);
      console.log(userSelector?.UserId);
    });
  }

  useEffect(() => {
    document.title = 'KOPIO | Address Create'
    fetchData();

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <AddAddress
        user={userSelector}
        data={data}
        utama={[...utama]}
        setUtama={setUtama}
      />
    </Stack>
  );
}
