export { CollectionBrowser as default } from "~/collections/browser";

import { collectionBrowserBackend } from "~/collections/browserBackend";

const { getStaticProps } = collectionBrowserBackend({
	dir: "math/definitions",
	title: "Definitions"
})

export { getStaticProps }