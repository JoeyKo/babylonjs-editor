"use client";

import './globals.scss'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'
import { createStandaloneToast } from '@chakra-ui/toast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            {children}
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}
