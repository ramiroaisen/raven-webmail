# Raven Webmail
#### A webmail for wildduck mailserver

![Raven Webmail](https://user-images.githubusercontent.com/132242/80524945-26ab8d00-8999-11ea-8d10-57087627f596.png)

---

### Install
```sh
npm i -g raven-webmail
```

---

### Configure
create a default config file
```
raven create-config [-o --output="./config.toml"]
```
config file is auto-documented

---

### Run
```sh
raven start [-c --config="./config.toml"]
```

---

### TODO
- [ ] Localization
- [ ] Create / Remove folders
- [ ] Create / Remove aliases
- [ ] Create / Remove filters
- [ ] Choose sender address (currently uses user default address)

---

### Development
./src contains server side and cli typescript code that get compiled to ./dist

note that server code gets compiled with `ttsc` (typescript with transformers) instead of `tsc` to get runtime type checking in the io between client and server

./client contains the webmail single-page-app made with [svelte](https://svelte.dev)

./client is a subpackage with its own devDependencies (no runtime dependencies needed)
```sh
git clone https://github.com/ramiroaisen/raven-webmail
cd raven-webmail

# install server dependencies
npm i

# install client dependencies
cd client && npm i

# build client
cd client && npm run build

# starts client autobuild
cd client && npm run dev

# build server
npm run build

# start server autobuild
npm run dev

# create default config file in ./config.toml
node raven create-config

# edit settings, then run the app
node raven start
```
---

##### If you find a bug or have a feature request start a issue in this repo