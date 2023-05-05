export { CollectionPage as default } from "~/collections/page";

import { collectionPageBackend } from "~/collections/pageBackend";

const {getStaticPaths, getStaticProps} = collectionPageBackend({
	dir: "math/definitions"
})

export { getStaticPaths, getStaticProps }