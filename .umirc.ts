import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/cacheTime', component: '@/pages/cache/cacheTime' },
    // { path: '/cache', component: '@/pages/cache' },
  ],
  fastRefresh: {},
});
