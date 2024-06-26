import * as React from "react";

import Head from "next/head";
import NextLink from "next/link";

import { css } from "@emotion/react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import CardActionArea from "@mui/material/CardActionArea"
import CardActions from "@mui/material/CardActions"

import { PageBrowserPage } from "~/collections/pageBrowserBackend";

import Title from "~/components/Title";
import PageList from "./pageList";

export type Collection = {
	title: string,
	dir: string,
	pages: PageBrowserPage[],
	lg?: number,
	md?: number,
	xs?: number,
}

export type CollectionBrowserProps = {
	title: string,
	collections: Collection[],
	children?: React.ReactNode,
	disableTitle?: boolean,
	disableContainer?: boolean,
}

export function CollectionBrowser({collections, title, children, disableTitle, disableContainer}: CollectionBrowserProps) {
	disableTitle ??= false;
	disableContainer ??= false;
	const nCollections = collections.length;

	const CollectionBrowserContainer =
		disableContainer
			? (
				({ children }) => <>{children}</>
			)
			: (
				({ children }) => <Container>{children}</Container>
			)

	return (
		<CollectionBrowserContainer>
			<Title>{title}</Title>
			{ disableTitle || <Typography variant="h1">
				{title}
			</Typography>
			}
			{children && <Box mb={2}>{children}</Box>}
			<Grid2 container spacing={2} pb={2}>
				{
					collections.map(({ dir, title, pages, lg, md, xs }, idx) => (
						<Grid2 key={idx} lg={lg ?? 4} md={md ?? 6} xs={xs ?? 12}>
							<Card>
								<CardActionArea
									href={dir}
									component={NextLink}
									disableRipple
								>
									<CardContent>
										<Typography variant="h2">
											{title}
										</Typography>
									</CardContent>
								</CardActionArea>
								<CardActions sx={{p: 0}}>
									<PageList pages={pages} dir={dir} />
								</CardActions>
							</Card>
						</Grid2>
					))
				}
			</Grid2>
		</CollectionBrowserContainer>
	)
}