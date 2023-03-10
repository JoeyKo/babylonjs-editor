import { Text, Image, Stack, Box, Progress } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { BiImage } from 'react-icons/bi'

const AssetTexture = ({
  name,
  filename
}: {
  name: string;
  filename: File;
}) => {
  const [src, setSrc] = useState<string>("");
  const [loadedPercent, setLoadedPercent] = useState<number>(0);

  // 或更改为上传进度条
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const reader = new FileReader();

    reader.onprogress = (evt: any) => {
      let _loadedPercent: number = 0;
      if (evt.lengthComputable) {
        _loadedPercent = +(evt.loaded * 100 / evt.total).toFixed();
      } else {
        const dlCount = evt.loaded / (1024 * 1024);
        _loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
      }
      setLoadedPercent(_loadedPercent)
    }

    reader.onload = (evt: any) => {
      setSrc(evt.target.result);
      setLoaded(true);
    };

    reader.readAsDataURL(filename);
  }, [filename]);

  return (
    <Stack spacing={1} w="100px" align="center" overflow={"hidden"}>
      <Box w="64px" h="64px" pos="relative">
        <Image boxSize={"64px"} objectFit="fill" hidden={!loaded} src={src} alt={name} />
        <Progress value={loadedPercent} hidden={loaded}
          w="64px" size='xs' top="50%" transform={'translateY(-50%)'} pos={"absolute"} />
      </Box>
      <Text maxW={"100px"} fontSize={"xs"} noOfLines={1} textAlign="center">{name}</Text>
    </Stack>
  )
}

export default AssetTexture;