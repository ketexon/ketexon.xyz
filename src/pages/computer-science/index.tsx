export { CollectionBrowser as default } from "~/collections/collectionBrowser";

import { collectionBrowserBackend } from "~/collections/collectionBrowserBackend";

const { getStaticProps } = collectionBrowserBackend({
	title: "Computer Science",
	collections: [
		{
			dir: "computer-science/games",
			collectionBrowserProps: {
				xs: 12,
				md: 12,
				lg: 12,
			}
		},
		{
			dir: "computer-science/websites",
			title: "Websites",
			collectionBrowserProps: {
				xs: 12,
				md: 12,
				lg: 12,
			}
		},
	]
})

export { getStaticProps }