import React from 'react';
import {
  Box,
  HStack,
  Input,
  Text
} from "@chakra-ui/react"

function InspectorInput({
  label
}: {
  label: string
}) {
  return (
    <HStack spacing={2}>
      <Text w="25%" noOfLines={1} as="p" fontSize="xs">{label}</Text>
      <Box flex={1}>
        <Input size="xs" variant="filled" />
      </Box>
    </HStack>
  )
}

export default InspectorInput;