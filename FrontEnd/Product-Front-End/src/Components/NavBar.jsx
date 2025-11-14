import { Button, Container, Flex, HStack, Text, useColorMode, } from '@chakra-ui/react'
import { CiCirclePlus } from "react-icons/ci";
import { Link } from 'react-router-dom'
import {LuMoon, LuSun} from 'react-icons/lu'

function NavBar() {

const {colorMode, toggleColorMode} = useColorMode()

  return (
    <Container maxW={"100%"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
            base:"column",
            sm:"row"
        }}
        >

        <Text
            fontSize={{base:"22", sm: "28"}}
            fontWeight={'bold'}
            textTransform={'uppercase'}
            bgGradient={'linear(to-l, teal.400, cyan.500)' }
            bgClip={"text"}
        >
            <Link to={"/"}>Product Store 🛒</Link>
        </Text>

        <HStack spacing={2} alignItems={"center"}>
            <Link to={"create"}>
                <Button>
                    <CiCirclePlus fontSize={20}/>
                </Button>
            </Link>
            <Button 
                onClick={toggleColorMode}
            >
                {colorMode === "light" ? <LuSun /> : <LuMoon />}
            </Button>
        </HStack>

      </Flex>
    </Container>
  )
}

export default NavBar
