import * as React from "react";

import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Title from "~/components/Title";
import { MDXRemote } from "next-mdx-remote";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Link } from "@mui/material";
import NextLink from "next/link";

type AboutProps = {}

export default function About({}: AboutProps){
	return (
		<Container maxWidth="md">
			<Title>About</Title>
			<Typography variant="h1">About</Typography>
			<Typography variant="h2">Introduction</Typography>
			<Typography variant="body1">
				Hello! I am Zane Clark (but I usually go by Aubrey).
				I am a second year linguistics and computer science major and math minor at UCLA.
			</Typography>
			<br/>
			<Typography variant="body1">
				I am <em>very</em> passionate about computer science. I dabble in a lot of different subfields, but recurringly go back
				to game development (+ graphics) and web development, which are nice fields for me partially because they include many other fields!
			</Typography>
			<br/>
			<Typography variant="body1">
				I also like learning in general (philo-soph-er). Before I even went to college, I switched from physics to biophysics, and my logic for that was
				that I didn't want to limit myself to biology or physics. However, I ended up switching to linguistics and computer science because coding is my
				genuine #1 hobby, and I've always been interested in phonetics, grammar, and learning languages. And then I added the math minor on
				because I just can't live without math ;)
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