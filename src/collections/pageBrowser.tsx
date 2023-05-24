import * as React from "react"

import Head from "next/head";
import NextLink from "next/link";

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import PushPinIcon from '@mui/icons-material/PushPinOutlined';

import format from "~/util/normalizeDate";

import { PageBrowserPage } from "./pageBrowserBackend";
export type { PageBrowserPage }

export type PageBrowserProps = {
	title: string,
	pages: PageBrowserPage[],
	pinnedPages: PageBrowserPage[],
	dir: string,
}

type PageBrowserListProps = {
	pages: PageBrowserPage[],
	dir: string,
	pinned?: boolean
}

function PageBrowserList({pages, dir, pinned}: PageBrowserListProps){
	pinned = pinned === true
	return (
		<Paper sx={{mb: pinned && 2 || 0}}>
			<List
				disablePadding
				subheader={
					pinned && (
						<ListSubheader sx={{py: 1}}>
							<Typography variant="subtitle1" fontStyle="italic">
								<PushPinIcon fontSize="small" sx={{
									transform: "scale(0.6) rotate(-45deg)",
									verticalAlign: "text-bottom"
								}}/>
								Pinned
							</Typography>
						</ListSubheader>
					)
				}
			>
				{pages.map((page: PageBrowserPage, i) => (
					<ListItem
						key={i}
						disablePadding
					>
						<ListItemButton
							href={`/${dir}/${page.filename}`}
							component={NextLink}
							disableTouchRipple
						>
							<ListItemText
								primary={page.matter.data.title}
								secondary={
									<>
										<Typography component="span" variant="subtitle1">
											{page.matter.data.description}
										</Typography>
										<Typography component="span" variant="subtitle2" fontStyle="italic">
											{page.matter.data.date && format(page.matter.data.date)}
										</Typography>
									</>
								}
							/>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Paper>
	)
}

export function PageBrowser({title, pages, pinnedPages, dir}: PageBrowserProps){
	return (
		<Container sx={{pb: 4}}>
			<Head>
				<title>{title}</title>
			</Head>
			<Typography variant="h1">
				{title}
			</Typography>
			{ pinnedPages.length > 0 && <PageBrowserList pages={pinnedPages} dir={dir} pinned/>}
			<PageBrowserList pages={pages} dir={dir}/>
		</Container>
	)
}