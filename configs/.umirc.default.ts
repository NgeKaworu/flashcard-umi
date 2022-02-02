import { defineConfig } from 'umi';
import { IConfig } from 'umi/types';

export default defineConfig({
  qiankun: {
    slave: {},
  },
  nodeModulesTransform: {
    type: 'none',
  },
  dynamicImport: {
    loading: '@/Loading',
  },
  helmet: false,
  dva: false,
  model: false,
  initialState: false,
  layout: false,
  locale: false,
  preact: false,
  request: false,
  sass: false,
  hash: true,
  runtimePublicPath: true,
  externals: { moment: 'moment' },
  scripts: ['https://lib.baomitu.com/moment.js/latest/moment.min.js'],
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'gzip', // stat  // gzip
  },
  chunks: ['react', 'lodash', 'icons', 'antd', 'umi'],
  chainWebpack: (config) => {
    config.merge({
      optimization: {
        splitChunks: {
          minChunks: 1,
          cacheGroups: {
            icons: {
              name: 'icons',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]@ant-design[\\/](icons|icons-svg)[\\/]/,
              priority: 15,
            },
            antd: {
              name: 'antd',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](antd|rc-.*)[\\/]/,
              priority: 14,
            },
            react: {
              name: 'react',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
              priority: 13,
            },
            lodash: {
              name: 'lodash',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]lodash[\\/]/,
              priority: 12,
            },
          },
        },
      },
    });
  },
}) as IConfig;
