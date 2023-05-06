import {
    Flex, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Thead, Th, Image, Input, FormControl, FormLabel, FormHelperText,
    useMediaQuery, Heading, Radio, RadioGroup, Stack, Select, Box,
} from '@chakra-ui/react';
import SidebarAdmin from '../components/sidebar_admin';
import ProductReport from '../components/productReport';
import TransactionReport from '../components/transactionReport';
import UserReport from '../components/userReport';

export default function Report() {
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
        <Flex
            w='100%' bg='gray.100'
        >
            <SidebarAdmin />
            <Flex w='100%' h='100vh' sx={webkit} overflow='auto' direction='column'>
                <ProductReport />
                <TransactionReport />
                <UserReport />
            </Flex>
        </Flex>
    )
}