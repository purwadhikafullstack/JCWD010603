import Update from "../components/profile_update";
import { Stack } from "@chakra-ui/react";

export default function UpdateProfilePage() {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Update />
    </Stack>
  );
}
