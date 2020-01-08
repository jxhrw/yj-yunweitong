import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const equipment = resolve => require(['components/home/home_sb'], resolve);

export default new Router({
    mode: 'hash',
    routes: [{
        path: '/',
        name: 'equipment',
        component: equipment
    }]
});