import Sidebar from "../components/sidebar_admin";

import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { Center, Spinner } from "@chakra-ui/react";
import Products from "../components/productuser";

import NavBar from "../components/navbarhome"; //not loggedin
import Navbar from "../components/navbar"; //loggedin
export default function PageProducts() {
  const [data, setData] = useState();
  const [datacat, setDataCat] = useState();
  const [dataBranch, setDataBranch] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState("ASC");
  const [idBranch, setIdBranch] = useState(localStorage.getItem("branchID"));
  const [sortby, setSortBy] = useState("name");
  const [categories1, setCategories1] = useState([]);
  const [page, setPage] = useState(0);
  const [branchProduct, setbranchProduct] = useState([]);

  async function fetchData() {
    await axiosInstance.get("/api/product/productall").then((res) => {
      setData(res.data.result);
    });
  }
  async function fetchDataCat() {
    await axiosInstance.get("/api/product/category").then((res) => {
      setDataCat(res.data.result);
    });
  }
  async function fetchDataBranch() {
    await axiosInstance.get("/api/admin/branches").then((res) => {
      setDataBranch(res.data.result);
    });
  }
  const fetchProductBranch = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/product/productbybranch/${idBranch}`
      );
      const result = response.data.result;
      setbranchProduct(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchFinPro = async (search) => {
    let url = "";

    url += `name=${search}&branch=${idBranch}`;

    await axiosInstance.get("/api/product/finduser?" + url).then((res) => {
      setbranchProduct(res.data.result);
    });
  };

  const fetchFilPro = async () => {
    let url = "filter[category]=";
    categories1.map((val, idx) => {
      idx ? (url += `,${val}`) : (url += `${val}`);
    });

    url += `&order=${sort}&sort=${sortby}&BranchId=${idBranch}`;

    await axiosInstance.get("/api/product/filter-user?" + url).then((res) => {
      setbranchProduct(res.data.result);
    });
  };
  useEffect(() => {
    fetchProductBranch();
  }, [idBranch]);
  useEffect(() => {
    document.title = 'KOPIO | Product'
    // fetchPosts();
    fetchData();
    fetchDataCat();
    fetchDataBranch();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  useEffect(() => {}, [categories1]);
  return (
    <>
      {isLoading ? (
        <Center w={"100vw"} h="100vh" alignContent={"center"}>
          <Spinner size={"xl"} thickness="10px" color="blue.500" />
        </Center>
      ) : (
        <>
          {localStorage.getItem("userID") ? <Navbar /> : <NavBar />}

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
