import Login from "../components/login_user";
import { Stack } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Login />
    </Stack>
  );
}
