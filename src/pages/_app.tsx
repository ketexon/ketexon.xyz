import * as React from "react"
import Head from "next/head";

import { ThemeProvider, styled } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';

import Box from "@mui/material/Box";

import theme from "../style/theme";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import { MDXProvider } from "@mdx-js/react";

// Styles
import "../stylesheets/next.css"

import { components } from "~/mdx/components";

//Icon
import Icon from "~/assets/images/Logo/Logo128.ico"

export default function App({ Component, pageProps }){
	return (
		<MDXProvider components={components}>
			<Head>
				<link rel="icon" href={Icon.src}/>
				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
				<meta name="theme-color" content={theme.palette.primary.main}/>
				<meta name="color-scheme" content="only light"/>
				<meta name="creator" content="Zane Clark"/>
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline/>
				<Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
					<NavBar/>
					<Box sx={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
						<Box sx={{flexGrow: 1}}>
							<Component {...pageProps}/>
						</Box>
						<Footer/>
					</Box>
				</Box>
			</ThemeProvider>
		</MDXProvider>
	)
}