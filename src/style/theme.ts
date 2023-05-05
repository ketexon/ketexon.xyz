import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const backgroundColor = "#fff"

import Link from 'next/link';

export default responsiveFontSizes(createTheme({
	palette: {
		primary: {
			main: "#ED3266"
		}
	},
	typography: {
		fontFamily: '"Open Sans",sans-serif',
		h1: {
			fontSize: "3rem",
			fontWeight: "bold",
		},
		h2: {
			fontSize: "2.5rem",
			fontWeight: "bold",
		},
		h3: {
			fontSize: "2rem",
			fontWeight: "bold",
		},
		h4: {
			fontSize: "1.75rem",
			fontWeight: "bold",
		},
		h5: {

		},
		h6: {

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