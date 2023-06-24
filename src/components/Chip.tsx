import * as React from "react";

import MuiChip, { ChipTypeMap, ChipProps as MuiChipProps } from "@mui/material/Chip"
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ButtonBaseProps } from "@mui/material/ButtonBase";
import { SxProps, Theme } from "@mui/material";

const MuiChipCasted = MuiChip as OverridableComponent<ChipTypeMap<ButtonBaseProps>>;

export type ChipProps = MuiChipProps<"div", ButtonBaseProps>;

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(({sx, ...props}: ChipProps, ref) => {
	// override sx prop but inject our own
	const newSx = ((theme: Theme) => {
		// if sx prop is function, call it with theme, otherwise if it is null, intiialize to empty object
		const userSx = sx
			? typeof sx === "object"
				? sx : sx(theme)
			: {}

		return {
			transition: theme.transitions.create("background-color", {
				duration: theme.transitions.duration.shortest,
			}),
			...userSx,

			"&:active": {
				boxShadow: "none",
				...userSx ? userSx["&:active"] ?? {} : {}
			}
		}
	}) as SxProps<Theme>;

	return <MuiChipCasted
		ref={ref}
		disableRipple
		disableTouchRipple
		sx={newSx}
		{...props}
	/>
})

export default Chip;