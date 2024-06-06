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
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { CopyClipboardButton, CopyClipboardSnackbar } from "~/components/CopyClipboard";

export type NavBarProps = {}


export default function Footer({}: NavBarProps){
	const [snackbarOpen, setSnackbarOpen] = React.useState(false);

	const email = "zane.a.s.clark@gmail.com"
	return (
		<>
			<Paper component="footer" square sx={theme => ({ py: 2, width: "100%",})}>
				<CopyClipboardSnackbar open={snackbarOpen} setOpen={setSnackbarOpen}/>
				<Container maxWidth="lg" sx={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
					<Box>
						<Typography variant="body1">Zane Aubrey Clark</Typography>
						<Typography variant="body1">
							<Link href={`mailto:${email}`}>{email}</Link>
							<CopyClipboardButton text={email} setSnackbarOpen={setSnackbarOpen}/>
						</Typography>
					</Box>
					<Box>
						<Box sx={{
							display: "flex",
							width: "100%",
							justifyContent: "flex-end",
							"> *": {
								flexGrow: 1,
								textAlign: "center",
								maxWidth: "128px"
							}
						}}>
							<Box><IconButton disableRipple component={NextLink} href="https://github.com/ketexon" target="_blank" rel="noopenner"><GitHubIcon fontSize="large"/></IconButton></Box>
							<Box><IconButton disableRipple component={NextLink} href="https://www.linkedin.com/in/ketexon/" target="_blank" rel="noopenner"><LinkedInIcon fontSize="large"/></IconButton></Box>
							{/* <Box><IconButton disableRipple component={NextLink} href="https://www.youtube.com/channel/UCli-MHrym5Vjk0ai4m1EBpQ" target="_blank" rel="noopenner"><YouTubeIcon fontSize="large"/></IconButton></Box> */}
						</Box>
					</Box>
				</Container>
			</Paper>
		</>
	)
}