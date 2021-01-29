import { defineConfig } from 'umi';

export default defineConfig({
  base: '/flash-card',
  publicPath: '/flash-card/',
  outputPath: './dist/flash-card',
  mountElementId: 'flash-card',
  qiankun: {
    slave: {},
  },
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/',
      routes: [
        { path: '/', redirect: '/record/' },
        { path: '/record/', component: 'record' },
        { path: '/review/', component: 'review' },
        { redirect: '/record/' },
      ],
    },
  ],
});
