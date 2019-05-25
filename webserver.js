var WebpackDevServer = require("webpack-dev-server"),
    webpack = require("webpack"),
    config = require("./webpack.config"),
    path = require("path");

var options = (config.webServerConfig || {});
var excludeEntriesToHotReload = (options.notHotReload || []);
const port = process.env.PORT || 3000;

for (var entryName in config.entry) {
    if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
        config.entry[entryName] =
            [
                ("webpack-dev-server/client?http://localhost:" + port),
                "webpack/hot/dev-server"
            ].concat(config.entry[entryName]);
    }
}

config.plugins =
    [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || []);

delete config.webServerConfig;

var compiler = webpack(config);

var server =
    new WebpackDevServer(compiler, {
        hot: true,
        contentBase: path.join(__dirname, "../dist"),
        headers: {"Access-Control-Allow-Origin": "*"},
        disableHostCheck: true,
        port: port,
    });

server.listen(port);
