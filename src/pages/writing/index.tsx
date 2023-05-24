export { CollectionBrowser as default } from "~/collections/collectionBrowser";

import { collectionBrowserBackend } from "~/collections/collectionBrowserBackend";

const { getStaticProps } = collectionBrowserBackend({
	title: "Writing",
	collections: [
		{ dir: "writing/poetry" },
	]
})

export { getStaticProps }