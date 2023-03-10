import { Text, Image, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react";

const AssetTexture = ({
  name,
  filename
}: {
  name: string;
  filename: File;
}) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      setSrc(e.target.result)
    };

    reader.readAsDataURL(filename);
  }, [filename]);

  return (
    <Stack spacing={1} w="100px" align="center" overflow={"hidden"}>
      <Image width={'64px'} objectFit='cover' src={src} alt={name} />
      <Text maxW={"100px"} fontSize={"xs"} noOfLines={1} textAlign="center">{name}</Text>
    </Stack>
  )
}

export default AssetTexture;