import {
    Flex, Heading, Button, Grid, GridItem, Center,
    Text,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState, useEffect } from "react";
import { axiosInstance } from "../config/config";
import { GiCoffeeBeans } from "react-icons/gi";

export default function CatsContainer() {
    const [categoryData, setCategoryData] = useState([]);
    const [showAll, setShowAll] = useState(false);

    //FETCH CATEGORY
    async function fetchCategory() {
        await axiosInstance.get('api/admin/categories').then((res) => {
            setCategoryData([...res.data.result])
        })
    };
    useEffect(() => {
        fetchCategory()
    }, []);

    //HANDLE SHOW-ALL
    function handleShowAll() {
        setShowAll(!showAll);
    }
    const visibleCategories = showAll ? categoryData : categoryData.slice(0, 8);

    //HANDLE RANDOMIZE COLOR
    const getRandomColor = () => {
        const colors = [
            "#4C4B16",
            "#3A3845",
            "#61764B",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <Flex w="430px" m='40px auto 0px' direction='column'>
            <Heading size='md' p={5} textAlign='center'>
                Categories
            </Heading>
            <Grid gap={3} templateColumns='repeat(4, 1fr)' p={5} >
                {visibleCategories.map((val) => {
                    return (
                        <Flex direction='column' align='center' key={val.id}>
                            <Flex
                                w='50px' h='50px' border={`3px solid ${getRandomColor()}`}
                                align='center' justifyContent='center'
                                borderRadius='full'
                            >
                                <GiCoffeeBeans size='35' color={getRandomColor()} />
                            </Flex>
                            <Text fontSize='xs' textAlign='center' fontWeight='bold' userSelect='none'>
                                {val.name}
                            </Text>
                        </Flex>
                    )
                })}
            </Grid>
            {/* Show More Button */}
            {!showAll && categoryData.length > 10 && (
                <Flex w='35%' m='0 auto' justify='space-around' align='center' onClick={handleShowAll} borderRadius={50} bg='#2C3639' color='white'
                    _hover={{
                        cursor: "pointer",
                        backgroundColor: '#2C3639',
                        color: 'white',
                        borderRadius: '50',
                        transition: '500ms all'
                    }}
                    _active={{
                        transform: "scale(0.98)",
                        transition: "1ms all",
                    }}
                >
                    <Text my={1} userSelect='none' fontWeight='bold'>
                        Show More
                    </Text>
                    <ChevronDownIcon />
                </Flex>
            )
            }
            {/* Show Less Button */}
            {
                showAll && (
                    <Flex w='35%' m='0 auto' justify='space-around' align='center' onClick={handleShowAll} borderRadius={50} bg='#2C3639' color='white'
                        _hover={{
                            cursor: "pointer",
                            backgroundColor: '#2C3639',
                            color: 'white',
                            borderRadius: '50',
                            transition: '500ms all'
                        }}
                        _active={{
                            transform: "scale(0.95)",
                            transition: "1ms all",
                        }}
                    >
                        <Text my={1} userSelect='none' fontWeight='bold'>
                            Show Less
                        </Text>
                        <ChevronUpIcon />
                    </Flex>
                )
            }
        </Flex >
    )
}