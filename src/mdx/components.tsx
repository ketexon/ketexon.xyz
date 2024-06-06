import type { MDXComponents } from "mdx/types";

import Typography, {TypographyProps} from "@mui/material/Typography"
import Link from "@mui/material/Link"
import theme from "~/style/theme";
import Demo from "~/pages/blog/cross-hatching-demo/Demo";

function TypographyVariant(variant: TypographyProps["variant"]){
	return ({children}) => <Typography variant={variant} sx={{ mb: 2 }}>{children}</Typography>
}



export const components: MDXComponents = {
	...Object.fromEntries([1,2,3,4].map(
		variant => [`h${variant}`, TypographyVariant(`h${variant + 1}` as TypographyProps['variant'])]
	)),
	p: TypographyVariant("body1"),
	a: ({children, rel, href, target}) => <Link {...{rel, href, target}}>{children}</Link>,
	img: ({ src, alt }) => <img src={src} alt={alt} style={{ maxWidth: "100%", marginBottom: theme.spacing(1), marginTop: theme.spacing(1) }}/>,
	CrossHatchingDemo: Demo
}