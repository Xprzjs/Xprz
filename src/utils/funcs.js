const { getApp } = require("../Using");
const app = getApp();
exports.set = function (...handler) {
  return app.set(...handler);
};
exports.use = function (...handler) {
    app.use(...handler)
};
