import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import * as React from "react"

import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import Head from "next/head"

export type PageProps = {
	source: MDXRemoteSerializeResult,
	data: {[k: string]: any}
}

export function Page({source, data}: PageProps) {
	return (
		<>
			<Head>
				<title>{`${data.title ? data.title + " | " : ""} Ketexon`}</title>
				{data.description && <meta name="description" content={data.description}/>}
				{data.keywords && <meta name="keywords" content={data.keywords}/>}
				<meta name="author" content={data.author || "Zane Clark"}/>
			</Head>
			<Container sx={{pb: 4}}>
				<Typography variant="h1">
					{data.title}
				</Typography>
				<MDXRemote {...source} >
				</MDXRemote>
			</Container>
		</>
	)
}