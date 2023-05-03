import Sidebar from "../components/sidebar_admin";

import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { Flex, Center, Spinner } from "@chakra-ui/react";
import Products from "../components/product";
import SidebarProduct from "../components/sidebar_product";
export default function PageProducts() {
  const [data, setData] = useState();
  const [datacat, setDataCat] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState("ASC");
  const [sortby, setSortBy] = useState("name");
  const [categories1, setCategories1] = useState([]);
  const [page, setPage] = useState(0);

  // async function fetchData(limit) {
  //   if (limit < 0) {
  //     limit = 0;
  //   }

  //   await axiosInstance
  //     .get("/product-all", {
  //       params: {
  //         page: limit,
  //       },
  //     })
  //     .then((res) => {
  //       setData(res.data.result);
  //     });
  // }
  async function fetchData() {
    await axiosInstance.get("/product/productall").then((res) => {
      setData(res.data.result);
    });
  }
  async function fetchDataCat() {
    await axiosInstance.get("/product/category").then((res) => {
      setDataCat(res.data.result);
    });
  }
  const fetchFinPro = async (search) => {
    let url = "";

    url += `name=${search}`;

    console.log(url);

    await axiosInstance.get("/product/find?" + url).then((res) => {
      setData(res.data.result);
    });
  };

  const fetchFilPro = async (callback) => {
    let url = "";
    categories1.map((val, idx) => {
      idx ? (url += `&${val}=${val}`) : (url += `${val}=${val}`);
    });

    url += `&order=${sort}&orderby=${sortby}`;

    console.log(url);

    await axiosInstance.get("/filter?" + url).then((res) => {
      setData(res.data.result);
    });
    callback?.();
  };

  // useEffect(() => {
  //   // fetchPosts();
  //   fetchData();
  //   fetchDataCat();
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 500);
  // }, []);
  console.log(`data nya = ${data}`);
  useEffect(() => {
    // fetchPosts();
    fetchData();
    fetchDataCat();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  useEffect(() => {
    console.log(categories1);
  }, [categories1]);
  return (
    <>
      {isLoading ? (
        <Center w={"100vw"} h="100vh" alignContent={"center"}>
          <Spinner size={"xl"} thickness="10px" color="blue.500" />
        </Center>
      ) : (
        <>
          <Flex flexDir={"row"} pos="fixed" left={"0"}>
            <Sidebar />
            {/* <SidebarProduct
              data={datacat}
              cat={[...categories1]}
              setCat={setCategories1}
              sort={[...sort]}
              sortby={[...sortby]}
              setSort={setSort}
              setSortBy={setSortBy}
              filter={fetchFilPro}
            /> */}
          </Flex>
          <Center marginLeft={["85px", "100px", "150px"]} w="100%">
            <Products
              data={data}
              fin={fetchFinPro}
              cat={[...categories1]}
              fetchData = {fetchData}
              datacat={datacat}
              setCat={setCategories1}
              sort={[...sort]}
              sortby={[...sortby]}
              setSort={setSort}
              setSortBy={setSortBy}
              filter={fetchFilPro}
            // page={page}
            // setPage={setPage}
            // fetchData={fetchData}
            />
          </Center>
        </>
      )}
    </>
  );
}
