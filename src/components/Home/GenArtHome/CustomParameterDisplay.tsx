import { Slider, Stack, TextField, Typography } from "@mui/material";
import { ArtworkCustomParameter } from "./Artwork"
import React from "react";

export type CustomParameterDisplayProps = {
	parameter: ArtworkCustomParameter,
	values: { [k: string]: number | string },
	setValues: (v: { [k: string]: number | string }) => void,
}

export default function CustomParameterDisplay({ parameter: p, values, setValues }: CustomParameterDisplayProps){
	const { name, key, type, width } = p;

	const [uncommitted, setUncommitted] = React.useState<string | number>(values[key]);

	if(type === "number"){
		if(p.display === "slider"){
			return (
				<Stack minWidth={width ?? "8rem"} key={key}>
					<Typography lineHeight={1}>{name}</Typography>
					<Slider
						className="property-input property-input--slider"
						data-key={key}
						min={p.min} max={p.max}
						value={uncommitted as number}
						onChange={(_, v) => {
							setUncommitted(v as number);
						}}
						onChangeCommitted={(_, v) => {
							setValues({
								...values,
								[key]: v as number
							})
						}}
					/>
				</Stack>
			)
		}
	}
	else if (type === "color") {
		return (
			<TextField variant="standard"
				label={name}
				data-key={key}

				value={values[key] as string}
				onChange={(e) => {
					setValues({
						...values,
						[key]: e.target.value as string
					})
				}}
			/>
		)
	}
	return <React.Fragment key={key}></React.Fragment>
}