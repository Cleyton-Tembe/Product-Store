import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  useDisclosure,
  Input,
} from "@chakra-ui/react";

import { useProductStore } from "../Store/product";
import { useState, useRef } from "react";

const ProductCard = ({ product }) => {
  const [updated, setUpdated] = useState(product);
  const [isDragging, setIsDragging] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fileInputRef = useRef(null);

  const { deleteProduct, updateProduct } = useProductStore();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textcolor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const handleOpen = () => {
    setUpdated({ ...product });
    onOpen();
  };

  const handleClose = () => {
    setUpdated({ ...product });
    setIsDragging(false);
    onClose();
  };

  const handleImage = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid image",
        description: "Only JPG, PNG and WebP are supported.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Maximum image size is 2 MB.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setUpdated((previous) => ({
        ...previous,
        image: reader.result,
      }));
    };

    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Could not read the selected image.",
        status: "error",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    handleImage(file);
  };

  const handleDeleteProducts = async (id) => {
    try {
      const { sucess, message } = await deleteProduct(id);

      toast({
        title: sucess ? "Success" : "Error",
        description: message,
        status: sucess ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    }
  };

  const handleUpdatedProducts = async () => {
    if (!updated.name.trim() || !updated.price || !updated.image) {
      toast({
        title: "Missing fields",
        description: "Fill all product fields.",
        status: "warning",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const { sucess, message } = await updateProduct(product._id, {
        name: updated.name.trim(),
        price: Number(updated.price),
        image: updated.image,
      });

      toast({
        title: sucess ? "Success" : "Error",
        description: message,
        status: sucess ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });

      if (sucess) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        shadow: "xl",
      }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        h={48}
        w="full"
        objectFit="contain"
      />

      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textcolor} mb={4}>
          {product.price}mt
        </Text>

        <HStack spacing={3}>
          <IconButton
            aria-label="Edit product"
            icon={<EditIcon />}
            colorScheme="blue"
            onClick={handleOpen}
          />

          <IconButton
            aria-label="Delete product"
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={() => handleDeleteProducts(product._id)}
          />
        </HStack>

        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
          <ModalOverlay />

          <ModalContent>
            <ModalHeader>Update Product</ModalHeader>

            <ModalBody>
              <VStack spacing={4}>
                <Input
                  placeholder="Product name..."
                  value={updated.name ?? ""}
                  onChange={(event) =>
                    setUpdated((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                />

                <Input
                  placeholder="Product price..."
                  type="number"
                  min={0}
                  value={updated.price ?? ""}
                  onChange={(event) =>
                    setUpdated((previous) => ({
                      ...previous,
                      price: event.target.value,
                    }))
                  }
                />

                <Box
                  width="100%"
                  padding={6}
                  border="2px dashed"
                  borderColor={isDragging ? "blue.400" : "gray.300"}
                  borderRadius="lg"
                  background={isDragging ? "blue.50" : "transparent"}
                  textAlign="center"
                  cursor="pointer"
                  transition="all 0.2s"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={handleDrop}
                >
                  <Text fontWeight="bold">Drag and drop an image here</Text>

                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Or click to select from your computer
                  </Text>

                  <Text fontSize="xs" color="gray.500" mt={2}>
                    JPG, PNG or WebP — Max 2 MB
                  </Text>

                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    display="none"
                    onChange={(event) => {
                      handleImage(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                </Box>

                {updated.image && (
                  <Box width="100%" textAlign="center">
                    <Image
                      src={updated.image}
                      alt="Product preview"
                      maxHeight="200px"
                      width="100%"
                      objectFit="contain"
                      borderRadius="md"
                    />

                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      mt={3}
                      onClick={() =>
                        setUpdated((previous) => ({
                          ...previous,
                          image: "",
                        }))
                      }
                    >
                      Remove image
                    </Button>
                  </Box>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                isLoading={isUpdating}
                loadingText="Updating..."
                onClick={handleUpdatedProducts}
              >
                Update
              </Button>

              <Button
                variant="ghost"
                onClick={handleClose}
                isDisabled={isUpdating}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default ProductCard;
