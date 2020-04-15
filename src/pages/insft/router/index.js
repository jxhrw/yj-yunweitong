import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);


const knowledge = resolve => require(['components/workSheet/knowledge'], resolve);
const detKnow = resolve => require(['components/workSheet/det-know'], resolve);

//其他系统（应用软件）
const sheetrj = resolve => require(['components/workSheet_rj/sheet_rj'], resolve);
const detreprj = resolve => require(['components/workSheet_rj/det-repair_rj'], resolve);
const detsheetrj = resolve => require(['components/workSheet_rj/det-sheet_rj'], resolve);
const timerj = resolve => require(['components/workSheet_rj/timedeft'], resolve);
const contractrj = resolve => require(['components/workSheet_rj/contract'], resolve);

export default new Router({
    mode: 'hash',
    routes: [{
        path: '/contractrj',
        name: 'contractrj',
        component: contractrj,
    }, {
        path: '/timerj',
        name: 'timerj',
        component: timerj,
    }, {
        path: '/detKnow',
        name: 'detKnow',
        component: detKnow,
    }, {
        path: '/knowledge',
        name: 'knowledge',
        component: knowledge,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/detreprj',
        name: 'detreprj',
        component: detreprj,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/detsheetrj',
        name: 'detsheetrj',
        component: detsheetrj
    }, {
        path: '/sheetrj',
        name: 'sheetrj',
        component: sheetrj,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }]
});