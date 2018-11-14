const path = require("path");

module.exports = config => {
  config.entry.app = "./src/main.ts";

  if (process.env.NODE_ENV.toLowerCase() === 'production') {
    console.log("SERVING ELECTRON PRODUCTION");
    config.target = "electron-renderer";
    config.output.publicPath = `${process.cwd()}/dist/`;
    config.externals = config.externals || {};
    config.externals["electron-edge-js"] = 'require("electron-edge-js")';
  }
  else if (process.env.ELECTRON_WEB) {
    console.log("SERVING ELECTRON WEB");
    config.target = "web";
    config.externals = config.externals || {};
    config.externals["electron-edge-js"] = 'require("electron-edge-js")';
    config.externals["electron"] = 'require("electron")';
    config.externals["net"] = 'require("net")';
    config.externals["remote"] = 'require("remote")';
    config.externals["shell"] = 'require("shell")';
    config.externals["app"] = 'require("app")';
    config.externals["ipc"] = 'require("ipc")';
    config.externals["fs"] = 'require("fs")';
    config.externals["buffer"] = 'require("buffer")';
    config.externals["system"] = '{}';
    config.externals["file"] = '{}';
  }
  else if (process.env.NODE_ENV.toLowerCase() === "development") {
    console.log("SERVING PURE WEB VERSION");
  }

  console.log("NODE ENV:" + process.env.NODE_ENV);
  config.output.path = path.join(__dirname, "dist");
  config.output.filename = "[name].js";

  const sassConfig = {
    test: /\.sass$/, use: ['vue-style-loader', "css-loader",
      {
        loader: "sass-loader",
        options: {
          indentedSyntax: true
        }
      }
    ]
  };

  const scssConfig = {
    test: /ext\.scss$/, use:
      ["style-loader", "css-loader", "sass-loader"]
  };

  config.module.rules.push(sassConfig);
  config.module.rules.push(scssConfig);

};