import * as React from "react";

import NextLink from "next/link"

import IconButton from "@mui/material/IconButton"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export type BackButtonProps = {
	href: string,
}

export default function BackButton({ href }: BackButtonProps){
	return (
		<IconButton color="primary" size="small"
			href={href} LinkComponent={NextLink}
			sx={theme => ({
			position: "absolute",
			right: "100%",
			my: "auto",
			mr: theme.spacing(2),
			width: theme.spacing(6),
			height: theme.spacing(6),
			aspectRatio: 1,
			top: 0,
			bottom: 0,
		})}><ArrowBackIcon/></IconButton>
	)
}