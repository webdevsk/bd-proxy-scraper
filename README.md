# Bangladeshi Proxy Scraper

A scraper built on TypeScript and Bun. Scrapes from the following sources:

|Source|Method|
|---|---|
|Custom|Populate custom-list.ts file|
|proxydb.net|api|
|spys.one|puppeteer|

### To get started:

#### 1. Clone this repo

#### 2. Install Chrome for puppeteer

```bash
bunx @puppeteer/browsers install chrome
```

#### 3. Install dependencies:

```bash
bun i
```

#### 4. Run scraper

```bash
bun start
```

### Want to contribute?

You can contribute by
- Adding custom proxies in "custom-list.ts"
- Adding scraper for other sources.
    1. Create a new directory. Use the source as name
    1. import "proxyList" and type "Proxy" from the root index.ts file, append your newly scraped proxies to the proxyList
    1. Call the scaper function from index.ts

### Brought to you by:

[webdevsk](https://github.com/webdevsk)