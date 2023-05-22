import Update from "../components/profile_update";
import { Stack, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { useSelector } from "react-redux";
export default function UpdateProfilePage() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const userSelector = useSelector((state) => state.auth);

  async function fetchData() {
    setIsLoading(true);
    axiosInstance
      .get("/api/user/" + userSelector?.id)
      .then((res) => {
        setData(res.data.result);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    document.title = "KOPIO | Profile";
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
            <Update user={userSelector} data={data} />
          </Stack>
        </>
      )}
    </>
  );
}
