import { defineConfig } from 'umi';
import theme from './src/theme';
import routes from './routes';
import base from './src/js-sdk/configs/.umirc.default';

export default defineConfig({
  ...base,
  title: '单词卡',
  theme,
  routes,
  base: '/flashcard',
  publicPath: '/micro/flashcard/',
  devServer: {
    port: 80,
    proxy: {
      '/api/flashcard': {
        target: 'http://localhost:8030',
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
});
