import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const knowledge = resolve => require(['components/workSheet/knowledge'], resolve);
const detKnow = resolve => require(['components/workSheet/det-know'], resolve);

// 系统
const sheetxt = resolve => require(['components/workSheet_xt/sheet_xt'], resolve);
const detrepxt = resolve => require(['components/workSheet_xt/det-repair_xt'], resolve);
const detsheetxt = resolve => require(['components/workSheet_xt/det-sheet_xt'], resolve);

export default new Router({
    mode: 'hash',
    routes: [{
        path: '/detrepxt',
        name: 'detrepxt',
        component: detrepxt,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/detsheetxt',
        name: 'detsheetxt',
        component: detsheetxt
        // }, {
        //     path: '/repairxt',
        //     name: 'repairxt',
        //     component: repairxt,
        //     meta: {
        //         isUseCache: false,
        //         keepAlive: true
        //     }
    }, {
        path: '/sheetxt',
        name: 'sheetxt',
        component: sheetxt,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
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
    }, ]
});