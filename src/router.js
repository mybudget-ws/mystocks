import Vue from 'vue';
import Router from 'vue-router';
import VueHead from 'vue-head';

import store from '@/store/index';

Vue.use(VueHead);
Vue.use(Router);

const DEFAULT_TITLE = 'Моя Биржа';

function requireAuth(to, from, next) {
  if (!store.getters['user/isSignedIn']) {
    next({ path: '/sign_in', query: { redirect: to.fullPath } });
  } else {
    next();
  }
}

function updateTitle(to, _from, next) {
  const symbol = to.params?.symbol;
  Vue.nextTick(() => {
    document.title = symbol || DEFAULT_TITLE;
  });
  next();
}

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/home'),
      beforeEnter: updateTitle
    }, {
      path: '/sign_in',
      name: 'sign_in',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/sign_in')
    }, {
      path: '/sign_up',
      name: 'sign_up',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/sign_up')
    }, {
      path: '/stocks',
      name: 'stocks',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/stocks/index'),
      beforeEnter: updateTitle
    }, {
      path: '/stocks/:symbol',
      name: 'stock',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/stocks/show'),
      beforeEnter: updateTitle
    }, {
      path: '/indexes/:symbol',
      name: 'index',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/indexes/show'),
      beforeEnter: updateTitle
    }, {
      path: '/indexes',
      name: 'indexes',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/indexes/index'),
      beforeEnter: updateTitle
    }, {
      path: '/instruments/:symbol',
      name: 'instrument',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/instruments/show'),
      beforeEnter: updateTitle
    }, {
      path: '/news',
      name: 'articles',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/news/index'),
      beforeEnter: updateTitle
    }, {
      path: '/dividends',
      name: 'dividends',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/dividends/index'),
      beforeEnter: updateTitle
    }, {
      path: '/signals',
      name: 'signals',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/signals/index'),
      beforeEnter: updateTitle
    }, {
      path: '/signals/stats',
      name: 'signals_stats',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/signals/stats'),
      beforeEnter: updateTitle
    }, {
      path: '/deals',
      name: 'deals',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/deals/index'),
      beforeEnter: updateTitle
    }, {
      path: '/settings/:tab',
      name: 'settings',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/settings/index'),
      beforeEnter: requireAuth
    }
    // }, {
    //   path: '*',
    //   component: () => import(/* webpackChunkName: "landing" */ '@/views/dynamic')
    // }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});
