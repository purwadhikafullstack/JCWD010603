import Confirm from "../components/confirmation_deliver";

import { Stack, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { useLocation } from "react-router-dom";
export default function ConfirmationDeliverPage() {
  const location = useLocation();
  const [transactionData, setTransactionData] = useState([]);
  const [notrans, setnotrans] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function fetchTransactionData() {
    setIsLoading(true);
    const notrans = location.pathname?.split("/")[2];
    console.log(notrans);
    await axiosInstance
      .get("/api/transaction/gettransactionbynotrans/" + notrans)
      .then((res) => {
        setTransactionData(res.data.result);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchTransactionData();
  }, []);
  console.log(transactionData);
  return (
    <>
      {isLoading ? (
        <Center w={"100vw"} h="100vh" alignContent={"center"}>
          <Spinner size={"xl"} thickness="10px" color="blue.500" />
        </Center>
      ) : (
        <>
          <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
            <Confirm data={transactionData} />
          </Stack>{" "}
        </>
      )}
    </>
  );
}
