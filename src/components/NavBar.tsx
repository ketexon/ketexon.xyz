import * as React from "react";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Typography  from "@mui/material/Typography";
import { FlexboxProps } from "@mui/system";
import Box  from "@mui/material/Box";

import { styled, SxProps, Theme } from "@mui/material/styles"

import Link from "next/link";
import Button, {ButtonProps} from "@mui/material/Button";

export type NavBarProps = {

}

function NavBarButton({children, ...props}: ButtonProps){
	return <Button
		disableRipple={props.disableRipple ?? true}
		LinkComponent={props.LinkComponent ?? Link}
		{...props}
	>
		<Typography variant="h6">
			{children}
		</Typography>
	</Button>
}

type NavbarColumnProps = {

} & FlexboxProps

function NavBarColumn({children, ...rest}: React.PropsWithChildren<NavbarColumnProps>){
	return (
		<Box sx={theme => ({
			height: "inherit",
			flexGrow: 1,
			paddingTop: theme.spacing(1),
			paddingBottom: theme.spacing(1),
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			...rest
		})}>
			{children}
		</Box>
	)
}

export default function NavBar({}: NavBarProps){
	return <AppBar component="nav" position="sticky">
		<Toolbar sx={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)"}}>
			<div/>
			<NavBarColumn>
				<Button LinkComponent={Link} href="/" disableElevation disableRipple>
					<Typography variant="h3" fontFamily="Bebas Neue" sx={theme => ({
						"--letterSpacing": "1rem",
						letterSpacing: "var(--letterSpacing)",
						marginRight: "calc(-1*var(--letterSpacing))",
						transition: theme.transitions.create(["letter-spacing", "margin-right"], {
							duration: theme.transitions.duration.standard
						}),
						"&:hover": {
							"--letterSpacing": "1.1rem",
						}
					})}>
						Ketexon
					</Typography>
				</Button>
			</NavBarColumn>
			<NavBarColumn justifyContent="end">
				<NavBarButton href="/math">
					Math
				</NavBarButton>
			</NavBarColumn>
		</Toolbar>
	</AppBar>
}