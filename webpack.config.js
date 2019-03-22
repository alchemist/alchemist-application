const {resolve} = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: 'development',
    target: "electron-renderer",
    entry: './src/main.ts',
    output: {
        path: resolve(__dirname, './public/app'),
        publicPath: '/public/app',
        filename: 'app.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader'
                    }
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    transpileOnly: true,
                    experimentalWatchApi: true
                }
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    "sass-loader"
                ]
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "url-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }/*,
        modules: ["../../node_modules"]*/
    },
    externals: [
        "electron",
        "electron-edge-js",
        "edge-js",
        "net",
        "remote",
        "shell",
        "app",
        "ipc",
        "fs",
        "buffer",
        "system",
        "file",
        "@treacherous/core",
        "@treacherous/view",
        "@treacherous/vue",
        "@treacherous/decorators",
        "@alchemist/core",
        "uuid",
        "interactjs",
        "lodash-es",
        "tslib",
        "vue",
        "vue-class-component",
        "vue-property-decorator",
        "vuex",
        "vuex-class",
        "vue2-ace-editor",
        "vue-router",
        "core-js",
        "highlight.js",
        "liquor-tree",
        "vue-toasted",
        "vue-context"
    ],
    optimization: {
        minimize: false,
        usedExports: true,
        mergeDuplicateChunks: true
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};