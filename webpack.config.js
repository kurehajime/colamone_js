const HtmlWebpackPlugin = require('html-webpack-plugin');
const date=require('date-utils');
const timestamp = (new Date()).toFormat("YYYYMMDDHH24MI");
let templates = ["colamone.html",
                "index.html",
                "colamone-en.html",
                "colamone-ja.html",
                "colamone-kr.html",
                "colamone-mogera.html",
                "colamone-zh-hans.html",
                "colamone-zh-hant.html",
              ];
let plugins = [];
for (let i = 0; i < templates.length; i++) {
  plugins.push(new HtmlWebpackPlugin({  // Also generate a test.html
    filename: templates[i],
    template: 'src/' + templates[i],
    templateParameters: {
      'TIMESTAMP': timestamp
    },
    inject: false,
  }));
}
module.exports = {
    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: `./src/boardgame.js`,
    // production or development
    mode: "production",
    devtool: 'source-map',
    // ファイルの出力設定
    output: {
      //  出力ファイルのディレクトリ名
      path: `${__dirname}`,
      // 出力ファイル名
      filename: "main.js"
    },
    plugins: plugins,
    module: {
        rules: [
          {
            test: /\.js$/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: [
                    "@babel/preset-env"
                  ]
                }
              }
            ]
          }
        ]
      }
  };