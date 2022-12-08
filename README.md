# Raven Webmail
#### A webmail for wildduck mailserver

![Raven Webmail](https://github.com/ramiroaisen/raven-webmail/raw/master/raven-webmail.png)

---

### Install
```sh
npm i -g raven-webmail
```

---

### Configure
Create a default config file
- config file is auto-documented

```sh
raven create-config [-o --output="./config.toml"]
```

---

### Run
```sh
raven start [-c --config="./config.toml"]
```

---

### Localization
###### User locale is detected from Accept-Language http header

##### Available locales

- ✓ en, English (default)
- ✓ es, Spanish
- ✓ it, Italian (comunity) [@ValoreAreaIT](https://github.com/ValoreAreaIT)

##### Machine generated locales
Machine generated locales were removed in version 1.0.
if you need to support a different locale use de `create-locale` command

##### Add custom locales
Uncomment the `extra_locale_dirs` entry in the config file 
and run this command to generate a default locale file that you can edit

Locales will be checked at startup and pretty warnings will be logged if any 

Custom locales will override existing ones for the same ISO code

```sh
raven create-locale [-c --config="./config.toml"] --code ISOCode
```

ISO codes must be in the form of `en` or `en-US` like in `Accept-Language` header, not `es_US`  

Please if you create a locale for your language make a PR or an issue and I will add it to the available locales

---

### Changelog

#### Version 1.2.0
- Raven now uses inter-tab notifications to broadcast login and logout from the same session (doesn't use the server for this any more). This change makes Raven now fully stateless.
- Added community provided Italian locale, special thanks to [@ValoreAreaIT](https://github.com/ValoreAreaIT) for sharing their locale configuration.

#### Version 1.1.3
- Raven will now allow users to customize their signature. The signature is stored in the wildduck user under `metaData.ravenSignatureHTML`. New entries were added to the base locales to support this feature.

#### Version 1.1
- SSR has been disabled to avoid memory leaks when executing client side javascript in the server, you can enable SSR again if you want, you'll have to edit `app/svelte.config.js` and rebuild the app with `npm run build`

#### Version 1.0
- Locale entries changed completely, if you created a custom locale you have to rewrite it.
- Machine generated locales were removed.
- Raven Webmail is now a [SvelteKit](https://kit.svelte.dev) app, with SSR, service-worker support and it's installable in modern browsers.
- Added compression optional config option

---



### Development
`./src` contains server side and cli typescript code that get compiled to `./dist`

note that server code gets compiled with `ttsc` (typescript with transformers) instead of `tsc` to get runtime type checking in the io between client and server

`./app` contains the webmail [SvelteKit](https://kit.svelte.dev) app

`./app` is a subpackage with its own devDependencies (no runtime dependencies needed)

```sh
git clone https://github.com/ramiroaisen/raven-webmail
cd raven-webmail

# install server dependencies
npm i

# install app devDependencies
cd app && npm i

# build client and server
npm run build

# starts dev server 
# - if you changed the default port or protocol you have to 
# - update the ENV variables in ./app/package.json dev script
# - for this to work
npm run dev

# create default config file in ./config.toml
node raven create-config

# edit settings, then run the app
node raven start
```
---

##### If you find a bug or have a feature request start an issue in this repo

----

##### Are you using Raven Webmail in production? Let me know!