import { defineConfig } from 'umi';

export default defineConfig({
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
        // { redirect: '/record/' },
      ],
    },
  ],
});
