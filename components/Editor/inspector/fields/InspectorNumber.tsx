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
        <NumberInput size="xs" variant="filled">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper fontSize={"3xs"} />
            <NumberDecrementStepper  fontSize={"3xs"} />
          </NumberInputStepper>
        </NumberInput>
      </Box>
    </HStack>
  )
}

export default InspectorNumber;