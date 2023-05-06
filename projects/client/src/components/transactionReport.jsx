import {
    Flex, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Input, FormControl, FormLabel, useMediaQuery, Heading, Radio, RadioGroup,
    Stack, Select, Box, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption,
    TableContainer, Grid, GridItem, Image, Text
} from '@chakra-ui/react';
import { axiosInstance } from '../config/config';
import { useEffect, useState } from 'react';

export default function TransactionReport() {
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()).toISOString().substr(0, 16));
    const [endDate, setEndDate] = useState(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const [selectedOption, setSelectedOption] = useState("date");
    const [selectedSortOrder, setSelectedSortOrder] = useState("asc");
    const [allTransactionReportData, setAllTransactionReportData] = useState([]);
    const [branchTransactionReportData, setBranchTransactionReportData] = useState([]);

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    const handleSortOrderChange = (value) => {
        setSelectedSortOrder(value);
    };

    async function fetchAllProductData() {
        let sortParam = "";
        if (selectedOption === "date") {
            sortParam = `sortOrder=${selectedSortOrder}`;
        } else if (selectedOption === "transaction") {
            sortParam = `sortSales=${selectedSortOrder}`;
        }
        await axiosInstance.get(`/transaction/transactionReport?startDate=${startDate}&endDate=${endDate}&${sortParam}`).then((res) => {
            setAllTransactionReportData([...res.data.result])
        })
    }
    async function fetchBranchProductData(branchID) {
        let sortParam = "";
        if (selectedOption === "date") {
            sortParam = `sortOrder=${selectedSortOrder}`;
        } else if (selectedOption === "transaction") {
            sortParam = `sortSales=${selectedSortOrder}`;
        }
        await axiosInstance.get(`/transaction/branchTransactionReport?startDate=${startDate}&endDate=${endDate}&${sortParam}&branchId=${branchID}`).then((res) => {
            setBranchTransactionReportData([...res.data.result])
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
    }, [selectedSortOrder, startDate, endDate, selectedOption]);

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
                                        templateColumns={isSmallerThan1500 ? "null" : "repeat(5, 1fr)"}
                                        templateRows={isSmallerThan1500 ? "repeat(5, 1fr)" : "null"}
                                        gap={2}
                                    >
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} size='sm'>Transaction no.</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} size='sm'>Total</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} textAlign={isSmallerThan1500 ? null : "center"} size='sm'>Username</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} textAlign={isSmallerThan1500 ? null : "center"} size='sm'>Branch</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} textAlign={isSmallerThan1500 ? null : "center"} size='sm'>Date</Heading>
                                    </Grid>
                                </Flex>
                                <Flex w='100%' sx={webkit} overflow='auto' direction={isSmallerThan1500 ? null : "column"} bg='white' p={3} borderRadius={20}>
                                    <Grid
                                        templateColumns={isSmallerThan1500 ? "null" : "repeat(5, 1fr)"}
                                        templateRows={isSmallerThan1500 ? "repeat(5, 1fr)" : "null"}
                                        gridAutoFlow={isSmallerThan1500 ? "column" : "row"}
                                        gap={2}
                                    >
                                        {
                                            allTransactionReportData?.map((val) => {
                                                const price = `Rp ${val.grandPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                                                const createdAt = new Date(val.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

                                                return (
                                                    <>
                                                        <Text alignSelf='center'>{val.noTrans}</Text>
                                                        <Text alignSelf='center'>{price}</Text>
                                                        <Text alignSelf='center' textAlign='center'>{val.userName}</Text>
                                                        <Text alignSelf='center' textAlign='center'>{val.branchName}</Text>
                                                        <Text alignSelf='center' textAlign='center'>{createdAt}</Text>
                                                    </>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Flex>

                            </Flex>

                            {/* filter & sorter */}
                            <Flex w={isSmallerThan1500 ? "100%" : "20%"} direction='column' borderRadius={10} boxShadow="5px 5px 10px #ccd0d4,-5px -5px 10px #ffffff">
                                <Heading size='md' m='1em auto'>Transaction Report</Heading>
                                <Accordion allowMultiple w='90%' m='0 auto'>
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left'>
                                                    Filter
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <FormControl>
                                                <Flex justify='space-between' direction={isSmallerThan1500 ? (isSmallerThan650 ? "column" : "row") : "column"}>
                                                    <Flex direction='column' w='100%'>
                                                        <FormLabel>From</FormLabel>
                                                        <Input
                                                            w={isSmallerThan1500 ? "80%" : "100%"} type="datetime-local" placeholder='Start Date' variant='filled' bg='white'
                                                            value={startDate} onChange={handleStartDateChange} cursor='pointer'
                                                        />
                                                    </Flex>
                                                    <Flex direction='column' w='100%' align={isSmallerThan1500 ? (isSmallerThan650 ? "flex-start" : "flex-end") : "flex-start"}>
                                                        <FormLabel>To</FormLabel>
                                                        <Input
                                                            w={isSmallerThan1500 ? "80%" : "100%"} type="datetime-local" placeholder='Start Date' variant='filled' bg='white'
                                                            value={endDate} onChange={handleEndDateChange} cursor='pointer'
                                                        />
                                                    </Flex>
                                                </Flex>
                                            </FormControl>
                                        </AccordionPanel>
                                    </AccordionItem>

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
                                            <Select
                                                variant='filled' bg='white' placeholder='Date / Transaction ?' w='100%' my={2}
                                                onChange={handleOptionChange} defaultValue={'date'} cursor='pointer'
                                            >
                                                <option value='date'>Date</option>
                                                <option value='transaction'>Total Transaction</option>
                                            </Select>
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
                                        templateColumns={isSmallerThan1500 ? "null" : "repeat(5, 1fr)"}
                                        templateRows={isSmallerThan1500 ? "repeat(5, 1fr)" : "null"}
                                        gap={2}
                                    >
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} size='sm'>Transaction no.</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} size='sm'>Total</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} textAlign={isSmallerThan1500 ? null : "center"} size='sm'>Username</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} textAlign={isSmallerThan1500 ? null : "center"} size='sm'>Branch</Heading>
                                        <Heading alignSelf={isSmallerThan1500 ? "center" : null} textAlign={isSmallerThan1500 ? null : "center"} size='sm'>Date</Heading>
                                    </Grid>
                                </Flex>
                                <Flex w='100%' sx={webkit} overflow='auto' direction={isSmallerThan1500 ? null : "column"} bg='white' p={3} borderRadius={20}>
                                    <Grid
                                        templateColumns={isSmallerThan1500 ? "null" : "repeat(5, 1fr)"}
                                        templateRows={isSmallerThan1500 ? "repeat(5, 1fr)" : "null"}
                                        gridAutoFlow={isSmallerThan1500 ? "column" : "row"}
                                        gap={2}
                                    >
                                        {
                                            branchTransactionReportData?.map((val) => {
                                                const price = `Rp ${val.grandPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
                                                const createdAt = new Date(val.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

                                                return (
                                                    <>
                                                        <Text alignSelf='center'>{val.noTrans}</Text>
                                                        <Text alignSelf='center'>{price}</Text>
                                                        <Text alignSelf='center' textAlign='center'>{val.userName}</Text>
                                                        <Text alignSelf='center' textAlign='center'>{val.branchName}</Text>
                                                        <Text alignSelf='center' textAlign='center'>{createdAt}</Text>
                                                    </>
                                                )
                                            })
                                        }
                                    </Grid>
                                </Flex>

                            </Flex>

                            {/* filter & sorter */}
                            <Flex w={isSmallerThan1500 ? "100%" : "20%"} direction='column' borderRadius={10} boxShadow="5px 5px 10px #ccd0d4,-5px -5px 10px #ffffff">
                                <Heading size='md' m='1em auto'>Transaction Report</Heading>
                                <Accordion allowMultiple w='90%' m='0 auto'>
                                    <AccordionItem>
                                        <h2>
                                            <AccordionButton>
                                                <Box as="span" flex='1' textAlign='left'>
                                                    Filter
                                                </Box>
                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <FormControl>
                                                <Flex justify='space-between' direction={isSmallerThan1500 ? (isSmallerThan650 ? "column" : "row") : "column"}>
                                                    <Flex direction='column' w='100%'>
                                                        <FormLabel>From</FormLabel>
                                                        <Input
                                                            w={isSmallerThan1500 ? "80%" : "100%"} type="datetime-local" placeholder='Start Date' variant='filled' bg='white'
                                                            value={startDate} onChange={handleStartDateChange} cursor='pointer'
                                                        />
                                                    </Flex>
                                                    <Flex direction='column' w='100%' align={isSmallerThan1500 ? (isSmallerThan650 ? "flex-start" : "flex-end") : "flex-start"}>
                                                        <FormLabel>To</FormLabel>
                                                        <Input
                                                            w={isSmallerThan1500 ? "80%" : "100%"} type="datetime-local" placeholder='Start Date' variant='filled' bg='white'
                                                            value={endDate} onChange={handleEndDateChange} cursor='pointer'
                                                        />
                                                    </Flex>
                                                </Flex>
                                            </FormControl>
                                        </AccordionPanel>
                                    </AccordionItem>

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
                                            <Select
                                                variant='filled' bg='white' placeholder='Date / Transaction ?' w='100%' my={2}
                                                onChange={handleOptionChange} defaultValue={'date'} cursor='pointer'
                                            >
                                                <option value='date'>Date</option>
                                                <option value='transaction'>Total Transaction</option>
                                            </Select>
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
        </Flex >
    )
}