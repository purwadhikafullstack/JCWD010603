import NewOrder from "../components/neworder";

import { Stack, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { useSelector } from "react-redux";
export default function NewOrderPage() {
  const [cartData, setCartData] = useState([]);
  const [isPrimary, setisPrimary] = useState([]);
  const [listAddress, setListAddress] = useState();
  const [voucher, setVoucher] = useState();
  const userSelector = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  async function fetchCartData() {
    setIsLoading(true);
    const userId = localStorage.getItem("userID");
    await axiosInstance

      .get(`/api/cart/getcartbyUserId/${userId}`)
      .then((res) => {
        setCartData(res.data.result);
      })
      .finally(() => setIsLoading(false));
  }
  async function fetchAddressData() {
    setIsLoading(true);
    const userId = localStorage.getItem("userID");
    await axiosInstance
      .get(`/api/address/primaryaddress/${userId}`)
      .then((res) => {
        setisPrimary(res.data.result);
      })
      .finally(() => setIsLoading(false));
  }

  async function fetchListData() {
    setIsLoading(true);
    const userId = localStorage.getItem("userID");
    await axiosInstance
      .get(`/api/address/listaddress/ ${userId}`)
      .then((res) => {
        setListAddress(res.data.result);
      })
      .finally(() => setIsLoading(false));
  }
  async function fetchVouchersData() {
    setIsLoading(true);
    const BranchId = localStorage.getItem("branchID");
    await axiosInstance
      .get(
        `/api/voucher_discount/listvouchertransaction?BranchId=${BranchId}`
      )
      .then((res) => {
        setVoucher(res.data.result);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchCartData();
    fetchAddressData();
    fetchVouchersData();
    fetchListData();
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
              datalist={listAddress}
              dataaddress={isPrimary}
              voucher={voucher}
            />
          </Stack>{" "}
        </>
      )}
    </>
  );
}
