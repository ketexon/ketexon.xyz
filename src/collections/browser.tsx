import * as React from "react"

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
}

export function CollectionBrowser({title, pages}: CollectionBrowserProps){
	return (
		<Container>
			<Typography variant="h1">
				{title}
			</Typography>
			{pages.map((page: CollectionBrowserPage, i) => (
				<Link
					key={i}
					href={`definitions/${page.filename}`}
				>{page.matter.data.title || ""}</Link>
			))}
		</Container>
	)
}