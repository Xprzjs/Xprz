const e = require("express");
const App = require("./src/shared/App");
const RouteManager = require("./src/shared/RouteManager");
const a = e()

a.get('/',(req,res,nxt)=>{
  // req.
})
const { launch } = new App();

const router = new RouteManager();

router.setRoute("/").get(() => {
  const { } = router.req()
});
router.attachTo(launch());
