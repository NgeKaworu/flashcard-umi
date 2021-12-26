export default [
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
];
