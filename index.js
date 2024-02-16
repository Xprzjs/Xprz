const {  launch, listen } = require("./src/shared/app");
const {createMiddlewareContext,use,} = require("./src/core/middleware/MiddlewareProvider");
const get = require("./src/core/CRUD/read");
const { applyCallbacks } = require("./src/utils/callbackHandler");
const {getApp,initApp} = require("./src/Using");

const app = initApp();
Using(app);
listen(3000);
