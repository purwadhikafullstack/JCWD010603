import Sidebar from "../components/sidebar_admin";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { Flex, Center, Spinner } from "@chakra-ui/react";
import Products from "../components/product";
import { useNavigate } from "react-router-dom";

export default function PageProducts() {
  let navigate = useNavigate();
  const [data, setData] = useState();
  const [datacat, setDataCat] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState("ASC");
  const [sortby, setSortBy] = useState("name");
  const [categories1, setCategories1] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [pages, setPages] = useState(10);
  const [rows, setRows] = useState(0);

  function fetchData() {
    axiosInstance
      .get(
        `/api/product/allProductBranch/${
          JSON.parse(localStorage.getItem("data")).BranchId
        }?page=${page}&limit=${limit}`
      )
      .then((res) => {
        setData(res.data.result);
        setPage(res.data.page);
        setPages(res.data.totalPage);
        setRows(res.data.totalRows);
      });
  }

  function fetchDataCat() {
    axiosInstance.get("/api/product/category").then((res) => {
      setDataCat(res.data.result);
    });
  }
  const selectPage = (e) => {
    // console.log(e);
    setPage(e);
  };
  const fetchFilPro = async () => {
    let url = "filter[category]=";
    categories1.map((val, idx) => {
      idx ? (url += `,${val}`) : (url += `${val}`);
    });

    url += `&order=${sort}&sort=${sortby}`;

    await axiosInstance.get("/api/product/filter?" + url).then((res) => {
      setData(res.data.result);
    });
  };
  const fetchFinPro = async (search) => {
    let url = "";

    url += `name=${search}&branch=${
      JSON.parse(localStorage.getItem("data"))
        ? JSON.parse(localStorage.getItem("data")).BranchId
        : 0
    }`;

    await axiosInstance.get("/api/product/finduser?" + url).then((res) => {
      setData(res.data.result);
    });
  };
  useEffect(() => {
    document.title = "KOPIO | Product List";
  });

  useEffect(() => {
    JSON.parse(localStorage.getItem("data")).isSuperAdmin
      ? navigate("/dashboard")
      : fetchData();
    fetchDataCat();
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [page]);

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
          </Flex>
          <Center marginLeft={["85px", "100px", "150px"]} w="100%">
            <Products
              data={data}
              fin={fetchFinPro}
              cat={[...categories1]}
              fetchData={fetchData}
              datacat={datacat}
              setCat={setCategories1}
              sort={[...sort]}
              sortby={[...sortby]}
              setSort={setSort}
              setSortBy={setSortBy}
              filter={fetchFilPro}
              page={page}
              pages={pages}
              limit={limit}
              rows={rows}
              select={(e) => {
                selectPage(e);
              }}
            />
          </Center>
        </>
      )}
    </>
  );
}
