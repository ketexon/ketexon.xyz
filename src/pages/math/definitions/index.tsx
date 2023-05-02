import { GetStaticPropsContext, GetStaticPropsResult } from "next"
import * as React from "react"
import Link from "next/link";

type Page = {
	filename: string,
	matter: Omit<matter.GrayMatterFile<any>, "content" | "orig">
}

export type DefinitionsProps = {
	pages: Page[],
}

export default function Definitions({pages}: DefinitionsProps){
	return (
		<div>{pages.map((page: Page, i) => (
			<Link
				key={i}
				href={`definitions/${page.filename}`}
			>{page.matter.data.title || ""}</Link>
		))}</div>
	)
}

import walk from "~/util/walk"
import resolvePage from "~/util/resolvePage"
import path from "node:path"
import matter from "gray-matter"

import omit from "~/util/omit";

export async function getStaticProps({}: GetStaticPropsContext): Promise<GetStaticPropsResult<DefinitionsProps>> {
	const definitions = (await Promise.all(
			(await walk(resolvePage("math/definitions")))
				.filter(filename => path.extname(filename) === ".mdx")
				.map((filename): Promise<Page> =>
					import(`~/pages/math/definitions/${path.basename(filename)}`).then(
						mod => ({
							filename: path.basename(filename, path.extname(filename)),
							matter: omit(matter(mod.default), "content", "orig"),
						})
					)
				)
		)).filter(({matter}) => matter.data.published !== false)

	return {
	  props: {
		pages: definitions
	  },
	}
  }