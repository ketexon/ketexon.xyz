import * as React from "react";

import IconButton from "@mui/material/IconButton"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export type CopyClipboardButtonProps = {
	setSnackbarOpen: (v: boolean) => void,
	text: string,
}

export function CopyClipboardButton({text, setSnackbarOpen}: CopyClipboardButtonProps){
	const copy = () => {
		navigator.clipboard.writeText(text).then(() => setSnackbarOpen(true))
	}

	return <>
		<IconButton disableRipple onClick={copy}><ContentCopyIcon fontSize="small"/></IconButton>
	</>
}

export type CopyClipboardSnackbarProps = {
	open: boolean,
	setOpen: (v: boolean) => void,
}

export function CopyClipboardSnackbar({open, setOpen}: CopyClipboardSnackbarProps){
	return <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
		<Alert onClose={() => setOpen(false)} severity="success">
			Copied to clipboard
		</Alert>
	</Snackbar>
}