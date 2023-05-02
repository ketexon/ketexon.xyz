import * as React from "react"
import { ThemeProvider, styled } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';

import Container from "@mui/material/Container";

import theme from "../style/theme";
import NavBar from "../components/NavBar";

import { MDXProvider } from "@mdx-js/react";
import type { MDXComponents } from "mdx/types";

import "../stylesheets/next.scss"

const components: MDXComponents = {
	wrapper: Container
}

export default function App({ Component, pageProps }){
	return <>
		<MDXProvider components={components}>
			<CssBaseline/>
			<ThemeProvider theme={theme}>
				<NavBar/>
				<Component {...pageProps}/>
			</ThemeProvider>
		</MDXProvider>
	</>
}