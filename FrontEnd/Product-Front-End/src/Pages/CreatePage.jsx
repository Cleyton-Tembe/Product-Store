import { Box, Button, Container, Heading, Input, useColorModeValue, useToast, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useProductStore } from '../Store/product';

const CreatePage = () => {

    const [product, setProduct] = useState({
        name:"",
        price:0,
        image:"",
    })

    const toast = useToast()

    function HandleInputFields(e) {

        switch (e.target.name) {
            case 'name':
                setProduct({...product, name: e.target.value})
                break;
            case 'price':
                setProduct({...product, price: e.target.value})
                break;
            case 'image':
                setProduct({...product, image: e.target.value})
                break;
            default:
                break;
        }
    }

    const {createProduct} = useProductStore()

    async function HandleProduct() {
        console.log("Triggered")
        // addProduct().then(() => console.log("Done"))
        // .catch(()=> console.log("Something Happened"))
        const {sucess, message} = await createProduct(product)
        if(!sucess){
            toast({
            title: "ERROR",
            description: message,
            status: "error",
            duration: 3000,
            isClosable: true
        })
        }else{
            toast({
            title: "Operation",
            description: message,
            status: "success",
            duration: 3000,
            isClosable: true
        })
        }
        setProduct({name: "", price:0, image: ""})
    }

    // async function addProduct() {
    //     console.log("on it chefe")
    //     try {
    //        const respone = await axios.post('/api/products',{
    //         data: product})
    //        console.log(respone.data)
    //     } catch (error) {
    //         console.error("Something went wrong", error.message)
    //     }
    // }

  return (
    <Container marginTop={100}>
      <VStack
        spacing={8}
      >
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
            Create New Product
        </Heading>

        <Box 
            w="full"
            bg={useColorModeValue("white", "gray.800")}
            p={6} rounded={"lg"} shadow={"md"}
        >

            <VStack>
                <Input 
                    placeholder='product name...'
                    type='text'
                    name='name'
                    value={product.name}
                    onChange={(e)=> HandleInputFields(e)}
                />

                <Input 
                    placeholder='product price...'
                    type='number'
                    name='price'
                    value={product.price}
                    onChange={(e)=> HandleInputFields(e)}
                />
                
                <Input 
                    placeholder='product image...'
                    name='image'
                    value={product.image}
                    onChange={(e)=> HandleInputFields(e)}
                />
                
                <Button
                    colorScheme='blue'
                    onClick={HandleProduct}
                    w={'full'}
                >
                    Add Product
                </Button>
            </VStack>

        </Box>
      </VStack>
    </Container>
  )
}

export default CreatePage
