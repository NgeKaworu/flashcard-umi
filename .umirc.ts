import { defineConfig } from 'umi';
import theme from './src/theme'

export default defineConfig({
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
});
