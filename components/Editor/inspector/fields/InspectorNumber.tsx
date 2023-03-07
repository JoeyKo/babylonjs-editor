import React from 'react';
import {
  Box,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput, NumberInputField, NumberInputStepper, Text
} from "@chakra-ui/react"

function InspectorNumber({
  label
}: {
  label: string
}) {
  return (
    <HStack spacing={2}>
      <Text w="25%" noOfLines={1} as="p" fontSize="xs">{label}</Text>
      <Box flex={1}>
        <NumberInput size="xs">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper fontSize={"3xs"} color={"gray.100"} />
            <NumberDecrementStepper  fontSize={"3xs"} color={"gray.100"} />
          </NumberInputStepper>
        </NumberInput>
      </Box>
    </HStack>
  )
}

export default InspectorNumber;