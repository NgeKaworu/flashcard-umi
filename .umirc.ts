import { defineConfig } from 'umi';
import theme from './src/theme';

export default defineConfig({
  title: '单词卡',
  qiankun: {
    slave: {},
  },
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  theme,
  routes: [
    {
      path: '/',
      component: '@/layouts/',
      routes: [
        { path: '/', redirect: '/record/' },
        { path: '/record/', component: 'record' },
        { path: '/review/', component: 'review' },
        // { redirect: '/record/' },
      ],
    },
  ],
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
  base: '/micro/flashcard',
  publicPath: '/micro/flashcard/',
  runtimePublicPath: true,
  devServer: {
    port: 80,
    proxy: {
      '/api/flashcard': {
        target: 'http://flashcard-go-dev',
        changeOrigin: true,
        pathRewrite: {
          '/api/flashcard': '',
        },
      },
    },
  },
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        namespace: 'flashcard',
      },
    ],
  ],
  externals: {
    moment: 'moment',
  },
  scripts: ['https://lib.baomitu.com/moment.js/latest/moment.min.js'],
});
