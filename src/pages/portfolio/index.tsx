import { Container, Typography } from "@mui/material";
import { CollectionBrowser, CollectionBrowserProps } from "~/collections/collectionBrowser";

import { collectionBrowserBackend } from "~/collections/collectionBrowserBackend";
import Title from "~/components/Title";

const { getStaticProps } = collectionBrowserBackend({
	title: "Portfolio",
	collections: [
		{
			dir: "computer-science/games",
			title: "Games",
			collectionBrowserProps: {
				xs: 12,
				md: 12,
				lg: 6,
			}
		},
		{
			dir: "computer-science/websites",
			title: "Websites",
			collectionBrowserProps: {
				xs: 12,
				md: 12,
				lg: 6,
			}
		},
	]
})

export { getStaticProps }

export default function(props: CollectionBrowserProps){
	return <Container>
		<Title>Portfolio</Title>
		<Typography variant="h1">
			Portfolio
		</Typography>
		<CollectionBrowser disableContainer disableTitle {...props}>
			This section is still a work in progress!
		</CollectionBrowser>
	</Container>
}