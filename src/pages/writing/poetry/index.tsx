export { PageBrowser as default } from "~/collections/pageBrowser";

import { pageBrowserBackend } from "~/collections/pageBrowserBackend";

const { getStaticProps } = pageBrowserBackend({
	dir: new URL(import.meta.url),
})
export { getStaticProps }