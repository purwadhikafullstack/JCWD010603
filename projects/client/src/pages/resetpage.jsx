import Reset from "../components/reset_pasword";
import { Stack } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Reset />
    </Stack>
  );
}
