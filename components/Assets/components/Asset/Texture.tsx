import { Box, Image } from "@chakra-ui/react"

const AssetTexture = ({
  name,
  url
}: {
  name: string;
  url: string;
}) => {
  return (
    <Box>
      <Image src={url} alt={name} />
    </Box>
  )
}

export default AssetTexture;