export { CollectionBrowser as default } from "~/collections/collectionBrowser";

import { collectionBrowserBackend } from "~/collections/collectionBrowserBackend";

const { getStaticProps } = collectionBrowserBackend({
	title: "Computer Science",
	collections: [
		{
			dir: "computer-science/projects",
			collectionBrowserProps: {
				xs: 12,
				md: 12,
				lg: 12,
			}
		},
	]
})

export { getStaticProps }