import { Center } from "@chakra-ui/react";
import "../style/admin.css";

export default function AdminLoading() {
    return (
        <Center h='100vh' bg='#DCD7C9'>
            <span className="adminLoader"></span>
        </Center>
    );
}