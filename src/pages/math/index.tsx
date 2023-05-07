import * as React from "react";

import Container from "@mui/material/Container"
import { GetStaticPropsContext, GetStaticPropsResult } from "next";

import { walkCollectionPages, CollectionBrowserPage } from "~/collections/browserBackend";

type Collection = {
	title: string,
	dir: string,
	pages: CollectionBrowserPage[]
}

type MathProps = {
	collections: Collection[]
}

export default function Math({}: MathProps) {
	return (
		<Container>

		</Container>
	)
}

export async function getStaticProps({}: GetStaticPropsContext): Promise<GetStaticPropsResult<MathProps>> {
	const dirs = ['math/definitions']
	return {
		props: {
			// collections: (await Promise.all(dirs.map(dir => walkCollectionPages(dir)))).map(
			// 	pages => pages
			// )
			collections: []
		}
	}
}