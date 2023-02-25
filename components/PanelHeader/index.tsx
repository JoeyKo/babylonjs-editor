import { Flex, Heading, HStack, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdArrowDropdownCircle, IoMdArrowDroprightCircle } from "react-icons/io";

function PanelHeader({
  title,
}: {
  title: string
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  function handleCollapse() {
    setCollapsed(!collapsed)
  }
  return (
    <Flex
      py={2}
      px={2}
      bg={"gray.800"}
      cursor="pointer"
      onClick={() => handleCollapse()}>
      <HStack>
        <Icon fontSize={"md"} as={collapsed ? IoMdArrowDroprightCircle : IoMdArrowDropdownCircle} />
        <Heading as="h4" fontSize="sm">{title}</Heading>
      </HStack>
    </Flex>
  )
}

export default PanelHeader;