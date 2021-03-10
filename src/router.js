import Vue from 'vue';
import Router from 'vue-router';
import VueHead from 'vue-head';

import store from '@/store/index';

Vue.use(VueHead);
Vue.use(Router);

function requireAuth(to, from, next) {
  if (!store.getters['user/isSignedIn']) {
    next({ path: '/sign_in', query: { redirect: to.fullPath } });
  } else {
    next();
  }
}

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "landing" */ '@/views/home')
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
      component: () => import(/* webpackChunkName: "inner" */ '@/views/stocks/index')
    }, {
      path: '/stocks/:id',
      name: 'stock',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/stocks/show')
    }, {
      path: '/indexes/:id',
      name: 'index',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/indexes/show')
    }, {
      path: '/indexes',
      name: 'indexes',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/indexes/index')
    }, {
      path: '/news',
      name: 'news',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/news/index')
    }, {
      path: '/settings/:tab',
      name: 'settings',
      component: () => import(/* webpackChunkName: "inner" */ '@/views/settings/index'),
      beforeEnter: requireAuth
    }
    // {
    //   path: '/transactions/:id/edit',
    //   name: 'edit_transaction',
    //   component: () => import(/* webpackChunkName: "inner" */ '@/views/transactions/edit'),
    //   beforeEnter: requireAuth
    // }, {
    //   path: '/transactions/transfers/new',
    //   name: 'new_transfer',
    //   component: () => import(/* webpackChunkName: "inner" */ '@/views/transactions/new_transfer'),
    //   beforeEnter: requireAuth
    // }, {
    //   path: '/accounts',
    //   name: 'accounts',
    //   component: () => import(/* webpackChunkName: "inner" */ '@/views/accounts/index'),
    //   beforeEnter: requireAuth
    // }, {
    //   path: '/accounts/new',
    //   name: 'new_account',
    //   component: () => import(/* webpackChunkName: "inner" */ '@/views/accounts/new'),
    //   beforeEnter: requireAuth
    // }, {
    //   path: '/accounts/:id/edit',
    //   name: 'edit_account',
    //   component: () => import(/* webpackChunkName: "inner" */ '@/views/accounts/edit'),
    //   beforeEnter: requireAuth
    // }, {
    //   path: '/settings/:tab',
    //   name: 'settings',
    //   component: () => import(/* webpackChunkName: "inner" */ '@/views/settings/index'),
    //   beforeEnter: requireAuth
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
