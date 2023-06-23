import * as React from "react"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Title from "~/components/Title";

type LayerProps = {
	variant?: boolean,
}

const Layer = React.forwardRef<HTMLDivElement, LayerProps>(
	({variant}, ref) => {
		return <Box
			ref={ref}
			sx={theme => ({
				position: "absolute",
				width: "100%",
				height: "100%",

				display: "flex",
				justifyContent: "center",
				alignItems: "center",

				userSelect: "none",

				backgroundColor: variant ? theme.palette.secondary.main : theme.palette.primary.main,

				pointerEvents: variant ? "none" : null,
				zIndex: variant ? 1 : null,
			})}
		>
			<Box sx={theme => ({ textAlign: "center", color: variant ? theme.palette.primary.main : theme.palette.secondary.main })}>
				<Typography
					variant="h1"
					sx={theme => ({
						fontFamily: "Bebas Neue",
						letterSpacing: 4,
						lineHeight: 1,
						textShadow: `-0.25rem 0.25rem 0 rgba(0, 0, 0, 0.2)`,
					})}
					style={{
						fontSize: "4rem",
					}}
				>
					Hi, I'm ketexon
				</Typography>
				<Typography
					variant="h2"
					sx={theme => ({
						lineHeight: 1,
						pt: theme.spacing(2),
						textShadow: `-0.1rem 0.1rem 0 rgba(0, 0, 0, 0.2)`,
					})}
					style={{
						fontSize: "1.25rem",
					}}
				>
					This section is a work in progress.<br/>
					Check back to see cool updates ;)
				</Typography>
			</Box>
		</Box>
	}
);

export default function KetexonHome(){
	const containerRef = React.createRef<HTMLDivElement>();
	const cursorRef = React.createRef<HTMLDivElement>();

	React.useEffect(() => {
		if(!containerRef.current || !cursorRef.current) return;
		const cursor = cursorRef.current!;
		const container = containerRef.current!;

		container.addEventListener("mousemove", onMouseMove);
		return () => {
			container.removeEventListener("mousemove", onMouseMove);
		}

		function onMouseMove(e: MouseEvent){
			cursor.style.display = "flex";
			cursor.style.clipPath = `circle(4rem at ${e.clientX}px calc(${e.clientY}px - 4rem))`;
		}
	})

	return <Box sx={theme => ({
		position: "relative",
		width: "100%",
		height: "100%",
		overflow: "hidden",
		backgroundColor: theme.palette.secondary.main,

		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	})}>
		<Title/>
		<Layer ref={cursorRef} variant/>
		<Layer ref={containerRef}/>
	</Box>
}