import { Box } from "@mui/material"
import React from "react"
import { DrawFunction } from "./DrawFunction";

export type ExhibitProps = {
	drawFn: DrawFunction,
	onClick: () => void
}

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;

export default function Exhibit({ onClick, drawFn }: ExhibitProps){
	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	React.useEffect(() => {
		if(!canvasRef.current) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d")!;

		drawFn.init(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, ctx);
		drawFn.draw();
		return () => {
			drawFn.destroy();
		}
	}, [canvasRef]);

	return <Box
		onClick={() => { if(onClick) onClick(); }}
		sx={{
			cursor: "pointer",
			display: "flex",
			p: 1,
			minWidth: 0,
			minHeight: 0,
		}}
	>
		<canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{
			width: "100%",
			height: "100%",
		}}>

		</canvas>
	</Box>
}