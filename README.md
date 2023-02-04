---
theme: vuepress
---
> **flag**：每月至少产出三篇高质量文章！

> 由于想搭建一个适合更多人使用的大而全的完整项目，也想搞清楚其中每个关键环节和依赖的作用，且会随着时间不断迭代，加入新东西，为了避免产出一篇过长的文章，作长远考虑，将会分为多篇文章~
>
> 为了保证过程可复现，过程中将尽可能对每一行关键代码做注释，出现的问题也会附上解决方案。本项目所有的依赖都会使用最新的版本，除非遇到版本兼容的问题（会做特别说明），每篇文章都会新建一个分支，并在文末附上 `GitHub repo`。
>
> **我相信你能感受到我有多认真~**
>
>PS：不同的技术栈，会通过不同分支进行区分

虽然标题只写了 `React18+TS4.x+Webpack5.x`，但实际远不止于此，后续可能会用到的工具很多，先列举如下：

- 技术栈：`webpack5 + React18 + TS4.x`
- 工程化：`eslint + prettier + stylelint + husky + commitlint`
- 样式与处理器：`CSS module（less、sass、stylus）`、`Atom CSS（tailwind）`
- UI 框架：`Antd5.x`（Antd按需加载、主题等）、`Arco design`
- 图片、`fonts`、数据资源(`JSON`、`csv`、`tsv`等)
- 热更新、资源压缩、代码分离（动态导入、懒加载等）、缓存
- ......

# 1、依赖管理

这里使用 `pnpm`，至于为什么，一个字：快、省、狠！详细信息可以看[这里](https://pnpm.io/zh/installation)，因为本系列不会涉及到更高阶的功能，这里只介绍基本使用：
| Commond           | Meaning                  |
| ----------------- | ------------------------ |
| pnpm add sax (-S) | 安装到 `dependencies`    |
| pnpm add sax -D   | 安装到 `devDependencies` |
| pnpm add sax -g   | 安装到全局               |

```shell
# 初始化package.json文件
pnpm init  
```

会在根目录生成一个`package.json`文件：

```json
{
  "name": "fe",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

# 2、基本项目结构

在根目录新建基本的项目结构：

```txt
├── build
|   ├── webpack.base.ts # 公共配置
|   ├── webpack.dev.ts  # 开发环境配置
|   └── webpack.prod.ts # 打包环境配置
├── public
│   └── index.html # html模板
├── src
|   ├── App.tsx 
|   ├── App.css
│   └── index.tsx # react应用入口页面
└── package.json
```

`index.html`内容：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack5-react-ts</title>
</head>
<body>
  <!-- 容器节点 -->
  <div id="root"></div>
</body>
</html>
```

# 3、引入React

安装依赖：

```shell
pnpm add react react-dom
pnpm add @types/react @types/react-dom -D
```

接下来先将入口文件 `src/index.tsx` 写好：

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// const root = document.getElementById('root');
const root = document.querySelector('#root')

if(root) {
  createRoot(root).render(<App />)
}
```

`App.css`：

```css
h2 {
    color: red;
}
```

以及`App.tsx`：

```tsx
import React from 'react'
import './App.css'

function App() {
  return <h2>Hello East_White</h2>
}

export default App
```

# 4、引入TypeScript

安装依赖：

```shell
pnpm add typescript -D
pnpm add babel-loader ts-node @babel/core @babel/preset-react @babel/preset-typescript @babel/preset-env core-js -D
```
>
> - 由于`webpack`默认只能识别`js`文件，不能识别`jsx`语法，需要配置`loader`的预设预设 `@babel/preset-typescript` 来先将`ts`语法转换为`js`语法，再借助预设 `@babel/preset-react` 来识别`jsx`语法。
>
> - `ts-node`：编译ts文件，它可以立即编译并执行指定的TypeScript文件，因此不需要单独的编译步骤。
> - `babel-loader`: 使用 `babel` 加载最新js代码并将其转换为 `ES5`（上面已经安装过）
> - `@babel/corer`: `babel` 编译的核心包
> - `@babel/preset-env`: `babel` 编译的预设，可以转换目前最新的`js`标准语法
> - `core-js`: 使用低版本`js`语法模拟高版本的库，也就是垫片
>
> 现在`js`不断新增很多方便好用的标准语法来方便开发，甚至还有非标准语法比如装饰器，都极大的提升了代码可读性和开发效率。但前者标准语法很多低版本浏览器不支持，后者非标准语法所有的浏览器都不支持。需要把最新的标准语法转换为低版本语法，把非标准语法转换为标准语法才能让浏览器识别解析，而babel就是来做这件事的，这里只讲配置，更详细的可以看[Babel 那些事儿](https://juejin.cn/post/6992371845349507108)。

初始化`tsconfig.json`：

```shell
./node_modules/typescript/bin/tsc --init

# 如果全局安装了typescript，也可以通过下面的命令创建
tsc --init
```

就会在根目录生成一个`tsconfig.json`文件：

```json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
    // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
    // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */

    /* Modules */
    "module": "commonjs",                                /* Specify what module code is generated. */
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    // "moduleResolution": "node",                       /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "resolveJsonModule": true,                        /* Enable importing .json files. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    // "outDir": "./",                                   /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types. */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */

    /* Type Checking */
    "strict": true,                                      /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}
```

# 5、webpack配置
>
>既然都使用了`typescript`，那就尽可能都使用`ts`编写，所以，`webpack`配置文件，我们也将会用ts来写~

安装依赖：

```shell
pnpm add webpack webpack-cli -D
```

## 5.1 webpack.base.ts

配置`webpack.base.ts`文件：

```typescript
import { Configuration } from 'webpack';
const path = require("path");

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  // 打包出口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  // loader 配置
  module: {
    rules: [],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  // plugins 的配置
  plugins: []
};
```

>PS：[path.resolve 与 path.join 的区别](https://juejin.cn/post/6844903861920989198)

将会出现以下问题：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/144a1c6f8e7d47e4a7392406537b7be3~tplv-k3u1fbpfcp-watermark.image?)
需要我们安装 `@types/node` 这个依赖：

```shell
pnpm add @types/node -D
```

错误消失~ 错误虽然消失了，但是这个库是干嘛用的呢？看官方`npm`包的介绍：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f1433102d92480a8b3c8bf59f588136~tplv-k3u1fbpfcp-watermark.image?)
>这是由于typescript自身的机制，需要一份`xx.d.ts`声明文件，来说明模块对外公开的方法和属性的类型以及内容。对于内建模块，安装一个`@types/node`模块可以整体解决模块的声明文件问题。

让我们回到`TypeScript`的基本理念。`TypeScript`希望所有全局使用的代码都是类型化的，当你的项目有一个合理的配置时，它对你自己的代码也是如此。`TypeScript`库本身只包含`TypeScript`包的代码类型。你可以为一个库编写自己的类型，但这几乎是不需要的 —— 因为`TypeScript`社区已经为我们做了这个工作。

与`npm`一样，`TypeScript`世界也在庆祝开源代码。社区很活跃，不断对常用的`npm`包的更新和变化做出反应。你几乎总能找到npm包的类型，所以你不必单独为你的成千上万的依赖创建类型。

通常，现有软件包的类型可以从`npm`内部的 `@types`组织中找到，你可以通过安装一个带有`@types/`前缀的软件包名称的`npm`包将相关类型添加到你的项目中。比如说`npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose`等等，等等。 `@types/*` 由[Definitely typed](http://definitelytyped.org/)维护，这是一个社区项目，目的是在一个地方维护所有的类型。

有时，一个`npm`包也可以在代码中包含它的类型，在这种情况下，安装相应的 `@types/*` 就没有必要。

> - 由于类型只在编译前使用，所以在生产构建中不需要类型，它们应该放在`package.json`的`devDependencies`中。
>
> - 比如后面我们会用到的全局变量：`process`，是由Node本身定义的，我们从包 `@types/node`中获得其类型。
>
> - 从`10.0`版本开始，`ts-node`已经将 `@types/node`定义为一个[对等依赖](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies)。如果你使用的是npm，npm的版本至少是7.0，那么一个项目的对等依赖就会自动被npm安装。如果你有一个更老的npm，同行依赖必须明确安装。
>
> 关于TypeScript的类型声明，可以阅读这位同学写的入门指南：[TypeScript类型声明完全指南](https://www.pengfeixc.com/blogs/javascript/typescript-declarations)

另外因为我们在`App.tsx`中引入了`css`文件，所以还需要安装相关的`loader`：

```shell
pnpm add style-loader css-loader -D
```

完善 `webpack.base.ts`：

```typescript
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const path = require("path");

const baseConfig: Configuration = {
  entry: path.join(__dirname, "../src/index.tsx"), // 入口文件
  // 打包出口文件
  output: {
    filename: "static/js/[name].js", // 每个输出js的名称
    path: path.join(__dirname, "../dist"), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: "/", // 打包后文件的公共前缀路径
  },
  // loader 配置
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: {
          loader: "babel-loader",
          options: {
            // 预设执行顺序由右往左,所以先处理ts,再处理jsx
            presets: [
                [
                  "@babel/preset-env",
                  {
                    // 设置兼容目标浏览器版本,也可以在根目录配置.browserslistrc文件,babel-loader会自动寻找上面配置好的文件.browserslistrc
                    targets: { browsers: ["> 1%", "last 2 versions", "not ie <= 8"] },
                    useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                    corejs: 3, // 配置使用core-js使用的版本
                    loose: true,
                  },
                ],
                // 如果您使用的是 Babel 和 React 17，您可能需要将 "runtime": "automatic" 添加到配置中。
                // 否则可能会出现错误：Uncaught ReferenceError: React is not defined
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript",
              ],
          },
        },
      },
      {
        test: /.css$/, //匹配 css 文件
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  // plugins
  plugins: [
    new HtmlWebpackPlugin({
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, "../public/index.html"),
      // 压缩html资源
      minify: {
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
      },
    }),
  ],
};

export default baseConfig
```

因为`webpack.base.ts`文件承载了基本的配置，随着`webpack`做的事情越来越多，会逐渐变得很庞大，我们可以将其中的`babel-loader`相关的配置抽离出来进行管理。在根目录新建`babel.config.js`：

```ts
module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  presets: [
    [
      "@babel/preset-env",
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        targets: { browsers: ["> 1%", "last 2 versions", "not ie <= 8"] },
        useBuiltIns: "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3, // 配置使用core-js使用的版本
        loose: true,
      },
    ],
    // 如果您使用的是 Babel 和 React 17，您可能需要将 "runtime": "automatic" 添加到配置中。
    // 否则可能会出现错误：Uncaught ReferenceError: React is not defined
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
};
```

然后在`webpack.base.ts`文件中，就可以将`babel-loader`配置简化成：

```ts
 // ... 
 module: {
    rules: [
      {
        test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
        use: "babel-loader"
      },
      // ...
    ],
  },
 // ...
```

## 5.2 webpack.dev.ts

接下来，我们需要通过`webpack-dev-server`来启动我们的项目，所以需要安装相关的依赖：

```shell
pnpm add webpack-dev-server html-webpack-plugin webpack-merge -D
```

接着，配置开发环境配置：`webpack.dev.ts`

```typescript
import path from "path";
import { merge } from "webpack-merge";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import baseConfig from "./webpack.base";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const host = "127.0.0.1";
const port = "8082";

// 合并公共配置,并添加开发环境配置
const devConfig: Configuration = merge(baseConfig, {
  mode: "development", // 开发模式,打包更加快速,省了代码优化步骤
  devtool: "eval-cheap-module-source-map",
  devServer: {
    host,
    port,
    open: true, // 是否自动打开
    compress: false, // gzip压缩,开发环境不开启，提升热更新速度
    hot: true, // 开启热更新
    historyApiFallback: true, // 解决history路由404问题
    setupExitSignals: true, // 允许在 SIGINT 和 SIGTERM 信号时关闭开发服务器和退出进程。
    static: {
      directory: path.join(__dirname, "../public"), // 托管静态资源public文件夹
    },
    headers: { "Access-Control-Allow-Origin": "*" },
  },
});

export default devConfig;
```

>开发环境推荐：`eval-cheap-module-source-map`
>
> - 本地开发首次打包慢点没关系，因为 eval 缓存的原因，热更新会很快
> - 开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上 cheap
> - 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 module

然后再 `package.json` 中添加启动脚本：

```json
"scripts": {
  "dev": "webpack serve -c build/webpack.dev.ts"
},
```

正当我们准备启动项目的时候，发现还有一个错误：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/471b68584ac04d34bc8a1e63b65a894c~tplv-k3u1fbpfcp-watermark.image?)
只需要在`tsconfig.json`中加入一行`"jsx": "react-jsx"`即可：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "esModuleInterop": true,
    "module": "commonjs",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "jsx": "react-jsx" // 这里改成react-jsx，就不需要在tsx文件中手动引入React了
  },
  "include": ["./src"]
}
```

回到`App.tsx`，可以发现`React`的`import`变灰了：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e682ec872ae4aa3b060a6342c1ad509~tplv-k3u1fbpfcp-watermark.image?)
> 从`React v17`开始，我们就不需要再显式`import React from 'react'`了。

运行 `pnpm run dev` 脚本启动项目，就可以看到页面跑出来了！

## 5.3 webpack.prod.ts

配置 `webpack.prod.ts`：

```typescript
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.base";

const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
});

export default prodConfig;
```

>打包环境推荐：`none(就是不配置devtool选项了，不是配置devtool: 'none')`
>
> 1. `none`话调试只能看到编译后的代码，也不会泄露源代码，打包速度也会比较快。
> 2. 只是不方便线上排查问题, 但一般都可以根据报错信息在本地环境很快找出问题所在

在`package.json`中添加：

```json
"scripts": {
    // ...
    "build": "webpack -c build/webpack.prod.ts"
},
```

运行`pnpm run build`，如果想看打包结果，可以通过一个小工具来查看：

```shell
# 如果之前使用npm，最简单的方法就是使用如下命令
npm i serve -g

# 如果是首次使用pnpm安装全局依赖，通过如下命令
pnpm setup
source ~/.zshrc
pnpm add serve -g
```

然后通过`serve -S dist`命令，启动一个服务来查看打包结果，如果不出意外，打开控制台启动的服务，就能看到页面了！

## 5.4 copy 静态资源

一般`public`文件夹都会放一些静态资源,可以直接根据绝对路径引入，比如图片、`css`、`js`文件等，不需要`webpack`进行解析，只需要打包的时候把`public`下内容复制到构建出口文件夹中，可以借助 [copy-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcopy-webpack-plugin) 插件，安装依赖：

```shell
pnpm add copy-webpack-plugin -D
```

修改 `webpack.base.ts`：

```ts
// ...
const baseConfig: Configuration = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      title: "webpack5-react-ts",
      filename: "index.html",
      // 复制 'index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: path.join(__dirname, "../public/index.html"),
      inject: true, // 自动注入静态资源
      hash: true,
      cache: false,
      // 压缩html资源
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true, //去空格
        removeComments: true, // 去注释
        minifyJS: true, // 在脚本元素和事件属性中缩小JavaScript(使用UglifyJS)
        minifyCSS: true, // 缩小CSS样式元素和样式属性
      },
      nodeModules: path.resolve(__dirname, "../node_modules"),
    }),
    new DefinePlugin({
      "process.env": JSON.stringify(envConfig.parsed),
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

export default baseConfig;
```

开发环境已经在`devServer`中配置了`static`托管了`public`文件夹，在开发环境使用绝对路径可以访问到`public`下的文件，但打包构建时不做处理会访问不到，所以现在需要在打包配置文件`webpack.prod.ts`中新增`copy`插件配置。

```ts
import path from "path";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import CopyPlugin from "copy-webpack-plugin";
import baseConfig from "./webpack.base";

const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"), // 复制public下文件
          to: path.resolve(__dirname, "../dist"), // 复制到dist目录中
          filter: (source) => !source.includes("index.html"), // 忽略index.html
        },
      ],
    }),
  ],
});

export default prodConfig;
```

测试一下，在`public`中新增一个`favicon.ico`图标文件（找不到的去我 [GitHub repo](https://github.com/ian-kevin126/react18-ts4-webpack5-starter/tree/cha-01) download），在`index.html`中引入：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- 绝对路径引入图标文件 -->
  <link data-n-head="ssr" rel="icon" type="image/x-icon" href="/favicon.ico">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>webpack5-react-ts</title>
</head>
<body>
  <!-- 容器节点 -->
  <div id="root"></div>
</body>
</html>
```

再执行`pnpm run build:dev`打包，就可以看到`public`下的`favicon.ico`图标文件被复制到`dist`文件中了。

有同学可能会遇到`favicon`不显示的问题，提供以下思路进行处理：

1. 在head添加了`favicon`没生效，但是新开标签页直接访问图片可以访问到。

```html
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
```

2. 改图片尺寸格式依然没显示，直接复制其他网站正常`favaicon.ico`，排除格式的原因。
3. 语法问题，尝试各种写法。

```html
<link rel="icon" href="/favicon.ico"">
<link rel="shortcut" href="/favicon.ico" type="image/x-icon">
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
```

4. 添加版本号，favicon正常显示，排除语法原因。

```html
<link rel="shortcut icon" href="/favicon.ico?v=1.0" type="image/x-icon">
```

5. 继续深入查找问题，`F12`查看`html`和`network`，发现`favicon.ico`的请求没有。
6. 没有`favicon`的请求，不会显示图片，怀疑是浏览器缓存问题，清除缓存后依然没有请求。
7. 打开其它浏览器，发现`favicon`正常显示，进一步确定是浏览器缓存。
8. 关闭标签页，重新打开浏览器，最后`favicon.ico`正常显示。
9. `chrome`浏览器，前端资源经常会产生缓存问题，清空或禁用缓存也不一定有效。可以尝试重启浏览器，或者重启电脑。

# 6、配置环境变量

## 6.1 corss-env + DefinePlugin

环境变量按作用分为两种：

1. 区分是开发模式还是打包构建模式
2. 区分项目业务环境，开发/测试/预测/正式环境

>区分开发模式还是打包构建模式可以用`process.env.NODE_ENV`，因为很多第三方包里面判断都是采用的这个环境变量。

>区分项目接口环境可以自定义一个环境变量`process.env.BASE_ENV`，设置环境变量可以借助 [cross-env](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcross-env) 和[webpack.DefinePlugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.webpackjs.com%2Fplugins%2Fdefine-plugin%2F) 来设置。

- `cross-env`：运行跨平台设置和使用环境变量的脚本，兼容各系统的设置环境变量的包
- `webpack.DefinePlugin`：`webpack`内置的插件,可以为业务代码注入环境变量

`cross-env`解决的问题：当您使用`NODE_ENV =production`，来设置环境变量时，大多数`Windows`命令提示将会阻塞(报错)。 （异常是`Windows`上的`Bash`，它使用本机`Bash`。）同样，`Windows`和`POSIX`命令如何使用环境变量也有区别。 使用`POSIX`，您可以使用：`$ ENV_VAR`和使用`％ENV_VAR％`的`Windows`。

安装 `cross-env`：

```shell
pnpm add cross-env -D
```

修改 `package.json` 的`scripts`：

```json
"scripts": {
    "dev:dev": "cross-env NODE_ENV=development BASE_ENV=development webpack serve -c build/webpack.dev.ts",
    "dev:test": "cross-env NODE_ENV=development BASE_ENV=test webpack serve -c build/webpack.dev.ts",
    "dev:pre": "cross-env NODE_ENV=development BASE_ENV=pre webpack serve -c build/webpack.dev.ts",
    "dev:prod": "cross-env NODE_ENV=development BASE_ENV=production webpack serve -c build/webpack.dev.ts",
    "build:dev": "cross-env NODE_ENV=production BASE_ENV=development webpack -c build/webpack.prod.ts",
    "build:test": "cross-env NODE_ENV=production BASE_ENV=test webpack -c build/webpack.prod.ts",
    "build:pre": "cross-env NODE_ENV=production BASE_ENV=pre webpack -c build/webpack.prod.ts",
    "build:prod": "cross-env NODE_ENV=production BASE_ENV=production webpack -c build/webpack.prod.ts"
},
```

>`process.env.NODE_ENV`环境变量`webpack`会自动根据设置的`mode`字段来给业务代码注入对应的`development`和`prodction`，这里在命令中再次设置环境变量`NODE_ENV`是为了在`webpack`和`babel`的配置文件中访问到。

在`webpack.base.ts`中打印一下设置的环境变量

```typescript
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
```

执行 `pnpm run build:dev`，就可以在控制台打印出：

```typescript
// NODE_ENV production
// BASE_ENV development
```

当前是打包模式，业务环境是开发环境，这里需要把`process.env.BASE_ENV`注入到业务代码里面，就可以通过该环境变量设置对应环境的接口地址和其他数据，要借助`webpack.DefinePlugin`插件。

修改`webpack.base.ts`

```typescript
const webpack = require('webpack')
module.export = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]
}
```

在根目录下新建`typings/global.d.ts`文件：

```typescript
declare module 'process' {
  global {
    namespace NodeJS {
      export interface ProcessEnv {
        BASE_ENV: 'development' | 'test' | 'pre' | 'production'
        NODE_ENV: 'development' | 'production'
      }
    }
  }
}
```

并在`tsconfig.json`中配置：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "esModuleInterop": true,
    "module": "commonjs",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "typeRoots": ["./typings/*.d.ts", "node_modules/@types"],
    "jsx": "react-jsx" // react18这里改成react-jsx，就不需要在tsx文件中手动引入React了
  },
  "include": ["./src", "./typings/*.d.ts"]
}
```

配置后会把值注入到业务代码里面去，`webpack`解析代码匹配到`process.env.BASE_ENV`，就会设置到对应的值。测试一下，在`src/index.tsx`打印一下两个环境变量：

>需要注意的是，业务环境要能访问`process`，需要安装：`pnpm add @types/node -D`

```tsx
// src/index.tsx
// ...
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
```

执行`pnpm run dev:test`，可以在浏览器控制台看到打印的信息：

```tsx
// NODE_ENV development
// BASE_ENV test
```

>当前是开发模式，业务环境是测试环境。
>
## 6.2 配置多环境运行配置

安装依赖：

```shell
pnpm add dotenv
```

在根目录下新建一个多文件配置文件夹 `env`：

```txt
├── env
   ├── .env.development # 开发环境
   ├── .env.test # 测试环境
   ├── .env.pre # 预发布环境
   └── .env.production # 生产环境
```

文件中可以配置任意我们需要的变量：

```txt
// env/.env.development
REACT_APP_API_URL=https://api-dev.com

// env/.env.test
REACT_APP_API_URL=https://api-test.com

// env/.env.pre
REACT_APP_API_URL=https://api-pre.com

// env/.env.production
REACT_APP_API_URL=https://api-prod.com
```

然后再`webpack.base.ts`中引入，然后解析对应环境配置，最后通过`DefinePlugin`进行注入：

```ts
import path from "path";
import { Configuration, DefinePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import * as dotenv from "dotenv";

// 加载配置文件
const envConfig = dotenv.config({
  path: path.resolve(__dirname, "../env/.env." + process.env.BASE_ENV),
});

// console.log("process.env", process.env);
// console.log("NODE_ENV", process.env.BASE_ENV);
// console.log("REACT_APP_API_URL", process.env.REACT_APP_API_URL);

const baseConfig: Configuration = {
  // ...
  plugins: [
    // 注入到业务
    new DefinePlugin({
      "process.env": JSON.stringify(envConfig.parsed),
      "process.env.BASE_ENV": JSON.stringify(process.env.BASE_ENV),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ].filter(Boolean),
};

export default baseConfig;
```

业务代码中使用：

```tsx
import { createRoot } from 'react-dom/client';
import App from './App';

// const root = document.getElementById('root');
const root = document.querySelector('#root')

console.log('NODE_ENV', process.env.NODE_ENV)
console.log('BASE_ENV', process.env.BASE_ENV)
console.log("process.env", process.env);

if(root) {
  createRoot(root).render(<App />)
}å
```

然后重启项目：`pnpm run dev:dev`，就可以在控制台
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61c8729e8bd14ec282fff687e4c80d19~tplv-k3u1fbpfcp-watermark.image?)
还可以验证一下环境配置是否正确，启动打包：`pnpm run build:prod`，通过`serve -s dist`，启动项目：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2dbf6bcf835548b4b0e4af39f70c2043~tplv-k3u1fbpfcp-watermark.image?)
多运行环境配置成功！

# 7、文件别名

先在`webpack.base.ts`中配置：

```ts
resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"],
    // 别名需要配置两个地方，这里和 tsconfig.json
    alias: {
      "@": path.join(__dirname, "../src")
    },
    modules: [path.resolve(__dirname, "../node_modules")], // 查找第三方模块只在本项目的node_modules中查找
},
```

然后还需要在`tsconfig.json`中配置：

```json
{
  "compilerOptions": {
    // ... 
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
  },
}
```

然后就可以在项目中使用了~

```tsx
import '@/App.css'

function App() {
  return <h2>webpack5-react-ts</h2>
}

export default App
```

# 8、重启项目时在同一个浏览器Tab中打开页面

我们发现，每次运行`pnpm run dev:*`命令都会在当前浏览器打开新的`Tab`，虽然也不影响项目开发，但是很影响开发体验，可以参考`Create-React-App`的处理方式：
>参考：[create-react-app](https://link.zhihu.com/?target=https%3A//github.com/facebook/create-react-app/tree/main/packages/react-dev-utils) 的启动方式
>

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9efc08268a86464dbfeabceaf5bb02d5~tplv-k3u1fbpfcp-watermark.image?)
复制出这两个文件源码，将其放置在`build`下的`util`中：

```txt
build
   - util
     - openBrowser.js
     - openChrome.applescript
```

修改`webpack.dev.ts`：

```ts
import path from "path";
import { merge } from "webpack-merge";
import webpack, { Configuration as WebpackConfiguration } from "webpack";
import WebpackDevServer from "webpack-dev-server";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";
import baseConfig from "./webpack.base";

// 运行命令的时候重启一次打开一个tab 页很烦，所以呢优化一下
// 参考：create-react-app 的启动方式
// https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openChrome.applescript
// 记得关闭webpack-dev-server的配置中的自动打开 open: false 或者注释
const openBrowser = require("./util/openBrowser");

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const host = "127.0.0.1";
const port = "8082";

// 合并公共配置,并添加开发环境配置
const devConfig: Configuration = merge(baseConfig, {
  mode: "development", // 开发模式,打包更加快速,省了代码优化步骤
  /**
    开发环境推荐：eval-cheap-module-source-map
    - 本地开发首次打包慢点没关系,因为 eval 缓存的原因, 热更新会很快
    - 开发中,我们每行代码不会写的太长,只需要定位到行就行,所以加上 cheap
    - 我们希望能够找到源代码的错误,而不是打包后的,所以需要加上 module
   */
  devtool: "eval-cheap-module-source-map",
});

const devServer = new WebpackDevServer(
  {
    host, // 地址
    port, // 端口
    open: false, // 是否自动打开，关闭
    setupExitSignals: true, // 允许在 SIGINT 和 SIGTERM 信号时关闭开发服务器和退出进程。
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, "../public"), // 托管静态资源public文件夹
    },
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  webpack(devConfig)
);

devServer.start().then(() => {
  // 启动界面
  openBrowser(`http://${host}:${port}`);
});

export default devConfig;
```

重启项目，搞定~

> 项目的初始化就完成了，【[项目代码](https://github.com/ian-kevin126/react18-ts4-webpack5-starter/tree/cha-01)】，接下来，第二篇会引入一些基本的配置~
