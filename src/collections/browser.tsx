import * as React from "react"

import Head from "next/head";
import NextLink from "next/link";

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import matter from "gray-matter"

import { CollectionBrowserPage } from "./browserBackend";
export type { CollectionBrowserPage }

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
			<List>
				{pages.map((page: CollectionBrowserPage, i) => (
					<ListItem
						key={i}
						disablePadding
					>
						<ListItemButton
							href={`/${dir}/${page.filename}`}
							LinkComponent={NextLink}
							disableTouchRipple
						>
							<ListItemText
								primary={page.matter.data.title}
								secondary={page.matter.data.description}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Container>
	)
}