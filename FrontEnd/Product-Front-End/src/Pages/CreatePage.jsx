import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Image,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  IconButton,
} from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { useProductStore } from "../Store/product";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const CreatePage = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingImage, setIsReadingImage] = useState(false);

  const fileInputRef = useRef(null);
  const readerRef = useRef(null);

  const toast = useToast();
  const { createProduct } = useProductStore();

  const bg = useColorModeValue("white", "gray.800");
  const dropBg = useColorModeValue("blue.50", "blue.900");
  const normalBorder = useColorModeValue("gray.300", "gray.600");

  const handleInputFields = (event) => {
    const { name, value } = event.target;

    setProduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImage = (file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid image",
        description: "Only JPG, PNG and WebP images are supported.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Image too large",
        description: "Maximum image size is 2 MB.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    readerRef.current?.abort();

    const reader = new FileReader();
    readerRef.current = reader;

    setIsReadingImage(true);

    reader.onload = () => {
      if (readerRef.current !== reader) return;

      setProduct((previous) => ({
        ...previous,
        image: reader.result,
      }));

      setIsReadingImage(false);
    };

    reader.onerror = () => {
      if (readerRef.current !== reader) return;

      setIsReadingImage(false);

      toast({
        title: "Image error",
        description: "Unable to read the selected image.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    };

    reader.onabort = () => {
      if (readerRef.current === reader) {
        setIsReadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    handleImage(file);
  };

  const removeImage = () => {
    readerRef.current?.abort();
    readerRef.current = null;

    setIsReadingImage(false);

    setProduct((previous) => ({
      ...previous,
      image: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProduct = async () => {
    if (
      !product.name.trim() ||
      !product.image ||
      product.price === "" ||
      !Number.isFinite(Number(product.price)) ||
      Number(product.price) <= 0
    ) {
      toast({
        title: "Missing or invalid fields",
        description: "Enter a name, valid price and image.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const { sucess, message } = await createProduct({
        name: product.name.trim(),
        price: Number(product.price),
        image: product.image,
      });

      toast({
        title: sucess ? "Success" : "Error",
        description: message,
        status: sucess ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });

      if (sucess) {
        setProduct({
          name: "",
          price: "",
          image: "",
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" mt={100}>
      <VStack spacing={8}>
        <Heading as="h1" size="2xl" textAlign="center" mb={8}>
          Create New Product
        </Heading>

        <Box w="full" bg={bg} p={6} rounded="lg" shadow="md">
          <VStack spacing={5}>
            <Input
              placeholder="Product name..."
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputFields}
            />

            <Input
              placeholder="Product price..."
              type="number"
              min={0}
              name="price"
              value={product.price}
              onChange={handleInputFields}
            />

            <Box
              w="full"
              p={8}
              border="2px dashed"
              borderColor={isDragging ? "blue.400" : normalBorder}
              borderRadius="lg"
              bg={isDragging ? dropBg : "transparent"}
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
              <Text fontWeight="bold" mb={2}>
                Drag & Drop your product image
              </Text>

              <Text fontSize="sm" color="gray.500">
                Or click to browse files
              </Text>

              <Text fontSize="xs" color="gray.500" mt={2}>
                JPG, PNG or WebP — Maximum 2 MB
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

            {isReadingImage && (
              <Text color="blue.400">Processing image...</Text>
            )}

            {product.image && (
              <Box
                w="full"
                position="relative"
                borderRadius="lg"
                overflow="hidden"
                borderWidth="1px"
              >
                <Image
                  src={product.image}
                  alt="Product preview"
                  w="full"
                  maxH="250px"
                  objectFit="contain"
                />

                <IconButton
                  aria-label="Remove image"
                  icon={<CloseIcon />}
                  colorScheme="red"
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={removeImage}
                />
              </Box>
            )}

            <Button
              colorScheme="blue"
              onClick={handleProduct}
              w="full"
              isLoading={isLoading}
              loadingText="Creating product..."
              isDisabled={isReadingImage}
            >
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
