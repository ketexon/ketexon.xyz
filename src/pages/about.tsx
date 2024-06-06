import * as React from "react";

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Title from "~/components/Title";
import { MDXRemote } from "next-mdx-remote";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Box, Link } from "@mui/material";
import NextLink from "next/link";

type AboutProps = {}

export default function About({}: AboutProps){
	return (
		<Container maxWidth="md">
			<Title>About</Title>
			<Typography variant="h1">About</Typography>
			<Typography variant="h2">Introduction</Typography>
			<Box
				component="img"
				src="/img/aubrey-clark.webp"
				alt="Aubrey Clark"
				width="500"
				sx={{
					maxWidth: "33%",
					minWidth: "300px",
					float: "right",
					ml: 2,
					mb: 2,
					"@media (max-width: 500px)": {
						minWidth: "unset",
						maxWidth: "unset",
						width: "100%",
						ml: 0,
					},
				}}
			/>
			<Typography variant="body1">
				Hello! I am Zane Clark (but I usually go by Aubrey).
				I am a third year linguistics and computer science major and math minor at UCLA.
			</Typography>
			<br/>
			<Typography variant="body1">
				I am passionate about computer science. I dabble in a lot of different subfields, but recurringly go back
				to game development (+ graphics) and web development, which are nice fields for me partially because they include many other fields!
			</Typography>
			<br/>
			<Typography variant="body1">
				I also like learning in general (philo-soph-er). Before I even went to college, I switched from physics to biophysics, and my logic for that was
				that I didn't want to limit myself to biology or physics. However, I ended up switching to linguistics and computer science because coding is my
				genuine #1 hobby, and I've always been interested in phonetics, grammar, and learning languages. And then I added the math minor on
				because I just can't live without math ;).
			</Typography>
			<br/>
			<Typography variant="body1">
				Learning languages is very valuable to me. I used to want to be an extreme polyglot (my language bucket list was like 8 languages), but now I want to just take it slow and learn for fun. Usually, if I'm not doing anything (eg. on a bus, in a line), I pull out Anki and learn a few words. I took French for a few years in high school, and I am now taking Korean.
			</Typography>
			<br/>
			<Typography variant="body1">
				Some of my hobbies are music and baking. I love romantic classical (Scriabin, Mahler, Chopin, Prokofiev {"<"}3), the rocks (Nine Inch Nails, Pearl Jam, Muse, Soundgarden, Nirvana, Radiohead), indie (Mitski, <em>Will Wood</em> WILL WOOD will wood), electronic, etc. etc. I like to play piano, I want to learn to sing, I compose a little, and I want to learn to produce.
			</Typography>
			<br/>
			<Typography variant="body1">
				I don't really know what I want to do, but some of my plans/options are:
				teaching english in a foreign country,
				going into tech,
				becoming an indie game-dev,
				getting a PhD in CS or Linguistics (or even math),
				or becoming a baker c:
			</Typography>
			<br/>
			<Typography variant="h2">Resume</Typography>
			<Typography variant="body1">
				<Link href="/resume" component={NextLink}>Here</Link>.
			</Typography>
		</Container>
	)
}

export async function getStaticProps({}: GetStaticPropsContext): Promise<GetStaticPropsResult<AboutProps>> {
	return {
		props: {}
	}
}