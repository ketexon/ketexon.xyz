import * as React from "react";

import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import NextLink from "next/link"

export type LinkProps = MuiLinkProps & {
	blank?: boolean,
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({blank, ...props}: LinkProps, ref) => (
	<MuiLink component={NextLink}
		ref={ref}
		{...{
			...props,
			...blank ? {target: "_blank"} : {}
		}}
	/>
));

export default Link;