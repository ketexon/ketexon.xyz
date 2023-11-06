import * as React from "react"

import Head from "next/head";

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import { PageBrowserPage } from "./pageBrowserBackend";
import PageList from "./pageList";
export type { PageBrowserPage }

export type PageBrowserProps = {
	title: string,
	pages: PageBrowserPage[],
	pinnedPages: PageBrowserPage[],
	dir: string,
	backPage?: string,
}

export function PageBrowser({title, pages, pinnedPages, dir, backPage}: PageBrowserProps){
	console.log(backPage)
	return (
		<Container sx={{pb: 4}}>
			<Head>
				<title>{title}</title>
			</Head>
			<Typography variant="h1">
				{title}
			</Typography>
			{ pinnedPages.length > 0 && (
				<Paper sx={{ mb: 2}}><PageList pages={pinnedPages} dir={dir} pinned/></Paper>
			)}
			<Paper>
				<PageList pages={pages} dir={dir}/>
			</Paper>
		</Container>
	)
}