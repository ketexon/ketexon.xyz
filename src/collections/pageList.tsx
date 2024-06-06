import { PageBrowserPage } from "./pageBrowser"

import NextLink from "next/link"

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

import Chip from "@mui/material/Chip"

import PushPinIcon from "@mui/icons-material/PushPin"

import format from "~/util/normalizeDate";

export type PageListProps = {
	dir: string,
	pages: PageBrowserPage[],
	pinned?: boolean
}

export default function PageList({ dir, pages, pinned }: PageListProps){
	pinned ??= false;
	return (
		<List
			disablePadding
			sx={{flexGrow: 1}}
			subheader={
				pinned && (
					<ListSubheader sx={{py: 1}}>
						<Typography variant="subtitle1" fontStyle="italic">
							<PushPinIcon fontSize="small" sx={{
								transform: "scale(0.6) rotate(-45deg)",
								verticalAlign: "text-bottom"
							}}/>
							Pinned
						</Typography>
					</ListSubheader>
				)
			}
		>
		{
			pages.map((page, idx) => (
				<ListItem
					key={idx}
					disableGutters
					disablePadding
				>
					<ListItemButton
						component={NextLink}
						href={`/${dir}/${page.filename}`}
						disableTouchRipple
					>
						<Box sx={{ flex: "1 1 0", display: "flex",  }}>
							<Box sx={{
								flexGrow: 2,
								display: "grid",
								gridTemplateRows: "1fr min-content",
								pb: 1,
								flexBasis: 0,
							}}>
								<Box>
									<Typography component="span" display="block" variant="h3">
										{page.matter.data.title}
									</Typography>
									<Typography component="span" display="block" variant="subtitle1">
										{page.matter.data.description}
									</Typography>
									<Typography component="span" display="block"  variant="subtitle2" fontStyle="italic">
										{page.matter.data.date && format(page.matter.data.date)}
									</Typography>
								</Box>
								{ page.matter.data.tags && (
									<Box display="flex" flexDirection="row" gap={1} mt={1}>
										{page.matter.data.tags.map((tag) => (
											<Chip key={tag}
												label={tag}
												size="small"
												variant="outlined"
												style={{fontSize: "75%"}}
											/>)
										)}
									</Box>
								)}
							</Box>
							{ page.matter.data.image && (
								<img style={{
									flexGrow: 1,
									minWidth: 0,
									minHeight: 0,
									flexBasis: 0,
									maxWidth: "100%",
									objectFit: "contain",
								}} src={page.matter.data.image}></img>
							)}
						</Box>
					</ListItemButton>
				</ListItem>
			))
		}
		</List>
	)
}