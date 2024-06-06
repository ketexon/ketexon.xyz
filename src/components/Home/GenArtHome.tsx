import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import * as React from "react"
import { Lines } from "./GenArtHome/Lines";
import { Artwork, ArtworkCustomParameter } from "./GenArtHome/Artwork";
import CustomParameterDisplay from "./GenArtHome/CustomParameterDisplay";

const UPDATE_INTERVAL = 1;
const DRAWS_PER_ITER = 5;

export default function(){
	const rootRef = React.useRef<HTMLDivElement>(null);
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const artworkRef = React.useRef<Artwork>();

	const [parameters, setParameters] = React.useState<ArtworkCustomParameter[]>([])
	const [uncommittedParameterValues, setUncommittedParameterValues] = React.useState<{ [k:string]: any}>({});
	const [parameterValues, setParameterValues] = React.useState<{ [k:string]: any}>({});

	React.useEffect(() => {
		const canvas = canvasRef.current;

		if(canvas){
			const artwork = new Lines({
				canvas: canvas,
				ctx: canvas.getContext("2d")!,
				offset: [0, 0],
				size: [canvas.width, canvas.height],
			});

			artworkRef.current = artwork;

			setParameters(artwork.customParameterTypes);

			const defaultParameters = Object.fromEntries(artwork.customParameterTypes.map((p) => {
				const { key, type } = p;
				if(type === "number" || type === "color") {
					return [key, p.default];
				}
				else{
					throw "Unknown type";
				}
			}));

			setParameterValues({ ...defaultParameters })
			setUncommittedParameterValues({ ...defaultParameters })
		}
	}, [canvasRef])

	React.useEffect(() => {
		const artwork = artworkRef.current!;

		for(const [k, v] of Object.entries(parameterValues)){
			artwork.setCustomParameter(k, v);
		}

		artwork.init();

		const interval = setInterval(() => {
			if(!artwork.finished){
				artwork.update();
			}
		}, UPDATE_INTERVAL);

		return () => {
			clearInterval(interval);
		}
	}, [parameters, parameterValues])

	return <Stack height="100%" alignItems="center" justifyContent="center" ref={rootRef}>
		<Stack>
			<canvas width="500" height="500" ref={canvasRef}></canvas>
			<Stack component="section" gap={1}>
				<Typography variant="h4" component="h1">Controls</Typography>
				<Stack direction="row" rowGap={1} columnGap={4} maxWidth="500px" flexWrap="wrap">
				{
					parameters.map((p) => (
						<CustomParameterDisplay parameter={p} values={parameterValues} setValues={setParameterValues} />
					))
				}
				</Stack>
				<Stack direction="row" gap={2}>
					<Button
						variant="contained"
						onClick={() => {
							artworkRef.current?.init();
						}}
					>
						Reset
					</Button>
					<Button
						component="a"
						href="" download
						variant="contained"
						onClick={function (e) {
							if(canvasRef.current){
								(e.target as HTMLAnchorElement).href = canvasRef.current.toDataURL("image/png");
							}
							else{
								e.preventDefault();
							}
						}}
					>
						Download
					</Button>
				</Stack>
			</Stack>
		</Stack>
	</Stack>
}