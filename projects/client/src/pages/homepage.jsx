import NavBar from "../components/navbarhome"; //not loggedin
import Navbar from "../components/navbar"; //loggedin
import Banner from "../components/banner";
import CatsContainer from "../components/lp_categories";
import { Flex, Grid, Select, Image, Heading, Text, Button, Link, useToast, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../config/config";
import { Link as ReachLink } from "react-router-dom";
import adsImg from "../asset/ads.png"
import LogoHD from "../asset/logo.png";
import "../style/homepage.css"

export default function UserPage() {
  const [branches, setBranches] = useState([]);
  const [currentCoords, setCurrentCoords] = useState('');
  const [nearestId, setNearestId] = useState(null);
  const [products, setProducts] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const toast = useToast();

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
  // function pelengkap haversine
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  //fetch branch + get user position
  async function getBranches() {
    await axiosInstance.get("/admin/branchesgeometry").then((res) => {
      setBranches([...res.data.result])
    })
  }
  useEffect(() => {
    getBranches();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoords({ latitude, longitude });
      },
      (error) => {
        console.log(error.message);
      }
    );
  }, []);

  //get branch terdekat on load
  useEffect(() => {
    if (currentCoords && branches.length > 0) {
      let nearestDistance = Infinity;
      let nearestIndex = -1;

      for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        const lat2 = branch.coordinate[0];
        const lon2 = branch.coordinate[1];
        const distance = haversine(currentCoords.latitude, currentCoords.longitude, lat2, lon2); //FUNGSI ASLI
        // const distance = haversine(-6.155661729116352, 106.90503790831906, lat2, lon2); //BUAT TESTING CUSTOM KOORDINAT (COPY DARI GOOGLE MAP)

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      setNearestId(branches[nearestIndex].id);
      setBranchId(branches[nearestIndex].id);
    }
  }, [currentCoords, branches]);

  //fetch product suggestion
  async function getProduct() {
    await axiosInstance.get(`/product/productsuggestion/${branchId}`).then((res) => {
      setProducts([...res.data.result])
    })
  }
  useEffect(() => {
    getProduct();
  }, [branchId])
  //handle on change Select Branch
  const handleBranchChange = (e) => {
    const selectedId = e.target.value
    localStorage.setItem("branchID", selectedId);
    setBranchId(selectedId);
  };

  async function addToCart(id) {
    const userId = localStorage.getItem("userID");
    const data = {
      qty: 1,
      ProductId: id,
      UserId: userId
    }
    try {
      await axiosInstance.post("/cart/addToCart", data);
      toast({
        title: "Item added to cart",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      // console.log(error.response.data);
      toast({
        title: "Failed adding item",
        description: error.response.data.message,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      {
        localStorage.getItem("userID") ? (<Navbar />) : (<NavBar />)
      }
      <Banner />
      <CatsContainer />

      <Flex w="430px" h='229px' m='50px auto' direction='column' py={5} bgImage={adsImg} />

      <Heading size='md' p={5} textAlign='center' mt={10}>Suggestion</Heading>
      {nearestId && (
        <Select defaultValue={nearestId} w="430px" m='0 auto' onChange={handleBranchChange} cursor='pointer' size='sm'>
          {branches?.map((val) => (
            <option value={val.id} key={val.id} >
              {val.city}
            </option>
          ))}
        </Select>
      )}

      <Flex w="430px" m='0 auto' h='500px' direction='column' py={5}>
        <Grid w='100%' gap={1} templateColumns='repeat(3, 1fr)' justifyItems='center' px={1}>
          {
            products?.map((val) => {
              return (
                <Flex
                  w='133px' h='210px' key={val.id} borderRadius={10} overflow='hidden' boxShadow='rgba(0, 0, 0, 0.09) 0px 3px 12px'
                  direction='column' justify='space-between' mb={4} cursor='pointer'
                >
                  <Link to={"/detail-product/" + val?.id} as={ReachLink}>
                    <Image src={val.imgProduct} w='100%' h='120px' objectFit='cover' />
                  </Link>

                  <Text ml={1} fontSize='sm'>{val.name}</Text>
                  <Text ml={1} fontSize='sm' fontWeight='bold'>Rp{val.price.toLocaleString()}</Text>

                  <Button size='sm' borderRadius='none' bg='#2C3639' color='white'
                    _hover={{
                      bg: '#4A5568'
                    }}
                    _active={{
                      transform: 'scale(0.98)',
                      bg: '#373e4a'
                    }}
                    onClick={() => addToCart(val.id)}
                  >
                    Add to cart
                  </Button>
                </Flex>
              )
            })
          }
        </Grid>
      </Flex>

      <Flex w='430px' h='120px' bg='#2C3639' m='40px auto 0px' p='20px 0px 0px 20px' align='center' justify='space-between'>
        <Flex w='30%' h='100%' direction='column' mr={3}>
          <Heading size='md' color='white'>
            KOPIO
          </Heading>
          <Flex w='100%' color='whiteAlpha.700' mt={3} direction='column'>
            <Link fontSize='xs'>
              About us
            </Link>
            <Link fontSize='xs'>
              Career
            </Link>
            <Link fontSize='xs'>
              Blog
            </Link>
          </Flex>
        </Flex>

        <Flex w='35%' h='100%' direction='column'>
          <Heading size='md' color='white'>
            Collaboration
          </Heading>
          <Flex w='100%' color='whiteAlpha.700' mt={3} direction='column'>
            <Link fontSize='xs'>
              Join us
            </Link>
            <Link fontSize='xs'>
              Membership
            </Link>
          </Flex>
        </Flex>
        <Image src={LogoHD} transform="rotate(-90deg)" h='20%' w='auto' m={0} />

      </Flex>
    </>
  );
}
