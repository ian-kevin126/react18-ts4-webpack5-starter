import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.base";

const prodConfig: Configuration = merge(baseConfig, {
  mode: "production", // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  /**
   * 打包环境推荐：none(就是不配置devtool选项了，不是配置devtool: 'none')
   * ● none话调试只能看到编译后的代码,也不会泄露源代码,打包速度也会比较快。
   * ● 只是不方便线上排查问题, 但一般都可以根据报错信息在本地环境很快找出问题所在。
   */
});

export default prodConfig;