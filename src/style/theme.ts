import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const backgroundColor = "#fff"

import Link from 'next/link';

// Fonts
import "@fontsource/bebas-neue"
import "@fontsource/open-sans/variable.css"
import "@fontsource/open-sans/variable-italic.css"

export default responsiveFontSizes(createTheme({
	palette: {
		primary: {
			main: "#ED3266"
		}
	},
	typography: {
		fontFamily: '"Open Sans",sans-serif',
		h1: {
			fontSize: "2.5rem",
			fontWeight: "bolder",
			lineHeight: 2,
		},
		h2: {
			fontSize: "2rem",
			fontWeight: "bold",
			lineHeight: 1.5,
		},
		h3: {
			fontSize: "1.75rem",
			fontWeight: "bold",
			lineHeight: 1.5,
		},
		h4: {
			fontSize: "1.5rem",
			fontWeight: "bold",
			lineHeight: 1.5,
		},
		h5: {
			fontSize: "1.25rem",
			fontWeight: "bold",
		},
		h6: {
			fontSize: "1.25rem",
			fontWeight: "inherit",
		},
	},
	components: {
		MuiToolbar: {
			styleOverrides: {
				root: {
					minHeight: "64px",
					height: "64px",
					backgroundColor: backgroundColor
				}
			}
		},
	}
}))