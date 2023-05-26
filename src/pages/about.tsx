import * as React from "react";

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Title from "~/components/Title";

export default function About(){
	return (
		<Container maxWidth="md">
			<Title>About</Title>
			<Typography variant="h1">About</Typography>
		</Container>
	)
}