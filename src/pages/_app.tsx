import * as React from "react"
import Head from "next/head";

import { ThemeProvider, styled } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';

import Container from "@mui/material/Container";

import theme from "../style/theme";
import NavBar from "../components/NavBar";

import { MDXProvider } from "@mdx-js/react";

// Styles
import "../stylesheets/next.scss"

import { components } from "~/mdx/components";

//Icon
import Icon from "~/assets/images/Logo/Logo128.ico"

export default function App({ Component, pageProps }){
	return (
		<MDXProvider components={components}>
			<Head>
				<link rel="icon" href={Icon.src}/>
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline/>
				<NavBar/>
				<Component {...pageProps}/>
			</ThemeProvider>
		</MDXProvider>
	)
}