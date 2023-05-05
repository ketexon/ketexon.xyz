import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import * as React from "react"

import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"

export type CollectionPageProps = {
	source: MDXRemoteSerializeResult,
	data: {[k: string]: any}
}

export function CollectionPage({source, data}: CollectionPageProps) {
	return (
		<Container>
			<Typography variant="h1">
				{data.title}
			</Typography>
			<MDXRemote {...source} >
			</MDXRemote>
		</Container>
	)
}