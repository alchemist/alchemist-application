const {app, BrowserWindow} = require('electron');

const nodeEnv = process.env.NODE_ENV.toLowerCase();
const isDevVersion = nodeEnv === 'dev' || nodeEnv === "inweb";

let url;
if (isDevVersion)
{ url = 'http://localhost:8080/'; }
else
{ url = `file://${process.cwd()}/dist/index.html`; }

app.on('ready', () => {
    let window = new BrowserWindow({width: 800, height: 600});
    window.toggleDevTools();

    if(isDevVersion)
    { require('vue-devtools').install(); }

    window.loadURL(url);
});