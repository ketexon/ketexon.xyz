export { Page as default } from "~/collections/page";

import { collectionPageBackend } from "~/collections/pageBackend";
const { getStaticPaths, getStaticProps } = collectionPageBackend({ dir: new URL(import.meta.url) })
export { getStaticPaths, getStaticProps }