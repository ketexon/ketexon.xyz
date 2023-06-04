import * as React from "react";

import Head from "next/head";
import Title from "~/components/Title";
import Box from "@mui/material/Box";

import { useTheme } from "@mui/material/styles";
import { initHomeGL } from "~/util/gl/homeGL";


export default function Home(){
	const theme = useTheme();

	const canvasRef = React.createRef<HTMLCanvasElement>();
	const boxRef = React.createRef<HTMLDivElement>();
	React.useEffect(() => {
		if(!canvasRef.current || !boxRef.current) return;
		return initHomeGL(canvasRef.current!, boxRef.current!, theme);
	})

	return <Box position="relative" width="100%" height="100%" overflow="hidden">
		<Title/>
		<Box ref={boxRef} sx={{display: "flex", height: "100%", width: "100%"}}>

		</Box>
		<canvas ref={canvasRef} style={{
			display: "block",
			position: "absolute",
			top: 0,
			left: 0
		}}/>
	</Box>
}