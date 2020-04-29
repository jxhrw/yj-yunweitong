import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const old = resolve => require(['components/home/old_home_sb'], resolve);

export default new Router({
    mode: 'hash',
    routes: [{
        path: '/',
        name: 'old',
        component: old
    }, {
        path: '/old',
        name: 'old',
        component: old
    }]
});