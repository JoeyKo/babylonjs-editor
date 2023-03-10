// 1. import `extendTheme` function
import { extendTheme, withDefaultColorScheme, withDefaultProps, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme(
  {
    config,
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