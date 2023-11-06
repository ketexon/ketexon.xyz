import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import * as React from "react"


import Typography from "@mui/material/Typography"

import Container, {ContainerProps} from "@mui/material/Container"
import Head from "next/head"
import Title from "~/components/Title"
import BackButton from "~/components/BackButton"

export type PageFrontendOptions = Partial<{
	containerMaxWidth: ContainerProps["maxWidth"],
}>

export type PageProps = {
	dir: string,
	source: MDXRemoteSerializeResult,
	data: {[k: string]: any},
	options: PageFrontendOptions | null
}

export function Page({dir, source, data, options}: PageProps) {
	return (
		<>
			<Title>{`${data.title ? data.title + " | " : ""} Ketexon`}</Title>
			<Head>
				{data.description && <meta name="description" content={data.description}/>}
				{data.keywords && <meta name="keywords" content={data.keywords}/>}
				<meta name="author" content={data.author || "Aubrey Clark"}/>
			</Head>
			<Container sx={{pb: 4}} maxWidth={options?.containerMaxWidth || "md"}>
				<Typography variant="h1" sx={{ position: "relative" }}>
					<BackButton href={`/${dir}`}/>
					{data.title}
				</Typography>
				<MDXRemote {...source} >
				</MDXRemote>
			</Container>
		</>
	)
}