# About

This is the proposed ACM Studio website.

The tech stack for this website is nextjs using typescript with Matial UI for styling.

# Installing

This website uses yarn, an alternative to NPM, which you can install via:

```bat
npm install --global yarn
```

You can then install all the packages using the command

```bat
yarn
```

# Running and Building



# Collections Structure

The `[collection]/[id].tsx` dynamic route creates paths based on what is in the `collections` folder.

Each folder in the collections folder is considered to be a collection.
By default, each file whose extension is `.md` in each collection folder is a page, unless explicitly excluded in the `config.json`

## `config.json`

This is the schema for `config.json`

```javascript
{
	"excludedFiles": string[], // paths to excluded files relative to the collection root
}
```