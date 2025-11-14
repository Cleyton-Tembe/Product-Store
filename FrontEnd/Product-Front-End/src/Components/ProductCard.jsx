import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Button, Heading, HStack, IconButton, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue, useToast, VStack,useDisclosure, Input } from "@chakra-ui/react"
import { useProductStore } from "../Store/product"
import { useState } from "react"


const ProductCard = ({product}) => {

    const [updated, setupdated] = useState(product)
    const {deleteProduct, updateProduct} = useProductStore()
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const HandleDeleteProducts = async (id) => {
        const {sucess, message} = await deleteProduct(id)
        console.log(sucess)
        if(!sucess) {
            toast({
                title: 'ERROR',
                description: message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }else{
            toast({
                title: "Success",
                description: message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        }
    }

    const HandleUpdatedProducts = async (id, product) => {
        const {sucess, message} = await updateProduct(id, product)
        console.log(sucess)
        if(!sucess) {
            toast({
                title: 'ERROR',
                description: message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }else{
            toast({
                title: "Success",
                description: message,
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        }

        onClose()
    }

    const textcolor = useColorModeValue("gray.600", "gray.200")
    const bg = useColorModeValue("white", "gray.800")

  return (
    <Box
        shadow={'lg'}
        rounded={'lg'}
        overflow={'hidden'}
        transition={'all 0.3s'}
        _hover={{transform: "translateY(-5px)", shadow: "xl"}}
        bg={bg}
    >
        <Image src={product.image}
                alt={product.name}
                h={48}
                w={'full'}
                objectFit={'contain'}
         />

         <Box p={4}>
            <Heading
                as={'h3'}
                size={'md'}
                mb={2}
            >
                {product.name}

            </Heading>

            <Text
                fontWeight={'bold'}
                fontSize={'xl'}
                color={textcolor}
                mb={4}
            >
                {product.price}mt
            </Text>

            <HStack spacing={3}>
                <IconButton 
                    icon={<EditIcon onClick={onOpen} />} 
                    colorScheme="blue"

                />
                <IconButton 
                    icon={<DeleteIcon />} 
                    colorScheme="red"
                    onClick={() => HandleDeleteProducts(product._id)}
                />
            </HStack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Product</ModalHeader>
                    <ModalBody>
                        <VStack>

                            <Input 
                                placeholder='product name...'
                                type='text'
                                name='name'
                                defaultValue={product.name}
                                onChange={(e) => setupdated({...updated, name: e.target.value})}
                                
                            />
            
                            <Input 
                                placeholder='product price...'
                                type='number'
                                name='price'
                                defaultValue={product.price}
                                onChange={(e) => setupdated({...updated, price: e.target.value})}
                                
                            />
                            
                            <Input 
                                placeholder='product image...'
                                name='image'
                                defaultValue={product.image}
                                onChange={(e) => setupdated({...updated, image: e.target.value})}
                                
                            />

                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={() => HandleUpdatedProducts(updated._id,updated)}
                        >
                            update
                        </Button>

                        <Button
                            variant={"ghost"}
                            onClick={onClose}
                        >
                            cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>
         </Box>
        
    </Box>
  )
}

export default ProductCard
