import * as React from "react";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Typography  from "@mui/material/Typography";
import Box  from "@mui/material/Box";

import { styled } from "@mui/material/styles"

import Link from "next/link";
import Button, {ButtonProps} from "@mui/material/Button";

export type NavBarProps = {

}

function NavBarButton({...props}: ButtonProps){
	return <Button
		disableRipple={props.disableRipple ?? true}
		LinkComponent={props.LinkComponent ?? Link}
		{...props}
	/>
}

export default function NavBar({}: NavBarProps){
	return <AppBar component="nav" position="sticky">
		<Toolbar>
			<Box sx={theme => ({height: "inherit", flexGrow: 1, paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1)})}>
				<Link href="/" style={{height: "inherit", flexGrow: 1}}>

				</Link>
			</Box>
			<NavBarButton href="/">
				<Typography variant="h6">
					Hello
				</Typography>
			</NavBarButton>
		</Toolbar>
	</AppBar>
}