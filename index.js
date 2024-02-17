const { launch } = require("./src/shared/AppManager");
launch();
const Route = require("./src/core/routes/router");
const { get, setRoute } = require("./src/core/CRUD/read");
const { setEjs } = require("./src/utils/templateEngines");
const { use } = require("./src/utils/funcs");

setEjs("views");
const router = new Route();
use(router)
setRoute(router);
get("/", { send: "hi" });
