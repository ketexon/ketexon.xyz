import * as React from "react";

import Typography from "@mui/material/Typography"
import Link from "~/components/Link"

import Tooltip from "@mui/material/Tooltip"

import InfoIcon from "@mui/icons-material/Info";

import { ResumeType } from "~/pages/resume";


// Dev Icons
import "devicon"

export type WorkExperienceEntry = {
	title: string,
	from: string,
	to: string,
	description: React.ReactNode,
	types: ResumeType[],
}

export const workExperience: WorkExperienceEntry[] = [
	{
		title: "UCLA International Institute Web Developer",
		from: "2023", to: "present",
		description: <>
			<Typography variant="h5">
				Responsibilities
			</Typography>
			<Typography variant="body1">
				Full-stack development of websites for UCLA's International Institute's
				centers using ASP.NET Web Forms with VB.NET, Foundation CSS Framework, jQuery,
				and a in-house CMS and component library.
			</Typography>
			<Typography variant="h5" mt={1}>
				Achievements
			</Typography>
			<Typography variant="body1">
				<Link href="https://www.international.ucla.edu/cwl2" blank>
					Center for World Language's website
				</Link>
				<Tooltip title={<>
					If the link doesn't work, try <Link href="https://www.international.ucla.edu/cwl" blank>
						https://www.international.ucla.edu/cwl
					</Link>
				</>}
					sx={{marginLeft: 1, fontSize: "75%"}}
				>
					<InfoIcon fontSize="inherit"/>
				</Tooltip>
			</Typography>
		</>,
		types: ["Computer Science", "Web Dev"],
	},
	{
		title: "UCLA ACM Studio Club Board Member",
		from: "2023", to: "present",
		description: <>
			<Typography variant="h5">
				Responsibilities
			</Typography>
			<Typography variant="body1">
				Fulfilled various roles in the game development department of ACM's UCLA chapter, notably
				teaching workshops for beginner and advanced game development and
				createing the ACM Studio website
			</Typography>
			<Typography variant="h5" mt={1}>
				Achievements
			</Typography>
			<Typography variant="body1">
				<Link href="https://github.com/uclaacm/studio.uclaacm.com" blank>
					UCLA's ACM Studio's website
				</Link> (WIP)
			</Typography>
		</>,
		types: ["Computer Science", "Web Dev"],
	},
	{
		title: "Coronado Locals Card Web Developer",
		from: "2018", to: "2019",
		description: <>
			<Typography variant="h5">
				Responsibilities
			</Typography>
			<Typography variant="body1">
				Full-stack development of the Coronado Local's Card website under the Coronado Schools Foundation.
				Designed using vanilla PHP, JavaScript, CSS, and SQL. Features include a Google Maps integration
				with partnered business locations, as well as authentication.
			</Typography>
			<Typography variant="h5" mt={1}>
				Achievements
			</Typography>
			<Typography variant="body1">
				<Link href="https://coronadolocaldeals.com/Map" blank>
					Coronado Locals Card website
				</Link>
				<Tooltip title="No longer maintained by me."
					sx={{marginLeft: 1, fontSize: "75%"}}
				>
					<InfoIcon fontSize="inherit"/>
				</Tooltip>
			</Typography>
		</>,
		types: ["Computer Science", "Web Dev"],
	}
]

export type SkillEntry = {
	iconClass?: string,
	name: string,
	experience?: string,
	types: ResumeType[]
}

export const skills: SkillEntry[] = [
	{
		iconClass: "devicon-html5-plain",
		name: "HTML/JS/CSS",
		experience: "Advanced, 7 years",
		types: ["Computer Science", "Web Dev", "UI/UX"],
	},
	{
		iconClass: "devicon-typescript-plain",
		name: "TypeScript",
		experience: "Advanced, 3 years",
		types: ["Computer Science", "Web Dev"],
	},

	{
		iconClass: "devicon-react-original",
		name: "React",
		experience: "Intermediate, 3 years",
		types: ["Computer Science", "Web Dev"],
	},

	{
		iconClass: "devicon-unity-original",
		name: "Unity",
		experience: "Advanced, 3 years",
		types: ["Computer Science", "Game Dev"],
	},

	{
		iconClass: "devicon-opengl-plain",
		name: "OpenGL",
		experience: "Beginner, 2 years",
		types: ["Computer Science", "Game Dev"],
	},

	{
		iconClass: "devicon-cplusplus-plain",
		name: "C++",
		experience: "Advanced, 5 years",
		types: ["Computer Science"],
	},

	{
		iconClass: "devicon-windows8-original",
		name: "WinAPI",
		experience: "Intermediate, 3 years",
		types: ["Computer Science"],
	},

	{
		iconClass: "devicon-python-plain",
		name: "Python",
		experience: "Advanced, 5 years",
		types: ["Computer Science"],
	},

	{
		iconClass: "devicon-illustrator-plain",
		name: "Illustrator",
		experience: "Intermediate, 6 years",
		types: ["UI/UX"],
	},

	{
		iconClass: "devicon-aftereffects-plain",
		name: "After Effects",
		experience: "Beginner, 6 years",
		types: [],
	},

	{
		iconClass: "devicon-git-plain",
		name: "Git",
		types: ["Computer Science"],
	},

	{
		name: "French",
		experience: "Intermediate, 4 years",
		types: [],
	},
]



export type ProjectItemEntry = {
	name: string,
	date: string,
	href?: string | { [k: string]: string },
	description: string | React.ReactNode,
	types: ResumeType[],
	tags: string[],
}

export const projectItems: ProjectItemEntry[] = [
	{
		name: "studio.uclaacm.com",
		date: "Ongoing",
		href: "https://github.com/uclaacm/studio.uclaacm.com",
		description: "Programmer for UCLA's ACM Studio's website, made with NextJS.",
		types: ["Computer Science", "Web Dev", "UI/UX"],
		tags: ["Large Scale", "NextJS", "WIP"],
	},

	{
		name: "Echo",
		date: "Ongoing",
		description: "Programmer for service scheduling and BI app (Currently closed source)",
		types: ["Computer Science", "Web Dev", "UI/UX"],
		tags: ["Large Scale", "RemixJS", "WIP"],
	},

	{
		name: "If the fish isn't hooked, you can't reel it in",
		date: "Ongoing",
		href: "https://github.com/ketexon/Fish",
		description: "An in-progress fishing slice-of-life/romance game made with friends for the Playdate console whose only control is fishing",
		types: ["Computer Science", "Game Dev"],
		tags: ["Playdate/Lua", "WIP"]
	},

	{
		name: "Daydream",
		date: "Ongoing",
		href: {
			"GitHub": "https://github.com/SRS-Team-Daydream/Daydream",
			"itch.io": "https://pinootgu.itch.io/daydream",
		},
		description: "Programming lead for 2D turn-based RPG game made in Unity for UCLA's ACM 2023 Studio's Students Run Studios.",
		types: ["Computer Science", "Game Dev", "UI/UX"],
		tags: ["Large Scale", "Unity", "WIP"],
	},

	{
		name: "Chinchilla Spinning",
		date: "2023",
		href: {
			"GitHub": "https://github.com/chinchillaspinning/chinchillaspinning.github.io",
			"Website": "https://chinchillaspinning.github.io/",
		},
		description: "A small website of a chinchilla spinning using Three.js.",
		types: ["Computer Science", "Web Dev"],
		tags: ["Meme"],
	},

	{
		name: "Snake Unity",
		date: "2023",
		href: "https://github.com/ketexon/SnakeUnity",
		description: "Tiny snake implementation made in Unity",
		types: ["Computer Science", "Game Dev"],
		tags: ["Small Scale", "Unity"]
	},

	{
		name: "SDL Pong",
		date: "2023",
		href: "https://github.com/ketexon/sdl-pong",
		description: "Pong made using SDL with a friend.",
		types: ["Computer Science", "Game Dev"],
		tags: ["Small Scale", "SDL/C++"]
	},

	{
		name: "Slayride",
		date: "2022",
		href: {
			"GitHub": "https://github.com/177rexs33/Snowjam_2022_Team_6",
			"itch.io": "https://ketexon.itch.io/slayride",
		},
		description: "One of the lead programmers for the Christmas themed shoot-em-up game, made for ACM Studio's 2022 Snowjam. ",
		types: ["Computer Science", "Game Dev", "UI/UX"],
		tags: ["Game Jam", "Unity"],
	},

	{
		name: "Personal Website",
		date: "2022",
		description: "Personal website made using GitHub pages, Jekyll, and Bootstrap.",
		href: {
			"GitHub (Source)": "https://github.com/ketexon/ketexon.github.io_source",
			"Website": "https://www.ketexon.xyz",
		},
		types: ["Computer Science", "Web Dev", "UI/UX"],
		tags: ["Small Scale", "Jekyll"]
	},

	{
		name: "Debugger",
		date: "2022",
		href: {
			"GitHub": "https://github.com/rh5140/srs-team-bug",
			"itch.io": "https://raddishradish.itch.io/debugger",
		},
		description: "Programming lead for 2D sokobon-style puzzle game made in Unity for UCLA's ACM 2022 Studio's Students Run Studios.",
		types: ["Computer Science", "Game Dev"],
		tags: ["Large Scale", "Unity"],
	},

	{
		name: "Climate Clock Bot",
		date: "2022",
		href: {
			"GitHub": "https://github.com/ketexon/climateclockbot",
		},
		description: <>
			Reddit bot written in python that registers a !climateclock command that displays information from
			the <Link href="https://climateclock.world/" blank>Climate Clock</Link>
		</>,
		types: ["Computer Science", "Web Dev"],
		tags: ["Small Scale", "Python"]
	}
]