require("source-map-support").install();
global.__RAVEN_IMPORT_SVELTEKIT__ = () => import("./app/build/middlewares.js");
require("./server/dist/cli.js");
