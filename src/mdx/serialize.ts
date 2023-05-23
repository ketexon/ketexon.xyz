import { VFileCompatible } from "vfile";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize as mdxRemoteSerialize } from "next-mdx-remote/serialize";
import { SerializeOptions } from "next-mdx-remote/dist/types";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";

import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";

export async function serialize(source: VFileCompatible, options?: SerializeOptions, rsc?: boolean): Promise<MDXRemoteSerializeResult> {
	return mdxRemoteSerialize(
		source,
		{
			...(options || {}),
			mdxOptions: {
				...(options?.mdxOptions || {}),
				remarkPlugins: [
					...(options?.mdxOptions?.remarkPlugins || []),
					remarkGfm,
					remarkMath,
					remarkToc,
				],
				rehypePlugins: [
					...(options?.mdxOptions?.rehypePlugins || []),
					rehypeKatex,
					[rehypeExternalLinks, {target: '_blank'}],
				],
			}
		},
		rsc
	);
}