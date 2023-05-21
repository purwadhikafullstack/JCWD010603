import Register from "../components/register_user";
import { Stack } from "@chakra-ui/react";
export default function RegisterPage() {

  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
      marginY={"0"}
    >
      <Register  />
    </Stack>
  );
}
