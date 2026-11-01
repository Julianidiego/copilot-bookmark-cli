# Mona's Bookmark Manager CLI

A TypeScript command-line helper for validating bookmarks before they are added to Mona's Bookmark Manager.

## Setup

```sh
npm install
npm run build
```

## Validate bookmarks

Pass one or more URLs with `--validate`:

```sh
node dist/src/cli.js --validate https://example.com
node dist/src/cli.js --validate https://example.com --validate https://github.com
```

The command prints JSON results. It exits with status `0` when every URL is valid, `1` when at least one URL is invalid, and `2` for invalid command usage.

## Development

```sh
npm test
npm run dev -- --validate https://example.com
```
