import {
  Icon,
  Center,
  Flex,
  FormControl,
  Avatar,
  Input,
  Link,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link as ReachLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdateProfile() {
  const [imgUser, setImgUser] = useState("");

  const [User_id, setUser_id] = useState(0);
  const userSelector = useSelector((state) => state.auth);
  console.log(userSelector);
  useEffect(() => {
    setUser_id(userSelector?.id);
  }, []);

  const [saveImage, setSaveImage] = useState(null);

  const handleFile = (event) => {
    const uploaded = event.target.files[0];
    console.log(uploaded);
    setImgUser(URL.createObjectURL(uploaded));
    setSaveImage(uploaded);
  };

  return (
    <>
      <Center flex={1} align={"center"} justifyContent={"center"}>
        <Flex
          spacing={4}
          maxW={"md"}
          bgColor="#DCD7C9"
          w="430px"
          h="932px"
          color="white"
          flexDir="column"
          gap={8}
        >
          <Flex
            w="430px"
            h="358px"
            bgColor="#2C3639"
            flexDir={"column"}
            gap={10}
          >
            <Link to="/userpage" as={ReachLink}>
              <Flex textAlign={"left"} color="white">
                <Icon
                  boxSize={"7"}
                  as={IoIosArrowBack}
                  color="white"
                  sx={{
                    _hover: {
                      cursor: "pointer",
                    },
                  }}
                ></Icon>
                Back
              </Flex>
            </Link>

            <Center flexDir={"column"} gap={5}>
              <Flex flexDir={"column"}>
                <FormControl id="productName">
                  <Stack direction={["column"]} spacing={6}>
                    <Center>
                      <Avatar size="2xl" src={imgUser}>
                        {/* <AvatarBadge
                          as={IconButton}
                          size="sm"
                          rounded="full"
                          top="-10px"
                          colorScheme="red"
                          aria-label="remove Image"
                          icon={<SmallCloseIcon />}
                        /> */}
                      </Avatar>
                    </Center>
                    <Center w="full" justifyContent={"center"}>
                      <Input
                        id=""
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        w="full"
                        placeholder="Image URL"
                        name={imgUser}
                        // onChange={(e) => setImgUser(e.target.value)}
                      ></Input>
                    </Center>
                  </Stack>
                </FormControl>

                <Flex justifyContent={"bottom"}></Flex>
              </Flex>
            </Center>
          </Flex>
        </Flex>
      </Center>
    </>
  );
}
