import { GetStaticPathsContext, GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from "next"
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote"
import * as React from "react"

export type MathDefinitionProps = {
	source: MDXRemoteSerializeResult,
	data: {[k: string]: any}
}

export default function MathDefinition({source, data}: MathDefinitionProps) {
	return (
		<MDXRemote {...source}>
			Hi
		</MDXRemote>
	)
}

import { serialize } from "~/mdx/serialize"
import matter from "gray-matter"

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<MathDefinitionProps>> {
	const file = context.params!.file! as string;
	const mdx = matter((await import(`./${file}.mdx`)).default);
	if(mdx.data.published === false){
		return {
			notFound: true,
		}
	}
	return {
		props: {
			source: await serialize(mdx.content),
			data: mdx.data
		},
	}
}

import walk from "~/util/walk";
import resolvePage from "~/util/resolvePage";
import path from "node:path";

export async function getStaticPaths(context: GetStaticPathsContext): Promise<GetStaticPathsResult> {
	const files = (await walk(resolvePage("math/definitions")))
		.filter(filename => path.extname(filename) === ".mdx")
		.map(filename => path.basename(filename, path.extname(filename)))

	return {
		paths: files.map(filename => ({params: {file: filename}})),
		fallback: false,
	}
}