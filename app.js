const { resolve } = require("path");
const {app, BrowserWindow} = require('electron');

const rootUrl = `${__dirname}/public`;
const url = `${rootUrl}/index.html`;

const rootPath = process.env.NODE_ENV !== 'production'
  ? process.cwd()
  : resolve(app.getAppPath(), '../../');

const paths = {
    root: rootPath,
    plugins: `${rootPath}/plugins`
};

global["paths"] = paths;

app.on('ready', () => {
    let window = new BrowserWindow({
        width: 800, height: 600,
        icon: `file://${rootUrl}/favicon.ico`,
        webPreferences: {
            zoomFactor: 0.75
        }
    });
    window.toggleDevTools();

    require('vue-devtools').install();

    console.log("Loading App", url);
    window.loadURL(url);
});