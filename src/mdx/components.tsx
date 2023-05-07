import type { MDXComponents } from "mdx/types";

import Typography, {TypographyProps} from "@mui/material/Typography"
import Link from "@mui/material/Link"

function TypographyVariant(variant: TypographyProps["variant"]){
	return ({children}) => <Typography variant={variant}>{children}</Typography>
}

export const components: MDXComponents = {
	...Object.fromEntries([1,2,3,4].map(
		variant => [`h${variant}`, TypographyVariant(`h${variant + 1}` as TypographyProps['variant'])]
	)),
	p: TypographyVariant("body1"),
	a: ({children, rel, href, target}) => <Link {...{rel, href, target}}>{children}</Link>,
}