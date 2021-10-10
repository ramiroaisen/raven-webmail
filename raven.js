#!/usr/bin/env node
global.__RAVEN_IMPORT_SVELTEKIT__ = () => import("./app/build/middlewares.js");
require("source-map-support").install();
require("./server/dist/cli.js");
