import { Text, Stack, Flex, Icon } from "@chakra-ui/react"
import { AiOutlineFileText } from 'react-icons/ai'
import { FiBox } from "react-icons/fi";
import { IAssetType } from "../../Asset";

const AssetBianry = ({
  name,
  type,
}: {
  name: string;
  type: IAssetType;
}) => {
  function getIconByType() {
    switch (type) {
      case IAssetType.MODELSROUCE:
        return FiBox
      default:
        return AiOutlineFileText;
    }
  }

  return (
    <Stack spacing={1} w="100px" align="center" overflow={"hidden"}>
      <Flex w="64px" h="64px" align={"center"} justify={"center"}>
        <Icon boxSize="32px" as={getIconByType()} />
      </Flex>
      <Text maxW={"100px"} fontSize={"xs"} noOfLines={1} textAlign="center">{name}</Text>
    </Stack>
  )
}

export default AssetBianry;