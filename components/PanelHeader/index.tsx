import { Box, Flex, Heading, HStack, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDroprightCircle } from "react-icons/io";

function PanelHeader({
  title,
  content
}: {
  title: string;
  content?: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  function handleCollapse() {
    setCollapsed(!collapsed)
  }
  return (
    <HStack
      h={"32px"}
      px={2}
      bg="gray.900"
      boxShadow='base'
      onClick={() => handleCollapse()}>
      <HStack spacing={1} cursor="pointer">
        <Icon fontSize={"md"} as={collapsed ? IoMdArrowDroprightCircle : IoMdArrowDropdownCircle} />
        <Heading noOfLines={1} as="h4" fontSize="xs">{title}</Heading>
      </HStack>
      <Box flex={1}>
        {content}
      </Box>
    </HStack>
  )
}

export default PanelHeader;