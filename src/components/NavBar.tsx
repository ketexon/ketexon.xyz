import * as React from "react";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Typography  from "@mui/material/Typography";
import { FlexboxProps, DisplayProps } from "@mui/system";
import Box  from "@mui/material/Box";

import { styled, SxProps, Theme, useTheme } from "@mui/material/styles"

import Link from "next/link";
import Button, {ButtonProps} from "@mui/material/Button";

import { useCookies } from "react-cookie";

type NavBarButtonProps = {
} & ButtonProps

function NavBarButton({children, ...props}: NavBarButtonProps){
	return <Button
		disableRipple={props.disableRipple ?? true}
		LinkComponent={props.LinkComponent ?? Link}
		{...props}
	>
		<Typography
			variant="h6"
			fontWeight="bold"
			sx={{
				backgroundImage: "var(--background-gradient)",
				backgroundClip: "text",
				color: "transparent",
				backgroundPosition: "bottom calc((2 * var(--logo-cycle) + var(--logo-hovered)) * 16px) right 0"
			}}
		>
			{children}
		</Typography>
	</Button>
}

type NavbarColumnProps = {
	opacity?: number
} & FlexboxProps & DisplayProps

function NavBarColumn({children, opacity, ...rest}: React.PropsWithChildren<NavbarColumnProps>){
	return (
		<Box sx={theme => ({
			...rest,
			height: "inherit",
			flexGrow: rest.flexGrow ?? 1,
			paddingTop: theme.spacing(1),
			paddingBottom: theme.spacing(1),
			display: rest.display ?? "flex",
			alignItems: rest.alignItems ?? "center",
			justifyContent: rest.justifyContent ?? "center",
			opacity,
		})}>
			{children}
		</Box>
	)
}

export type NavBarProps = {}


export default function NavBar({}: NavBarProps){
	const [logoCycle, setLogoCycle] = React.useState(0);
	const [logoHovered, setLogoHovered] = React.useState(false);
	console.log(logoHovered)
	const remPerLogoCycle = 2.75/2;
	return (
		<>
			<AppBar component="nav" position="sticky">
				<Toolbar sx={theme => ({
					"--logo-cycle": `${logoCycle}`,
					"--logo-hovered": logoHovered ? 1 : 0,
					"--background-gradient": `linear-gradient(
						0deg,
						${theme.palette.primary.main} 0%,
						${theme.palette.primary.main} 50%,
						${theme.palette.secondary.main} 50%,
						${theme.palette.secondary.main} 100%
					)`,
					display: "grid",
					gridTemplateColumns: "repeat(3, 1fr)",
					transition: theme.transitions.create(["background-position"], {
						duration: theme.transitions.duration.standard
					}),
					backgroundImage: "var(--background-gradient)",
					backgroundPosition: "bottom calc(var(--logo-cycle) * 32px + 32px + 32px * var(--logo-hovered)) right 0",
				})}>
					<div/>
					<NavBarColumn>
						<Button
							disableElevation disableRipple
							LinkComponent={Link}
							href="/"
							onClick={() => setLogoCycle(logoCycle + 1)}
							onPointerEnter={() => setLogoHovered(true)}
							onPointerLeave={() => setLogoHovered(false)}
						>
							<Typography variant="h3" fontFamily="Bebas Neue" sx={theme => ({
								"--letter-spacing": "calc(1rem + var(--logo-hovered) * 0.1rem)",
								"--rem-per-logo-cycle": `${remPerLogoCycle}rem`,
								letterSpacing: "var(--letter-spacing)",
								marginRight: "calc(-1*var(--letter-spacing))",
								transition: theme.transitions.create(["letter-spacing", "margin-right", "background-position"], {
									duration: theme.transitions.duration.standard
								}),
								backgroundPosition: "bottom calc(var(--rem-per-logo-cycle)*(var(--logo-cycle) + var(--logo-hovered))) right 0",
								// "&:hover": {
								// 	// "--letter-spacing": "1.1rem",
								// 	// backgroundPosition: "bottom calc(var(--rem-per-logo-cycle)*var(--logo-cycle) + 0.75rem) right 0",
								// 	backgroundPosition: "bottom calc(var(--rem-per-logo-cycle)*(var(--logo-cycle) + 1)) right 0",
								// },
								// backgroundImage: `linear-gradient(
								// 	0deg,
								// 	${theme.palette.primary.main} 0%,
								// 	${theme.palette.primary.main} 50%,
								// 	${theme.palette.secondary.main} 50%,
								// 	${theme.palette.secondary.main} 100%
								// )`,
								backgroundImage: "var(--background-gradient)",
								backgroundClip: "text",
								color: "transparent"
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
		</>
	)
}