import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const facilities = resolve => require(['components/home/home_ss'], resolve);

export default new Router({
    mode: 'hash',
    routes: [{
        path: '/',
        name: 'facilities',
        component: facilities
    }]
});