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