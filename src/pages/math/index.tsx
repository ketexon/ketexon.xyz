export { CollectionBrowser as default } from "~/collections/collectionBrowser";

import { collectionBrowserBackend } from "~/collections/collectionBrowserBackend";

const { getStaticProps } = collectionBrowserBackend({
	title: "Math",
	collections: [
		{ dir: "math/definitions" },
		{ dir: "math/proofs" },
	]
})

export { getStaticProps }