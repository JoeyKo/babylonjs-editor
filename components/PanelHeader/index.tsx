import { Box, Heading } from "@chakra-ui/react";

function PanelHeader({
  title,
}: {
  title: string
}) {
  return (
    <Box bg={"blue.500"} py={1} px={2}>
      <Heading as="h4" fontSize="sm">{title}</Heading>
    </Box>
  )
}

export default PanelHeader;