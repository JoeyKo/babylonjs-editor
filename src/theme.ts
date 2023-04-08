// 1. import `extendTheme` function
import { extendTheme, withDefaultProps, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const styles = {
  global: {
    'html, body': {
      bg: 'gray.800',
      color: 'gray.50',
    },
  },
}

// 3. extend the theme
const theme = extendTheme(
  {
    config,
    styles
  },
  // withDefaultColorScheme({ colorScheme: 'blue' }),
  withDefaultProps({
    defaultProps: {
      variant: 'filled',
      size: 'xs',
    },
    components: ['Input', 'NumberInput'],
  }),
)

export default theme