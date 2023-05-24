import * as React from "react";

import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography  from "@mui/material/Typography";
import { FlexboxProps, DisplayProps } from "@mui/system";
import Box  from "@mui/material/Box";

import Link from "@mui/material/Link";
import NextLink from "next/link";
import Button, {ButtonProps} from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import ContentCopyIcon from '@mui/icons-material/ContentCopyOutlined';

export type NavBarProps = {}


export default function Footer({}: NavBarProps){
	const email = "zane.a.s.clark@gmail.com"
	const copyEmail = () => {
		navigator.clipboard.writeText(email).then(() => setSnackbarOpen(true))
	}

	const [snackbarOpen, setSnackbarOpen] = React.useState(false);
	const closeSnackbar = () => {setSnackbarOpen(false);};

	return (
		<>
			<Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={closeSnackbar}>
				<Alert onClose={closeSnackbar} severity="success">
					Successfully copied to clipboard
				</Alert>
			</Snackbar>
			<Paper component="footer" square sx={theme => ({ py: 2, width: "100%",})}>
				<Container maxWidth="lg" sx={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
					<Box>
						<Typography variant="body1">Aubrey Clark</Typography>
						<Typography variant="body1">
							<Link href={`mailto:${email}`}>{email}</Link>
							<IconButton disableRipple onClick={copyEmail}><ContentCopyIcon fontSize="small"/></IconButton>
						</Typography>
					</Box>
					<Box>

					</Box>
				</Container>
			</Paper>
		</>
	)
}