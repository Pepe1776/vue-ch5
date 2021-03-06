const path = require("path");
const glob = require("glob");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const appConfig = require("./app.config");
const projectConfig = require("./app/project-config.json");
const appConfigDistPath = appConfig.distPath;
const basePath = appConfig.basePath;
const nodeModules = appConfig.nodeModules;
const srcRoot = appConfig.srcRoot;
const srcTemplateRoot = appConfig.srcTemplateRoot;
const srcProjectRoot = appConfig.srcProjectRoot;
const fontAwesomeCssBasePath = appConfig.fontAwesomeCssBasePath;

function getConfig(envPath) {
  let copyToDest = [];
  const distPath = appConfigDistPath[envPath];

  let fromCommonList = {
    fav: {
      to: `${distPath}`,
      from: `${srcRoot}/favicon.ico`,
    },
    fontIcon: {
      to: `${distPath}/assets/webfonts`,
      from: `${nodeModules}@fortawesome/fontawesome-free/webfonts/**/*`,
    },
    layoutCss: {
      to: `${distPath}/assets/css`,
      from: `${nodeModules}@crestron/ch5-theme/output/themes/light-theme.css`,
    },
    projectConfig: {
      to: `${distPath}/assets/data`,
      from: `${srcRoot}/project-config.json`,
      context: "app/assets/data"
    },
    webXPanelContract: {
      to: `${distPath}/config/`,
      from: `./config/*.cse2j`
    },
    configJson: {
      to: `${distPath}/app/config/environment.json`,
      from: `${srcRoot}/config/environment/${envPath}.json`
    }
  };

  let templateList = {
    component: {
      to: `${distPath}/app/components`,
      from: `${srcTemplateRoot}/components/**/*.html`,
      context: "app/components",
    },
    emulator: {
      to: `${distPath}/app/assets/data`,
      from: `${srcTemplateRoot}/components/**/*.json`,
      context: "app/assets/data",
    },
    fonts: {
      to: `${distPath}/app/assets/fonts`,
      from: `${srcTemplateRoot}/assets/fonts/**/*`,
      context: "app/assets/fonts",
    },
    images: {
      to: `${distPath}/app/assets/img`,
      from: `${srcTemplateRoot}/assets/img/**/*`,
      context: "app/assets/img",
    },
    json: {
      to: `${distPath}/app/assets/data`,
      from: `${srcTemplateRoot}/assets/data/**/*.json`,
      context: "app/assets/data",
    }
  };

  let projectList = {
    component: {
      to: `${distPath}/app/components`,
      from: `${srcProjectRoot}/components/**/*.html`,
      context: "app/components",
    },
    emulator: {
      to: `${distPath}/app/assets/data`,
      from: `${srcProjectRoot}/components/**/*.json`,
      context: "app/assets/data",
    },
    fonts: {
      to: `${distPath}/app/assets/fonts`,
      from: `${srcProjectRoot}/assets/fonts/**/*`,
      context: "app/assets/fonts",
    },
    images: {
      to: `${distPath}/app/assets/img`,
      from: `${srcProjectRoot}/assets/img/**/*`,
      context: "app/assets/img",
    },
    json: {
      to: `${distPath}/app/assets/data`,
      from: `${srcProjectRoot}/assets/data/**/*.json`,
      context: "app/assets/data",
    }
  };

  Object.keys(fromCommonList).forEach((key) => {
    let listObj = {};
    listObj.from = path.resolve(basePath, fromCommonList[key].from);
    listObj.to = path.resolve(basePath, fromCommonList[key].to);
    listObj.force = true;
    if (fromCommonList[key].context) {
      listObj.flatten = false;
      listObj.context = fromCommonList[key].context;
    } else {
      listObj.flatten = true;
    }
    copyToDest.push(listObj);
  });

  Object.keys(templateList).forEach((key) => {
    let listObj = {};
    listObj.from = path.resolve(basePath, templateList[key].from);
    listObj.to = path.resolve(basePath, templateList[key].to);
    listObj.force = true;
    if (templateList[key].context) {
      listObj.flatten = false;
      listObj.context = templateList[key].context;
    } else {
      listObj.flatten = true;
    }
    copyToDest.push(listObj);
  });

  Object.keys(projectList).forEach((key) => {
    let listObj = {};
    listObj.from = path.resolve(basePath, projectList[key].from);
    listObj.to = path.resolve(basePath, projectList[key].to);
    listObj.force = true;
    if (projectList[key].context) {
      listObj.flatten = false;
      listObj.context = projectList[key].context;
    } else {
      listObj.flatten = true;
    }
    copyToDest.push(listObj);
  });

  return copyToDest;
}

module.exports = (env) => {
  return {
    entry: {
      main: path.resolve(basePath, `${srcTemplateRoot}/assets/scss/main.scss`),
      external: [
        path.resolve(basePath, `${fontAwesomeCssBasePath}/fontawesome.css`),
        path.resolve(basePath, `${fontAwesomeCssBasePath}/regular.css`),
        path.resolve(basePath, `${fontAwesomeCssBasePath}/solid.css`),
        path.resolve(basePath, `${fontAwesomeCssBasePath}/brands.css`)
      ],
      templatecomponents: glob.sync(`${srcTemplateRoot}/components/**/*.scss`),
      projectcomponents: glob.sync(`${srcProjectRoot}/components/**/*.scss`),
    },
    output: {
      libraryTarget: "umd",
      filename: "[name].js",
      path: path.resolve(basePath, appConfigDistPath[env]),
    },
    resolve: {
      extensions: [".scss", ".sass", ".css", ".js"],
    },
    module: {
      rules: [{
        test: /\.handlebars$/, loader: "handlebars-loader",
        options: {
          helperDirs: path.resolve(__dirname + '/app/template/helpers'),
          precompileOptions: {
            knownHelpersOnly: false,
          }
        }
      },
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        },
          "css-loader?url=false"
        ]
      },
      {
        test: /\.(png|jpg|svg|woff|woff2|eot|ttf)$/,
        loader: "url-loader",
        options: {
          limit: 1020000,
          name: "images/[name].[ext]"
        }
      },
      {
        test: /\.scss$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
        },
          "css-loader",
          "sass-loader?url=false",
        ]
      },
      {
        test: /\.(html)$/,
        use: [{
          loader: "html-loader",
          options: {
            minimize: false,
          }
        }]
      }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].css",
      }),
      new CopyPlugin(getConfig(env)), //new CopyPlugin(copyToDest),
      new HtmlWebpackPlugin(),
      new HtmlWebpackPlugin({
        page: 'footer',
        template: './app/template/components/pages/template-footer/template-footer.handlebars',
        templateParameters: projectConfig,
        filename: "./app/template/components/pages/footer/footer.html",
        chunks: []
      }),
     new HtmlWebpackPlugin({
        page: 'content',
        template: './app/template/components/pages/template-content/template-content.handlebars',
        templateParameters: projectConfig,
        filename: "./app/template/components/pages/content/content.html",
        chunks: []
      }),
      new HtmlWebpackPlugin({
        page: 'header',
        template: './app/template/components/pages/template-header/template-header.handlebars',
        templateParameters: projectConfig,
        filename: "./app/template/components/pages/header/header.html",
        chunks: []
      }),
      new HtmlWebpackPlugin({
        page: 'index',
        template: path.resolve('./app/template/components/pages/template-index/template-index.handlebars'),
        templateParameters: projectConfig,
        filename: "./index.html",
        chunks: []
      })
    ],
    performance: {
      maxAssetSize: 5120000,
      maxEntrypointSize: 512000
    }
  }
};
