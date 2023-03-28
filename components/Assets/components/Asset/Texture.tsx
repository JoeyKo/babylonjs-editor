import { Text, Image, Stack, Box } from "@chakra-ui/react"

const AssetTexture = ({
  name,
  filename
}: {
  name: string;
  filename: string;
}) => {
  
  return (
    <Stack spacing={1} w="100px" align="center" overflow={"hidden"}>
      <Box w="64px" h="64px" pos="relative">
        <Image boxSize={"64px"} objectFit="fill" src={filename} alt={name} />
      </Box>
      <Text maxW={"100px"} fontSize={"xs"} noOfLines={1} textAlign="center">{name}</Text>
    </Stack>
  )
}

export default AssetTexture;