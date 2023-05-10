import {
    Center,
    Alert,
    AlertIcon,    
    AlertDescription,
    AlertTitle,
  } from "@chakra-ui/react";
export default function Verified_error() {  

    return (
        <>
          <Center flex={1} align={"center"} justifyContent={"center"}>
            <Center
            //   paddingY={"25px"}
              spacing={4}
              maxW={"md"}
              bgColor="#2C3639"
              w="430px"
              h="932px"
              color="white"
              flexDir="column"
              gap={8}
            >
            <Alert
  status='error'
  variant='subtle'
  flexDirection='column'
  alignItems='center'
  justifyContent='center'
  textAlign='center'
  height='inherit'
>
  <AlertIcon boxSize='40px' mr={0} />
  <AlertTitle mt={4} mb={1} fontSize='lg'>
    Failed Verify User!
  </AlertTitle>
  <AlertDescription maxWidth='sm'>
  Token has been expired.
  </AlertDescription>
</Alert>
            </Center>
        </Center>
        </>
        )
}
