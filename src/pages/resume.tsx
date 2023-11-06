import * as React from "react";

import NextLink from "next/link";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Link from "~/components/Link";
import Grid, { Grid2Props as GridProps } from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Tooltip from "@mui/material/Tooltip"

import MuiAccordion, { AccordionProps as MuiAccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps as MuiAccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from "@mui/icons-material/Info"
import GitHubIcon from "@mui/icons-material/GitHub"
import ItchIOIcon from "~/assets/images/Icons/itchio.svg"

import Title from "~/components/Title";

import Chip from "~/components/Chip";
import { styled } from "@mui/material";

import { ProjectItemEntry, projectItems, SkillEntry, skills, workExperience } from "~/content/ResumeContent";
import { CopyClipboardButton, CopyClipboardSnackbar } from "~/components/CopyClipboard";
import ItchIO from "~/assets/images/Icons/ItchIO";

const resumeTypes = {
	"Computer Science": 0,
	"Web Dev": 1,
	"Game Dev": 2,
	"UI/UX": 3,
}
export type ResumeType = keyof typeof resumeTypes

const Accordion = styled(
	(props: MuiAccordionProps) => (
		<MuiAccordion
			square
			disableGutters
			{...props}
		/>
	)
)(({theme}) => ({
	borderBottom: `1px solid ${theme.palette.divider}`,
	"&:first-of-type": {
		borderTop: `1px solid ${theme.palette.divider}`,
	},
	borderTopLeftRadius: 0,
	borderTopRightRadius: 0,
}))

const AccordionSummary = styled((props: MuiAccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<ExpandMoreIcon/>} {...props}/>
))(({theme}) => ({
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(1),
	backgroundColor: `${theme.palette.primary.main}05`,
	"&, &.Mui-expanded": {
		minHeight: "initial",
	},
	"& .MuiAccordionSummary-content, & .MuiAccordionSummary-content.Mui-expanded": {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	}
}))

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
	borderTop: `1px solid ${theme.palette.divider}`
}))

const en = '\u2014';

type PanelProps = {
	filters: Set<ResumeType>,
}

function WorkExperience({filters}: PanelProps) {
	const filteredWorkExperience = workExperience
		.filter(({types}) => filters.size === 0 || types.some(type => filters.has(type)))

	return <Box sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
		<Typography variant="h3" sx={{p: 2}}>
			Relevant experience
		</Typography>

		{filteredWorkExperience.map(({title, from, to, description}) => (
			<Accordion elevation={0} key={title}>
				<AccordionSummary>
					<Typography variant="h4" sx={{lineHeight: 1}}>
						{title}<br/>
						<Typography variant="subtitle1"
							component="span"
							sx={{
								fontStyle: "italic",
								marginLeft: 2,
							}}
						>
							{from}{en}{to}
						</Typography>
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{description}
				</AccordionDetails>
			</Accordion>
		))}
		{filteredWorkExperience.length === 0 && (
			<Box sx={{px: 2, pb: 2}}>
				<Typography variant="h4">No work experience {"\uD83D\uDE14"}</Typography>
			</Box>
		)}
	</Box>
}

function EducationAndInfo({}: PanelProps) {
	const [snackbarOpen, setSnackbarOpen] = React.useState(false);

	return (<Stack sx={{flexGrow: 1, height: "100%"}} spacing={2}>
		<Paper sx={{pb: 2, pr: 2}}>
			<CopyClipboardSnackbar open={snackbarOpen} setOpen={setSnackbarOpen}/>
			<Stack direction="row">
				<Typography variant="h3" sx={{p: 2, flexGrow: 1}}>
					Info
				</Typography>
				<IconButton disableRipple component={Link} href="https://ketexon.itch.io" blank>
					<ItchIO/>
				</IconButton>
				<IconButton disableRipple component={Link} href="https://github.com/ketexon" blank>
					<GitHubIcon fontSize="small"/>
				</IconButton>
			</Stack>
			<Box px={2}>
				<Typography variant="body1">
					Zane Aubrey Clark (any pronouns)<br/>
					<Link href="mailto:zane.a.s.clark@gmail.com">zane.a.s.clark@gmail.com</Link>
					<CopyClipboardButton text="zane.a.s.clark@gmail.com" setSnackbarOpen={setSnackbarOpen}/>
				</Typography>
			</Box>
		</Paper>
		<Paper sx={{flexGrow: 1}}>
			<Typography variant="h3" sx={{p: 2}}>
				Education
			</Typography>
			<List sx={{p: 0}}>
				<ListItem>
					<ListItemText
						primary="UCLA"
						secondary={<>
							Linguistics and Computer Science BA <br/>
							2021{en}present
						</>}
					/>
				</ListItem>
				<ListItem>
					<ListItemText
						primary="Coronado High School"
						secondary={`2017${en}2021`}
					/>
				</ListItem>
			</List>
		</Paper>
	</Stack>)
}

function Skills({filters}: PanelProps){
	const SkillsItem = ({iconClass, name, experience}: SkillEntry) => <Grid
		xs={4} sm={6}
		sx={{position: "relative"}}
	>
		<Typography component="div" variant="body1" lineHeight="1">
			<i className={iconClass} style={{paddingLeft: iconClass ? 0 : "1em" }}/>
			<Typography component="span" sx={{pl: "0.5em"}}>{name}</Typography>
			<br/>
			{experience && <Box component="div" sx={{pl: "1.5em"}}>
				<Typography component="span" variant="body2" fontStyle="italic" fontSize="0.75rem">{experience}</Typography>
			</Box>}
		</Typography>
	</Grid>

	return <>
		<Box sx={{p: 2, display: "flex", alignItems: "center"}}>
			<Typography variant="h3" sx={{flexGrow: 1}}>
				Skills
			</Typography>
			<Tooltip title="Note: not exhaustive. Please check my projects/work experience for other development tools">
				<InfoIcon fontSize="inherit"/>
			</Tooltip>
		</Box>
		<Grid container sx={{px: 2, pb: 2}}>
			{skills
				.filter(({types}) => filters.size === 0 || types.length !== 0 && types.some(type => filters.has(type)))
				.map(props => <SkillsItem key={props.name} {...props}/>)
			}
		</Grid>
	</>
}

function Projects({filters}: PanelProps){
	const [hideWIP, setHideWIP] = React.useState(false);

	const ProjectItemText = ({name, date, description, tags}: ProjectItemEntry) => (
		<ListItemText
			primary={
				<Box sx={{width: "100%", display: "flex", alignItems: "center"}}>
					<Typography variant="h4" sx={{flexGrow: 1}}>{name}</Typography>
					{tags.map((tag) => (
						<Chip key={tag}
							label={tag}
							size="small"
							variant="outlined"
							sx={{ml: 1}}
							style={{fontSize: "75%"}}
						/>)
					)}
				</Box>
			}
			secondary={<Typography variant="body2">
				<Typography component="span" variant="inherit" fontStyle="italic">{date}</Typography>
				<br/>{description}
			</Typography>}
		/>
	)

	const ProjectItem = (entry: ProjectItemEntry) => {
		const {href} = entry;
		return <ListItem disableGutters disablePadding>
			{ typeof href === "string"
				? <ListItemButton
					disableRipple
					disableTouchRipple
					{...typeof href === "string" ? {
						component: NextLink,
						href,
						target: "_blank"
					} : {}}
				>
					<ProjectItemText {...entry}/>
				</ListItemButton>
				: <Box sx={{width: "100%", px: 2, py: 1}}>
					<ProjectItemText {...entry}/>
					{href && <Typography variant="body2">
						{Object.entries(href).map(([name, href]) => (
							<Link key={name} href={href} target="_blank" mr={1}>
								{name}
							</Link>
						))}
					</Typography>}
				</Box>
			}
		</ListItem>
	}

	const filteredProjects = projectItems
		.filter(({types}) => filters.size === 0 || types.some(type => filters.has(type)))
		.filter(({tags}) => !hideWIP || !tags.includes("WIP"))

	return <Box pb={2}>
		<Box sx={{width: "100%", display: "flex", p: 2}}>
			<Typography variant="h3" sx={{flexGrow: 1}}>
				Projects
			</Typography>
			<FormControlLabel
				label={<Typography variant="body1">Hide WIP</Typography>}
				labelPlacement="start"
				control={
					<Checkbox
						size="small"
						disableRipple
						disableFocusRipple
						disableTouchRipple
					/>
				}
				checked={hideWIP}
				onChange={(e, v) => setHideWIP(v)}
			/>
		</Box>
		<List disablePadding sx={{maxHeight: "24rem", overflow: "scroll"}}>
			{
				filteredProjects.map(project => <ProjectItem key={project.name} {...project}/>)
			}
		</List>
	</Box>
}

const GridItem = ({children, noPaper, ...props}: GridProps & { noPaper?: boolean }) => (
	<Grid {...props} sx={{display: "flex", flexGrow: 1}}>
		{ noPaper
			? children
			: <Paper sx={{flexGrow: 1}}>
				{children}
			</Paper>
	}
	</Grid>
)

export default function Resume(){
	const [filters, setFilters] = React.useState(new Set<ResumeType>())
	const addFilter = (type: ResumeType) => () => setFilters(new Set([...filters, type]))
	const hasFilter = (type: ResumeType) => filters.has(type);
	const removeFilter = (type: ResumeType) => () => {
		const newFilters = new Set(filters);
		newFilters.delete(type);
		setFilters(newFilters);
	}

	return (<>
		<Container maxWidth="lg">
			<Title>Resume</Title>
			<Container maxWidth="md">
				<Typography variant="h1">
					Resume
				</Typography>
			</Container>
		</Container>
		<Box sx={theme => ({
			position: "sticky",
			top: `calc(64px + ${theme.spacing(2)})`,
			zIndex: theme.zIndex.appBar - 1,
		})}>
			<Container maxWidth="md" sx={{px: 2}}>
				<Stack direction="row">
					{
						Object.keys(resumeTypes).map((v: ResumeType) => {
							const active = hasFilter(v);
							return (<Chip
								key={v}

								size="small"
								label={v}
								color="primary"
								variant={active ? "filled" : "outlined"}
								clickable={!active}
								onClick={active ? undefined : addFilter(v)}
								onDelete={active ? removeFilter(v) : undefined}

								sx={theme => ({
									"&:hover.MuiChip-clickable": {
										backgroundColor: active ? undefined : theme.palette.background.default,
									},
									"&.MuiChip-clickable:active": {
										boxShadow: `0 0.125rem 0 rgba(0.5, 0.5, 0.5, 0.1)`
									},
									mr: 1,
									backgroundColor: active ? undefined : theme.palette.background.default,
									zIndex: theme.zIndex.appBar - 1,
									boxShadow: `0 0.125rem 0 rgba(0.5, 0.5, 0.5, 0.1)`
								})}
							/>)
						})
					}
				</Stack>
			</Container>
		</Box>
		<Container maxWidth="lg" sx={{pb: 2}}>
			<Grid container mt={1} spacing={2}>
				<GridItem xs={12} md={8}>
					<WorkExperience filters={filters}/>
				</GridItem>
				<GridItem noPaper xs={12} sm={6} md={4}>
					<EducationAndInfo filters={filters}/>
				</GridItem>
				<GridItem xs={12} sm={6} lg={4}>
					<Skills filters={filters}/>
				</GridItem>
				<GridItem xs={12} sm={6} lg={8}>
					<Projects filters={filters}/>
				</GridItem>
			</Grid>
		</Container>
	</>)
}