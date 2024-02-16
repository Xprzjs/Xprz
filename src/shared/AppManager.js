const { initApp,listen, getExpress}= require('../utils/appUtils')
const {setApp} = require("../Using");
class AppManager {
    constructor() {
        this.app = null;
        this.runApp = false;
    }
    getXPress(){
        return getExpress()
    }
    initApp() {
        this.app = initApp()
        setApp(this.app)
        this.runApp = true;
        return this.app;
    }
    listen(port = 3000, textLog = `Server is running on port ${port}`, log = true) {
        if (this.runApp) {
            listen(this.app,port,textLog,log)
        } else {
            console.log('Express app has not been initialized yet.');
        }
    }

    launch(port = 3000, textLog = `Server is running on port ${port}`, log = true) {
        this.initApp();
        this.listen(port, textLog, log);
        return this.app;
    }
}
const appManager = new AppManager();
module.exports = {
    getXPress : appManager.getXPress.bind(appManager),
    initApp: appManager.initApp.bind(appManager),
    launch : appManager.launch.bind(appManager),
    listen : appManager.listen.bind(appManager),
};
