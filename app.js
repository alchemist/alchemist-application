const {app, BrowserWindow} = require('electron');
rootUrl = `file://${process.cwd()}/public/`;
url = `${rootUrl}/index.html`;

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