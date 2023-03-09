import {
  Flex,
  Image,
  InputGroup,
  InputRightElement,
  Box,
  List,
  Input,
  Menu,
  Link,
  Button,
  Divider,
  Icon,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  ListItem,
  Avatar,
  Center,
} from "@chakra-ui/react";
export default function Banner() {
  return (
    <>
      <Center flex={1} align={"center"} justifyContent={"center"}>
        <Flex
          px={2}
          h="686px"
          backgroundColor="#DCD7C9"
          w="430px"
          padding="20px"
          borderBottom={"2px solid #E2E8F0"}
          display={"flex"}
          pos="sticky"
        ></Flex>
      </Center>
    </>
  );
}
