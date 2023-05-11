import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import * as React from "react"

import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"

export type PageProps = {
	source: MDXRemoteSerializeResult,
	data: {[k: string]: any}
}

export function Page({source, data}: PageProps) {
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