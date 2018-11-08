const {app, BrowserWindow} = require('electron');

const nodeEnv = process.env.NODE_ENV.toLowerCase();
const isDevVersion = nodeEnv === 'dev' || nodeEnv === "inweb";

let url;
let rootUrl;
if (isDevVersion)
{
    rootUrl = 'http://localhost:8080/'
    url = 'http://localhost:8080/';
}
else
{
    rootUrl = `file://${process.cwd()}/dist/`;
    url = `${rootUrl}/index.html`;
}

app.on('ready', () => {
    let window = new BrowserWindow({width: 800, height: 600, icon: `file://${process.cwd()}/public/favicon.ico`});
    window.toggleDevTools();

    if(isDevVersion)
    { require('vue-devtools').install(); }

    window.loadURL(url);
});