import SidebarAdmin from "../components/sidebar_admin";
import { Flex, Center, Spinner, Box, Select, option } from "@chakra-ui/react";
import Chart from "../components/chart";
import { axiosInstance } from "../config/config";
import { useEffect, useState } from "react";
export default function Dashboard() {
  async function fetchDataProduct() {
    await axiosInstance.get("/product/product-all").then((res) => {
      setDataProductAll(res.data.result);
    });
  }
  useEffect(() => {
    fetchDataProduct();
  }, []);
  const [dataBranch, setDataBranch] = useState();
  const [dataProductAll, setDataProductAll] = useState(0);
  const [dataCountProduct, setdataCountProduct] = useState(dataProductAll);
  const [dataAdmin, setDataAdmin] = useState(0);
  const [dataStock, setDataStock] = useState(0);
  const [dataIncome, setDataIncome] = useState([]);
  const [datachartline, setDatachartline] = useState([]);
  const [datachartbar, setDatachartbar] = useState([]);
  const [dataTransaction, setDataTransaction] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [idBranch, setIdBranch] = useState(1);

  async function fetchDataBranch() {
    await axiosInstance.get("/api/admin/branches").then((res) => {
      setDataBranch(res.data.result);
    });
  }

  const fetchDataTransactionHeader = async () => {
    try {
      console.log(idBranch);
      const response = await axiosInstance.get(
        `/api/transaction/transaction-detail/${idBranch}`
      );
      const result = response.data.result;
      setDatachartline(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchDataCountAdmin = async () => {
    try {
      console.log(idBranch);
      const response = await axiosInstance.get(
        `/api/admin/countadmin/${idBranch}`
      );
      const result = response.data.result;
      setDataAdmin(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchDataCountBranch = async () => {
    try {
      console.log(idBranch);
      const response = await axiosInstance.get(
        `/api/product/countproductbybranch/${idBranch}`
      );
      const result = response.data.result;
      setdataCountProduct(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchDataIncomeTransaction = async () => {
    try {
      console.log(idBranch);
      const response = await axiosInstance.get(
        `/api/transaction/getIncomeTransactionByBranch/${idBranch}`
      );
      const result = response.data.result[0];

      setDataIncome(parseInt(result.income));
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchDataStock = async () => {
    try {
      console.log(idBranch);
      const response = await axiosInstance.get(
        `/api/product/totalstockbybranch/${idBranch}`
      );
      const result = response.data.result[0];

      setDataStock(result.stock);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchDataTransaction = async () => {
    try {
      console.log(idBranch);
      const response = await axiosInstance.get(
        `/api/transaction/counttransactionbybranch/${idBranch}`
      );
      const result = response.data.result;

      setDataTransaction(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchDataCountBranch();
    fetchDataCountAdmin();
    fetchDataTransaction();
    fetchDataIncomeTransaction();
    fetchDataStock();
    fetchDataTransactionHeader();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [idBranch]);

  useEffect(() => {
    fetchDataBranch();
    // fetchDataTransactionHeader();
  }, []);
  console.log(dataBranch);
  return (
    <>
      {isLoading ? (
        <Center w={"100vw"} h="100vh" alignContent={"center"}>
          <Spinner size={"xl"} thickness="10px" color="blue.500" />
        </Center>
      ) : (
        <>
          <Flex>
            <SidebarAdmin />
            <Flex>
              <Center flexDir="column" py={10} marginLeft={"80px"}>
                <Flex fontSize={"30px"} fontWeight="bold">
                  Dashboard
                </Flex>
                <Flex w="400px" py={3}>
                  <Select
                    onChange={(e) => {
                      setIdBranch(e.target.value);
                    }}
                  >
                    {dataBranch?.map((branch) => {
                      return <option value={branch.id}>{branch.name}</option>;
                    })}
                  </Select>
                </Flex>
                <Flex
                  w="1200px"
                  gap={5}
                  paddingTop="20px"
                  paddingBottom={"20px"}
                  justifyContent="start"
                  flexDir={"row"}
                  flexWrap="wrap"
                  overflowX={"auto"}
                  overflowY={"auto"}
                  h="full"
                  py={10}
                >
                  <Center
                    w={["149px", "249px", "349px"]}
                    h={["25px", "75px", "125px"]}
                    borderRadius={"10"}
                    borderBottom="10px solid #2C3639"
                    bgColor={"#DCD7C9"}
                    justifyContent="center"
                    fontWeight="bold"
                    py={3}
                    flexDir="column"
                  >
                    {" "}
                    <Flex fontSize={"20px"}>Total Produk </Flex>
                    <Flex fontSize={"40px"}>{dataCountProduct}</Flex>
                  </Center>
                  <Center
                    w={["149px", "249px", "349px"]}
                    h={["25px", "75px", "125px"]}
                    borderRadius={"10"}
                    borderBottom="10px solid #2C3639"
                    bgColor={"#DCD7C9"}
                    justifyContent="center"
                    fontWeight="bold"
                    py={3}
                    flexDir="column"
                  >
                    {" "}
                    <Flex fontSize={"20px"}>Total Admin </Flex>
                    <Flex fontSize={"40px"}>{dataAdmin}</Flex>
                  </Center>
                  <Center
                    w={["149px", "249px", "349px"]}
                    h={["25px", "75px", "125px"]}
                    borderRadius={"10"}
                    borderBottom="10px solid #2C3639"
                    bgColor={"#DCD7C9"}
                    justifyContent="center"
                    fontWeight="bold"
                    py={3}
                    flexDir="column"
                  >
                    {" "}
                    <Flex fontSize={"20px"}>Total Transaction </Flex>
                    <Flex fontSize={"40px"}>{dataTransaction}</Flex>
                  </Center>
                  <Center
                    w={["149px", "249px", "349px"]}
                    h={["25px", "75px", "125px"]}
                    borderRadius={"10"}
                    borderBottom="10px solid #2C3639"
                    bgColor={"#DCD7C9"}
                    justifyContent="center"
                    fontWeight="bold"
                    py={3}
                    flexDir="column"
                  >
                    {" "}
                    <Flex fontSize={"20px"}>Total Income </Flex>
                    <Flex fontSize={"40px"}>
                      Rp. {dataIncome.toLocaleString()}
                    </Flex>
                  </Center>
                  <Center
                    w={["149px", "249px", "349px"]}
                    h={["25px", "75px", "125px"]}
                    borderRadius={"10"}
                    borderBottom="10px solid #2C3639"
                    bgColor={"#DCD7C9"}
                    justifyContent="center"
                    fontWeight="bold"
                    py={3}
                    flexDir="column"
                  >
                    {" "}
                    <Flex fontSize={"20px"}>Total Stock </Flex>
                    <Flex fontSize={"40px"}>{dataStock}</Flex>
                  </Center>
                </Flex>
                <Chart data={datachartline} />
              </Center>
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
}
