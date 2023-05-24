import * as React from "react";

import Head from "next/head";
import NextLink from "next/link";

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { PageBrowserPage } from "~/collections/pageBrowserBackend";

import format from "~/util/normalizeDate";

type Collection = {
	title: string,
	dir: string,
	pages: PageBrowserPage[]
}

export type CollectionBrowserProps = {
	title: string,
	collections: Collection[]
}

export function CollectionBrowser({collections, title}: CollectionBrowserProps) {
	return (
		<Container>
			<Head>
				<title>{title}</title>
			</Head>
			<Typography variant="h1">
				{title}
			</Typography>
			<Grid2 container spacing={2}>
				{
					collections.map((collection, idx) => (
						<Grid2 key={idx} lg={4} md={6} xs={12}>
							<Card>
								<CardActionArea
									href={collection.dir}
									component={NextLink}
									disableRipple
								>
									<CardContent>
										<Typography variant="h2">
											{collection.title}
										</Typography>
									</CardContent>
								</CardActionArea>
								<CardActions sx={{p: 0}}>
									<List
										sx={{flexGrow: 1}}
										disablePadding
									>
									{
										collection.pages.map((page, idx) => (
											<ListItem
												key={idx}
												disableGutters
												disablePadding
											>
												<ListItemButton
													component={NextLink}
													href={`/${collection.dir}/${page.filename}`}
													disableTouchRipple
												>
													<ListItemText
														primary={page.matter.data.title ?? ""}
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
										))
									}
									</List>
								</CardActions>
							</Card>
						</Grid2>
					))
				}
			</Grid2>
		</Container>
	)
}