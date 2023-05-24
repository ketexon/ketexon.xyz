export { CollectionBrowser as default } from "~/collections/collectionBrowser";

import { collectionBrowserBackend } from "~/collections/collectionBrowserBackend";

const { getStaticProps } = collectionBrowserBackend({
	title: "Computer Science",
	collections: [
		{ dir: "computer-science/projects" },
	]
})

export { getStaticProps }