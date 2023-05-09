import {
    Flex, Button, Stack, Center,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, useDisclosure,
    FormControl, FormLabel, Input, useToast, Heading, IconButton, Tooltip, Table, Tr, Td, Thead, Tbody, Select, FormHelperText, Grid, Textarea, border, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader,PopoverCloseButton,PopoverBody,PopoverFooter, Text, Box, TableContainer, Tfoot, TableCaption, Th, GridItem
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import SidebarAdmin from '../components/sidebar_admin';
import { axiosInstance } from '../config/config';
import { RiFileUserLine } from "react-icons/ri";
import React from "react";
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css"

export default function Record() {
    const initialFocusRef = React.useRef()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [recordStock, setRecordStock] = useState([]); 
    const [productData, setProductData] = useState([])

    const [page, setPage]= useState(1)
    const [limit, setLimit]= useState(6)
    const [pages, setPages]= useState(10)
    const [rows, setRows]= useState(0)
    const [allBranchTrans, setAllBranchTrans] = useState([])
    const [dataTrans, setDataTrans] = useState([])
    const [branches, setBranches] = useState([])
    const [order, setOrder] = useState("DESC")
    const [detailTrans, setDetailTrans] = useState({})
    const [transactionStatus, setTransactionStatus] = useState([])

    const superAdmin = JSON.parse(localStorage.getItem("data")).isSuperAdmin

    const webkit = {
        '::-webkit-scrollbar': {
            height: '0.3em',
            width: '0.3em',
            backgroundColor: 'none',
            borderRadius: '10px'
        },
        '::-webkit-scrollbar-thumb': {
            // backgroundColor: '#181D31',
            backgroundColor: 'gray.200',
            borderRadius: '10px'
        },
        '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555555',
            borderRadius: '10px'
        },
    }

    const changePage = ({selected}) => {
        setPage(parseInt(selected) + 1)
    }

    const handleDataTrans = (e) => {
            setDetailTrans({...e})
        axiosInstance.get(`/transaction/getTransactionItem/${e.id}`).then((res) => {
            setDataTrans([...res.data.result])
        })
        setTimeout(()=> {
        onOpen()
        }, 100)
    }

    const fetchAllTrans = (e) => {
        if(e){
            axiosInstance.get(`/transaction/allBranchTransaction?search=${e}&page=${page}&limit=${limit}&order=${order}`).then((res) => {
                setAllBranchTrans(res.data.result)
                setPage(res.data.page)
                setPages(res.data.totalPage)
                setRows(res.data.totalRows)
            }) 
        } else {
            axiosInstance.get(`/transaction/allBranchTransaction?page=${page}&limit=${limit}&order=${order}`).then((res) => {
                setAllBranchTrans(res.data.result)
                setPage(res.data.page)
                setPages(res.data.totalPage)
                setRows(res.data.totalRows)
            }) 
        }
    }

    const fetchAllTransByBranch = (e) => {
        if(e){
            console.log(e);
            axiosInstance.get(`/transaction/allTransactionByBranch/${JSON.parse(localStorage.getItem("data")).BranchId}?search=${e}&page=${page}&limit=${limit}&order=${order}`).then((res) => {
                setAllBranchTrans(res.data.result)
                setPage(res.data.page)
                setPages(res.data.totalPage)
                setRows(res.data.totalRows)
            }) 
        } else {
            axiosInstance.get(`/transaction/allTransactionByBranch/${JSON.parse(localStorage.getItem("data")).BranchId}?page=${page}&limit=${limit}&order=${order}`).then((res) => {
                setAllBranchTrans(res.data.result)
                setPage(res.data.page)
                setPages(res.data.totalPage)
                setRows(res.data.totalRows)
            }) 
        }
    }

    const fetchBranch = () => {
        axiosInstance.get('/admin/branches').then((res)=> {
            setBranches(res.data.result)
        })
    }
    const fetchStatus = () => {
        axiosInstance.get('/transaction/transactionStatus').then((res)=> {
            setTransactionStatus(res.data.result)
        })
    }
    useEffect(() => {
        superAdmin?
        fetchBranch()
        :
        fetchStatus()
    }, []);
    // console.log(transactionStatus);
    useEffect(() => {
        superAdmin?
        fetchAllTrans()
        :
        fetchAllTransByBranch()
    }, [page, order]);

    console.log(allBranchTrans);
    return (
        <>
            <Flex w='100%' bg='gray.100'>

                <SidebarAdmin />

                <Flex h='100vh' w='100%' direction='column' p={[2, 4, 8, 10]}>
                    <Center w='100%' h='100%'>
                        <Flex w={['70%', '80%', '100%']} h='100%' overflow='auto' sx={webkit} bg='white' borderRadius={10}>
                            <Stack w={'80%'} m='0 auto' spacing={3} py={4} >
                                <Heading mt={3} color='#2C3639' textAlign='center' fontSize={['lg', 'xl', '2xl', '3xl']}>
                                    Transactions list
                                </Heading>
                                <Flex h='85%' w='100%' overflow='auto'
                                    sx={webkit}
                                    direction='column' color='#2C3639'
                                    borderBottom='4px solid #2C3639' borderTop='4px solid #2C3639'
                                    alignItems={'center'}
                                >
                                
                                    <Table fontSize={['md', 'lg', 'xl']} w='900px' gridGap={0} margin={0} padding={0}>
                                    {
                                        allBranchTrans?.map((val, idx) => {
                                        return <Tr w={'inherit'} key={idx} p="3px 2px 2px 20px" borderBottom='1px solid #2C3639'
                                                 _hover={{
                                                    backgroundColor: 'gray.200'
                                                }} padding={'0'} margin={0} h='70px'>
                                        <Grid w={'inherit'} templateColumns={'3fr 3fr 3fr'} placeItems={"center"} >
                                            <Td textAlign={'center'} border={0}>
                                                        {val.noTrans}
                                            </Td>                                          
                                            <Td textAlign={'center'} border={0}>
                                                        {val.Transaction_status?.name ??  'error'}
                                            </Td>
                                            <Td textAlign={'center'} border={0}>
                                            <Flex gap={'10px'}>
                                            <Flex w="40px" justify='space-around' color={'white'} bgColor={'blue.300'} borderRadius={'2xl'}>
                                                    <Tooltip label='Transaction Detail' placement='top-start'>
                                                        <IconButton
                                                            icon={<RiFileUserLine/>}
                                                            borderRadius='2xl'
                                                            _hover={{
                                                                color: 'black',
                                                            }}
                                                            bg='none' 
                                                            onClick={ () => handleDataTrans({id :val.id, grandPrice : val.grandPrice, totalWeight: val.totalWeight, date: (val.createdAt).split('T')[0]})}
                                                        />
                                                    </Tooltip>
                                                </Flex>
                                             <Popover
      initialFocusRef={initialFocusRef}
      placement='bottom'
      closeOnBlur={false}
    >
                                                <PopoverTrigger>
                                                <Flex w="40px" justify='space-around' color={'white'} bgColor={'yellow.500'} borderRadius={'2xl'}>
                                                    <Tooltip label='Transaction Data' placement='top-start'>
                                                        <IconButton
                                                            icon={<RiFileUserLine/>}
                                                            borderRadius='2xl'
                                                            _hover={{
                                                                color: 'black',
                                                            }}
                                                            bg='none' 
                                                        />
                                                    </Tooltip>
                                                </Flex>
                                                    </PopoverTrigger>
                                                    <PopoverContent w={'350px'} color='white' bg='blue.800' borderColor='blue.800'>
        <PopoverHeader pt={5} fontSize={'20px'} fontWeight='bold' borderBottom='1' paddingBottom={'20px'}>
         Transaction Data
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody paddingX={'10px'} paddingY={'15px'}>
          <Grid rowGap={'20px'} fontSize={'18px'}>
                <Grid rowGap={'10px'}>
                    <Box>Branch</Box>
                    <Box>{val.Branch?.name}</Box>
                </Grid>
                <Grid rowGap={'10px'}>
                    <Box>Email</Box>
                    <Box>{val.User?.email}</Box>
                </Grid>
             
          </Grid>
        </PopoverBody>
      </PopoverContent>
                                                    </Popover>
                                                    </Flex>
                                                </Td>
                                                </Grid>
                                            </Tr>
                                        })
                                    }
                                            {/* </Tbody> */}
                                    </Table>
                                    <Box w={"100%"} textAlign={"right"}>Total Data: {rows} | Page: {rows ? page: 0} of {pages}</Box>
                                    <Box marginTop={'19px'}>
                                    <nav role={'navigation'} aria-label={'pagination'} className='pagination is-centered'>
                                        <ReactPaginate
                                            previousLabel= {"< Prev"}
                                            nextLabel= {"Next >"}
                                            pageCount={pages}
                                            onPageChange= {changePage}
                                            containerClassName = {"pagination-list"}
                                            pageLinkClassName = {"pagination-link"}
                                            previousLinkClassName = {"pagination-previous"}
                                            nextLinkClassName = {"pagination-next"}
                                            activeLinkClassName = {"pagination-link is-current"}
                                            disableLinkClassName = {"pagination-link is-disabled"}
                                        />
                                    </nav>
                                    </Box>
                                </Flex>
                                <Flex flexDirection={"row-reverse"} gap={'10px'}>

                                {
                                    superAdmin ?
                                <Select w={"200px"} className='is-hovered' name='idBranch' placeholder='All Branch' onClick={(e) => fetchAllTrans(e.target.value)}>
                {
                      branches.map((b)=> {
                        return (
                        <option key = {b.id} value= {b.id}>{b.name}</option>
                        )
                      })
                }
                </Select>
                      :

                      <Select w={"200px"} className='is-hovered' name='idTransStatus' placeholder='All Transactions Status' onClick={(e) => fetchAllTransByBranch(e.target.value)}>
                {
                      transactionStatus.map((b)=> {
                        return (
                        <option key = {b.id} value= {b.id}>{b.name}</option>
                        )
                      })
                }
                </Select>

                                }
                                <Select w={"200px"} className='is-hovered' name='idSort' placeholder='Latest Transactions' onClick={(e) => setOrder(e.target.value)}>
                        <option value= "ASC">Earliest Transactions</option>
                </Select>
                                </Flex>
                            </Stack>
                        </Flex>
                    </Center>
                </Flex>
            </Flex >
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <TableContainer>
         <Grid gridTemplateColumns={'3fr 1fr 1fr'} w='250px'>
            <GridItem>Grand Price</GridItem>
            <GridItem>:</GridItem>
            <GridItem>Rp. {detailTrans.grandPrice}</GridItem>
            <GridItem>Total Weight</GridItem>
            <GridItem>:</GridItem>
            <GridItem>{detailTrans.totalWeight} gr</GridItem>
            <GridItem>Date Transaction</GridItem>
            <GridItem>:</GridItem>
            <GridItem>{detailTrans.date}</GridItem>
         </Grid>
  <Table variant='striped' w={'100%'} border={1}>
    <TableCaption>Transaction Items</TableCaption>
    <Tbody>
    {dataTrans?.map((val, idx) => {
        return <Tr w={'100%'} key={idx}>
        <Grid templateColumns={'1fr 1fr 1fr'}>
        <Td textAlign={'center'}>{val.Product?.name}</Td>
        <Td textAlign={'center'}>Rp. {val.Product?.price}</Td>
        <Td textAlign={'center'}>{val.Product?.weight} gr</Td>
        </Grid>
    </Tr>
    })}
    </Tbody>
  </Table>
</TableContainer>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}
