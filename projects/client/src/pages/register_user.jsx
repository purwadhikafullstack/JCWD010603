import Register from "../components/register_user";
import { Stack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
export default function RegisterPage() {
  // const [province, setProvince] = useState([]);
  // const [provinces, setProvinces] = useState({
  //   province_id: 0,
  //   province: "",
  // });

  // const fetchProvince = async () => {
  //   await axiosInstance
  //     .get("https://jcwd010603.purwadhikabootcamp.com/api_rajaongkir/province")
  //     .then((res) => {
  //       setProvince([...province, res.data]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // console.log(province);
  // const [data, setData] = useState();
  // const [isLoading, setIsLoading] = useState(true);
  // const userSelector = useSelector((state) => state.auth);

  // useEffect(() => {
  //   fetchProvince();
  // }, []);

  // async function fetchData() {
  //   setIsLoading(true);
  //   axiosInstance
  //     .get("/province")
  //     .then((res) => {
  //       setData(res.data.result);
  //     })
  //     .finally(() => setIsLoading(false));
  // }

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
      marginY={"0"}
    >
    {/* data={data} */}
      <Register  />
    </Stack>
  );
}
