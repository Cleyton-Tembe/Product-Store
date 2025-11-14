import { Container, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProductStore } from '../Store/product'
import ProductCard from '../Components/ProductCard'


const HomePage = () => {

  const {fetchProducts, products} = useProductStore()

  useEffect(()=>{
    try {
      fetchProducts()
    } catch (error) {
      console.error("ERROR here:",error.message)
    }
  },[])

  console.log(products)

  return (
    <Container maxW='container.xl' py={12}>
        <VStack spacing={8}>
            <Text
              fontSize={{base:"22", sm: "28"}}
              fontWeight={'bold'}
              textTransform={'uppercase'}
              bgGradient={'linear(to-l, teal.400, cyan.500)' }
              bgClip={"text"}
            >
              Current Products
            </Text>

            {products ? 
              <SimpleGrid
                columns={{
                  base: 1,
                  md: 2,
                  lg: 3,
                }}

                spacing={10}
                w={'full'}
            >

              {products.map((p, i) => (
                <ProductCard key={i} product={p} />
              ))}


            </SimpleGrid> : 
            <Text 
                fontSize={'xl'} 
                textAlign={"center"} 
                fontWeight={'bold'}
                color={'gray.500'}
            >
                No Products Found 😅 {" "}

                <Link to={'/create'}>
                    <Text
                        as={'span'}
                        color={'blue.500'}
                        _hover={{textDecoration: "underline"}}
                    >
                        Create a Product
                    </Text>
                </Link>
            </Text>
            }
            

            
        </VStack>
    </Container>
  )
}

export default HomePage
