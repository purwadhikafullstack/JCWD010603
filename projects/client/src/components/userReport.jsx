import {
    Flex, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Input, FormControl, FormLabel, useMediaQuery, Heading, Radio, RadioGroup,
    Stack, Select, Box, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption,
    TableContainer, Grid, GridItem, Image, Text
} from '@chakra-ui/react';
import { axiosInstance } from '../config/config';
import { useEffect, useState } from 'react';

export default function UserReport() {
    const [selectedSortOrder, setSelectedSortOrder] = useState("asc");
    const [allUserReportData, setAllUserReportData] = useState([]);
    const [branchUserReportData, setBranchUserReportData] = useState([]);

    const handleSortOrderChange = (value) => {
        setSelectedSortOrder(value);
    };

    async function fetchAllProductData() {
        await axiosInstance.get(`/transaction/userReport?grandTotal=${selectedSortOrder}`).then((res) => {
            setAllUserReportData([...res.data.result])
        })
    }
    async function fetchBranchProductData(branchID) {
        await axiosInstance.get(`/transaction/branchUserReport?grandTotal=${selectedSortOrder}&branchId=${branchID}`).then((res) => {
            setBranchUserReportData([...res.data.result])
        })
    }
    useEffect(() => {
        const fetchData = async () => {
            if (JSON.parse(localStorage.getItem('data')).isSuperAdmin) {
                await fetchAllProductData();
            } else {
                const branchId = JSON.parse(localStorage.getItem('data')).BranchId;
                await fetchBranchProductData(branchId);
            }
        };
        fetchData();
    }, [selectedSortOrder]);

    const [isSmallerThan1500] = useMediaQuery("(max-width: 1500px)");
    const [isSmallerThan650] = useMediaQuery("(max-width: 650px)");
    const webkit = {
        '::-webkit-scrollbar': {
            height: '0.3em',
            width: '0.3em',
            backgroundColor: 'none',
            borderRadius: '10px'
        },
        '::-webkit-scrollbar-thumb': {
            backgroundColor: 'gray.200',
            borderRadius: '10px'
        },
        '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555555',
            borderRadius: '10px'
        },
    };
    return (
        <Flex direction='column' w='100%' h='100%'>
            {
                (JSON.parse(localStorage.getItem("data")) ? JSON.parse(localStorage.getItem("data")).isSuperAdmin : null) ? (
                    <Flex w='100%' h='85vh' align='center' justify='flex-start' direction='column' p={5}
                    >
                        <Flex w='100%' h='100%' direction={isSmallerThan1500 ? "column-reverse" : "row"}>

                            <Flex
                                w={isSmallerThan1500 ? "100%" : "80%"} h='100%' direction={isSmallerThan1500 ? "row" : "column"} sx={webkit}
                                overflow='auto' p={5}
                            >
                                <Flex
                                    w={isSmallerThan1500 ? null : "100%"} direction={isSmallerThan1500 ? null : "column"} mb={isSmallerThan1500 ? null : '1em'}
                                    mr={isSmallerThan1500 ? "1em" : null} p={3}
                                >

                                    <Grid
                                        templateColumns={isSmallerThan1500 ? "null" : "repeat(3, 1fr)"}
                                        templateRows={isSmallerThan1500 ? "repeat(3, 1fr)" : "null"}
                                        gap={2}
                                    >
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} size='sm'>Username</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} size='sm'>Total Spent</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} textAlign={isSmallerThan1500 ? null : "center"} size='sm'>Branch</Heading>
                                    </Grid>
                                </Flex>
                                <Flex w='100%' sx={webkit} overflow='auto' direction={isSmallerThan1500 ? null : "column"} bg='white' p={3} borderRadius={20}>
                                    <Grid
                                        templateColumns={isSmallerThan1500 ? "null" : "repeat(3, 1fr)"}
                                        templateRows={isSmallerThan1500 ? "repeat(3, 1fr)" : "null"}
                                        gridAutoFlow={isSmallerThan1500 ? "column" : "row"}
                                        gap={2}
                                    >
                                        {
                                            allUserReportData?.map((val) => {
                                                const Totalprice = parseFloat(val.totalGrandPrice);
                                                const totalSales = `Rp ${Totalprice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                                                return (
                                                    <>
                                                        <Text alignSelf='center'>{val.userName}</Text>
                                                        <Text alignSelf='center'>{totalSales}</Text>
                                                        <Text alignSelf='center' textAlign='center'>{val.branchName}</Text>
                                                    </>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Flex>

                            </Flex>

                            {/* filter & sorter */}
                            <Flex w={isSmallerThan1500 ? "100%" : "20%"} direction='column' borderRadius={10} boxShadow="5px 5px 10px #ccd0d4,-5px -5px 10px #ffffff">
                                <Heading size='md' m='1em auto'>User Report</Heading>
                                <Accordion allowMultiple w='90%' m='0 auto'>
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left'>
                                                    Sort by
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <RadioGroup value={selectedSortOrder} onChange={handleSortOrderChange}>
                                                <Stack direction={isSmallerThan1500 ? "row" : "column"}>
                                                    <Radio value='asc'>Ascending</Radio>
                                                    <Radio value='desc'>Descending</Radio>
                                                </Stack>
                                            </RadioGroup>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            </Flex>

                        </Flex>

                    </Flex>
                ) : (
                    <Flex w='100%' h='85vh' align='center' justify='flex-start' direction='column' p={5}
                    >
                        <Flex w='100%' h='100%' direction={isSmallerThan1500 ? "column-reverse" : "row"}>

                            <Flex
                                w={isSmallerThan1500 ? "100%" : "80%"} h='100%' direction={isSmallerThan1500 ? "row" : "column"} sx={webkit}
                                overflow='auto' p={5}
                            >
                                <Flex
                                    w={isSmallerThan1500 ? null : "100%"} direction={isSmallerThan1500 ? null : "column"} mb={isSmallerThan1500 ? null : '1em'}
                                    mr={isSmallerThan1500 ? "1em" : null} p={3}
                                >

                                    <Grid
                                        templateColumns={isSmallerThan1500 ? "null" : "repeat(3, 1fr)"}
                                        templateRows={isSmallerThan1500 ? "repeat(3, 1fr)" : "null"}
                                        gap={2}
                                    >
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} size='sm'>Username</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} size='sm'>Total Spent</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} textAlign={isSmallerThan1500 ? null : "center"} size='sm'>Branch</Heading>
                                    </Grid>
                                </Flex>
                                <Flex w='100%' sx={webkit} overflow='auto' direction={isSmallerThan1500 ? null : "column"} bg='white' p={3} borderRadius={20}>
                                    <Grid
                                        templateColumns={isSmallerThan1500 ? "null" : "repeat(3, 1fr)"}
                                        templateRows={isSmallerThan1500 ? "repeat(3, 1fr)" : "null"}
                                        gridAutoFlow={isSmallerThan1500 ? "column" : "row"}
                                        gap={2}
                                    >
                                        {
                                            branchUserReportData?.map((val) => {
                                                const Totalprice = parseFloat(val.totalGrandPrice);
                                                const totalSales = `Rp ${Totalprice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                                                return (
                                                    <>
                                                        <Text alignSelf='center'>{val.userName}</Text>
                                                        <Text alignSelf='center'>{totalSales}</Text>
                                                        <Text alignSelf='center' textAlign='center'>{val.branchName}</Text>
                                                    </>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Flex>

                            </Flex>

                            {/* filter & sorter */}
                            <Flex w={isSmallerThan1500 ? "100%" : "20%"} direction='column' borderRadius={10} boxShadow="5px 5px 10px #ccd0d4,-5px -5px 10px #ffffff">
                                <Heading size='md' m='1em auto'>User Report</Heading>
                                <Accordion allowMultiple w='90%' m='0 auto'>
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left'>
                                                    Sort by
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <RadioGroup value={selectedSortOrder} onChange={handleSortOrderChange}>
                                                <Stack direction={isSmallerThan1500 ? "row" : "column"}>
                                                    <Radio value='asc'>Ascending</Radio>
                                                    <Radio value='desc'>Descending</Radio>
                                                </Stack>
                                            </RadioGroup>
                                        </AccordionPanel>
                                    </AccordionItem>
                                </Accordion>
                            </Flex>

                        </Flex>

                    </Flex>
                )
            }
        </Flex>
    )
}