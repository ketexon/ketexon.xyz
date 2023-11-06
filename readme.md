# Collections

## Pages

The format for the YAML frontmatter is:

```yaml
title: string
description: string?
date: Date
published: boolean
image: string?
tags: (string[])?
keywords: (string[])?
```

`date` should be formatted as `01 Apr 2023`

`published` determines whether this page will be produced by `getStaticPaths` and in the `walkCollectionPages` function

`image` is a url

`tags` are the chips that show up

`keywords` are the metadata keywords
