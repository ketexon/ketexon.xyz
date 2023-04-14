import { createTheme } from '@mui/material/styles';

const backgroundColor = "#fff"

import Link from 'next/link';

export default createTheme({
	palette: {
		primary: {
			main: "#ED3266"
		}
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
})