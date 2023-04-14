import * as React from "react"
import { ThemeProvider, styled } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';

import Box from "@mui/material/Box"

import theme from "../style/theme";
import NavBar from "../components/NavBar";

import "../stylesheets/next.scss"


export default function App({ Component, pageProps }){
	return <>
		<CssBaseline/>
		<ThemeProvider theme={theme}>
			<NavBar/>
			<Component {...pageProps}/>
		</ThemeProvider>
	</>
}