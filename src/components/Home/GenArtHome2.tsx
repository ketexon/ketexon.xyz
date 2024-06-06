import { Box, Container, Stack } from "@mui/material";
import Exhibit from "./GenArtHome2/Exhibit";
import React from "react";
import { drawFunctions } from "./GenArtHome2/DrawFunction";

const N_ROWS = 4;
const N_COLS = 4;

export default function GenArtHome2(){
	const [selected, setSelected] = React.useState<number | null>(null);

	const [rowTemplate, columnTemplate] = React.useMemo(() => {
		if(selected !== null){
			const row = Math.floor(selected / N_ROWS);
			const col = selected % N_COLS;
			return [
				Array.from({ length: N_ROWS }).map((_, i) => i === row ? `1fr` : `0fr`).join(" "),
				Array.from({ length: N_COLS }).map((_, i) => i === col ? `1fr` : `0fr`).join(" "),
			]
		}
		const def = Array.from({ length: N_ROWS }).map((_, i) => `1fr`).join(" ");
		return [def, def];
	}, [selected])

	return (
		<Container maxWidth="md" sx={{
				height: "100%",
				display: "flex", flexDirection: "column",
				justifyContent: "center"
		}}>
			<Stack alignItems="center" justifyContent="center" maxHeight="100%" p={4} sx={{
				aspectRatio: "1 / 1"
			}}>
				<Box sx={theme => ({
					flexGrow: 1,
					aspectRatio: "1 / 1",
					maxHeight: "100%",
					maxWidth: "100%",
					display: "grid",
					gridTemplateRows: rowTemplate,
					gridTemplateColumns: columnTemplate,

					transition: theme.transitions.create(["grid-template-rows", "grid-template-columns"], {
						duration: theme.transitions.duration.shortest,
						easing: theme.transitions.easing.easeInOut,
					})
				})}>
					{
						Array.from({ length: 16 }).map((_, i) => (
							<Exhibit
								key={i}
								onClick={() => { setSelected(cur => cur === null ? i : null); }}
								drawFn={drawFunctions[i]}
							/>
						))
					}
				</Box>
			</Stack>
		</Container>
	)
}