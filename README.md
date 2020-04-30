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
Create a default config file
- config file is auto-documented

```
raven create-config [-o --output="./config.toml"]
```

---

### Run
```sh
raven start [-c --config="./config.toml"]
```

---

### Localization

##### Human generated locales

- ✓ en, English (default) - full
- ✓ es, Spanish - full

##### Machine generated locales (ISO codes)
  af,   am,   ar,   az,   be,   bg,   bn,   bs,   ca,   ceb,   co,   cs,   cy,   da,   de,   el,   eo,   et,   eu,   fa,   fi,   fr,   fy,   ga,   gd,   gl,   gu,   ha,   haw,   hi,   hmn,   hr,   ht,   hu,   hy,   id,   ig,   is,   it,   iw,   ja,   jw,   ka,   kk,   km,   kn,   ko,   ku,   ky,   la,   lb,   lo,   lt,   lv,   mg,   mi,   mk,   ml,   mn,   mr,   ms,   mt,   my,   ne,   nl,   no,   ny,   or,   pa,   pl,   ps,   pt,   ro,   ru,   rw,   sd,   si,   sk,   sl,   sm,   sn,   so,   sq,   sr,   st,   su,   sv,   sw,   ta,   te,   tg,   th,   tk,   tl,   tr,   tt,   ug,   uk,   ur,   uz,   vi,   xh,   yi,   yo,   zh, zh-TW,  zu


###### User locale is detected from Accept-Language http header

---

### TODO
- [x] Better page titles
- [x] Localization 
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

##### If you find a bug or have a feature request start an issue in this repo