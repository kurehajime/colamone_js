const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");
const date = require("date-utils");
const timestamp = new Date().toFormat("YYYYMMDDHH24MI");

// html
let langs = ["ja", "en", "kr", "zh-hans", "zh-hant", "hi", "pt"];
let plugins = [];
for (let i = 0; i < langs.length; i++) {
  let jsonObject = JSON.parse(
    fs.readFileSync("lang/" + langs[i] + ".json", "utf8")
  );
  plugins.push(
    new HtmlWebpackPlugin({
      filename: "colamone-" + langs[i] + ".html",
      template: "src/template.html",
      templateParameters: Object.assign({ TIMESTAMP: timestamp }, jsonObject),
      inject: false,
      minify: { collapseWhitespace: false }
    })
  );
}
plugins.push(
  new HtmlWebpackPlugin({
    filename: "colamone.html",
    template: "src/colamone.html",
    templateParameters: { TIMESTAMP: timestamp },
    inject: false,
    minify: { collapseWhitespace: false }
  })
);
plugins.push(
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: "src/colamone.html",
    templateParameters: { TIMESTAMP: timestamp },
    inject: false,
    minify: { collapseWhitespace: false }
  })
);
plugins.push(
  new HtmlWebpackPlugin({
    filename: "colamone-mogera.html",
    template: "src/colamone-mogera.html",
    templateParameters: { TIMESTAMP: timestamp },
    inject: false,
    minify: { collapseWhitespace: false }
  })
);
//　Serviceworker
plugins.push(
  new CopyWebpackPlugin(
    {
      patterns: [
        {
          from: "src/sw.js",
          to: "sw.js",
          transform: function (content, path) {
            return content.toString().replace("TIMESTAMP", timestamp);
          }
        }
      ]
    })
);
// assets
plugins.push(
  new CopyWebpackPlugin({
    patterns: [
      {
        from: "assets",
        to: ""
      }
    ]
  })
);
module.exports = {
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: `./src/boardgame.ts`,
  // production or development
  mode: "production",
  devtool: "source-map",
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/docs`,
    // 出力ファイル名
    filename: "main.js"
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use:[
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
  ,resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
};
