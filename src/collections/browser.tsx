import * as React from "react"

import Head from "next/head";
import Link from "next/link";

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography";

import matter from "gray-matter"


export type CollectionBrowserPage = {
	filename: string,
	matter: Omit<matter.GrayMatterFile<any>, "content" | "orig">
}

export type CollectionBrowserProps = {
	title: string,
	pages: CollectionBrowserPage[],
	dir: string,
}

export function CollectionBrowser({title, pages, dir}: CollectionBrowserProps){
	return (
		<Container>
			<Head>
				<title>{title}</title>
			</Head>
			<Typography variant="h1">
				{title}
			</Typography>
			{pages.map((page: CollectionBrowserPage, i) => (
				<Link
					key={i}
					href={`/${dir}/${page.filename}`}
				>{page.matter.data.title || ""}</Link>
			))}
		</Container>
	)
}