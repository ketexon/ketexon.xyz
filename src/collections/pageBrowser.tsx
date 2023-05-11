import * as React from "react"

import Head from "next/head";
import NextLink from "next/link";

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { PageBrowserPage } from "./pageBrowserBackend";
export type { PageBrowserPage }

export type PageBrowserProps = {
	title: string,
	pages: PageBrowserPage[],
	dir: string,
}

const dateTimeFormat = new Intl.DateTimeFormat(
	"en-BR",
	{
		dateStyle: "long"
	}
)

export function PageBrowser({title, pages, dir}: PageBrowserProps){
	return (
		<Container>
			<Head>
				<title>{title}</title>
			</Head>
			<Typography variant="h1">
				{title}
			</Typography>
			<Paper>
				<List disablePadding>
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
									secondary={<>
										<Typography component="span">
											{page.matter.data.description}
										</Typography>
										<Typography component="span" variant="body2" fontStyle="italic">
											{page.matter.data.date && dateTimeFormat.format(new Date(page.matter.data.date))}
										</Typography>
									</>}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Paper>
		</Container>
	)
}