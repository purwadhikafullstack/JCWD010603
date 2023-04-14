import NewOrder from "../components/neworder";

import { Flex, Stack, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
export default function NewOrderPage() {
  const [cartData, setCartData] = useState([]);
  const [isPrimary, setisPrimary] = useState([]);
  const [pages, setPages] = useState(1);
  const [numOfPage, setNumOfPage] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [voucher, setVoucher] = useState();
  const [isLoading, setIsLoading] = useState(true);
  async function fetchCartData() {
    const userId = localStorage.getItem("userID");
    await axiosInstance.get(`/cart/getcartbyUserId/${userId}`).then((res) => {
      setCartData(res.data.result);
    });
  }
  async function fetchAddressData() {
    const userId = localStorage.getItem("userID");
    await axiosInstance.get(`/address/primaryaddress/${userId}`).then((res) => {
      setisPrimary(res.data.result);
    });
  }
  async function fetchVouchersData() {
    const userId = localStorage.getItem("userID");
    await axiosInstance.get(`/voucher_discount/listvoucher`).then((res) => {
      setVoucher(res.data.result);
    });
  }
  console.log(cartData);
  useEffect(() => {
    fetchCartData();
    fetchAddressData();
    fetchVouchersData();
    setTimeout(() => {
      setIsLoading(false);
      // if (!state) navigate("/");
    }, 1500);
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
            <NewOrder
              data={cartData}
              dataaddress={isPrimary}
              voucher={voucher}
            />
          </Stack>{" "}
        </>
      )}
    </>
  );
}
