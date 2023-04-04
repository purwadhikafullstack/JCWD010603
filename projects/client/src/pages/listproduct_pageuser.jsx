import Sidebar from "../components/sidebar_admin";

import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { Flex, Center, Spinner } from "@chakra-ui/react";
import Products from "../components/productuser";
import SidebarProduct from "../components/sidebar_product";
import Navbar from "../components/navbar";
export default function PageProducts() {
  const [data, setData] = useState();
  const [datacat, setDataCat] = useState();
  const [dataBranch, setDataBranch] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState("ASC");
  const [idBranch, setIdBranch] = useState(1);
  const [sortby, setSortBy] = useState("name");
  const [categories1, setCategories1] = useState([]);
  const [page, setPage] = useState(0);
  const [branchProduct, setbranchProduct] = useState([]);

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
  async function fetchDataBranch() {
    await axiosInstance.get("/admin/branches").then((res) => {
      setDataBranch(res.data.result);
    });
  }
  const fetchProductBranch = async () => {
    try {
      console.log(idBranch);
      const response = await axiosInstance.get(
        `/product/productbybranch/${idBranch}`
      );
      const result = response.data.result;
      setbranchProduct(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchFinPro = async (search) => {
    let url = "";

    url += `name=${search}`;

    console.log(url);

    await axiosInstance.get("/product/find?" + url).then((res) => {
      setData(res.data.result);
    });
  };

  const fetchFilPro = async () => {
    let url = "";
    categories1.map((val, idx) => {
      idx ? (url += `&${val}=${val}`) : (url += `${val}=${val}`);
    });

    url += `&order=${sort}&orderby=${sortby}&BranchId=${idBranch}`;

    console.log(url);

    await axiosInstance.get("/filter-user?" + url).then((res) => {
      setbranchProduct(res.data.result);
    });
  };
  useEffect(() => {
    fetchProductBranch();
  }, [idBranch]);
  useEffect(() => {
    // fetchPosts();
    fetchData();
    fetchDataCat();
    fetchDataBranch();
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
          <Navbar />

          <Center>
            <Products
              data={data}
              fin={fetchFinPro}
              cat={[...categories1]}
              datacat={datacat}
              databranch={dataBranch}
              setCat={setCategories1}
              sort={[...sort]}
              branchProduct={branchProduct}
              // idBranch={[...idBranch]}
              setIdBranch={setIdBranch}
              sortby={[...sortby]}
              setSort={setSort}
              setSortBy={setSortBy}
              filter={fetchFilPro}
            />
          </Center>
        </>
      )}
    </>
  );
}
