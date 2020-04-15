import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const time = resolve => require(['components/workSheet/timedeft'], resolve);
//设备
const sheet = resolve => require(['components/workSheet/sheet'], resolve);
const repair = resolve => require(['components/workSheet/repair'], resolve);
const detrep = resolve => require(['components/workSheet/det-repair'], resolve);
const detsheet = resolve => require(['components/workSheet/det-sheet'], resolve);
const calibration = resolve => require(['components/workSheet/calibration'], resolve);
const detCab = resolve => require(['components/workSheet/det-cab'], resolve);
const data = resolve => require(['components/workSheet/ss-data'], resolve);
const statistics = resolve => require(['components/workSheet/ss-statistics'], resolve);
const workload = resolve => require(['components/workSheet/ss-workload'], resolve);
const app = resolve => require(['components/workSheet/app'], resolve);
const knowledge = resolve => require(['components/workSheet/knowledge'], resolve);
const detKnow = resolve => require(['components/workSheet/det-know'], resolve);

// 设施
const timess = resolve => require(['components/workSheet_ss/timedeft'], resolve);
const sheetss = resolve => require(['components/workSheet_ss/sheet_ss'], resolve);
const detrepss = resolve => require(['components/workSheet_ss/det-repair_ss'], resolve);
const detsheetss = resolve => require(['components/workSheet_ss/det-sheet_ss'], resolve);
const contractss = resolve => require(['components/workSheet_ss/contract'], resolve);
// const detcontract = resolve => require(['components/workSheet_ss/det-contract'], resolve);
const material = resolve => require(['components/workSheet_ss/material'], resolve);
const detmaterial = resolve => require(['components/workSheet_ss/det-material'], resolve);
const contact = resolve => require(['components/workSheet_ss/contact'], resolve);

export default new Router({
    mode: 'hash',
    routes: [{
        path: '/contact',
        name: 'contact',
        component: contact,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/detmaterial',
        name: 'detmaterial',
        component: detmaterial
    }, {
        path: '/material',
        name: 'material',
        component: material,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/contractss',
        name: 'contractss',
        component: contractss,
    }, {
        path: '/detrepss',
        name: 'detrepss',
        component: detrepss,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/detsheetss',
        name: 'detsheetss',
        component: detsheetss
    }, {
        path: '/sheetss',
        name: 'sheetss',
        component: sheetss,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/app',
        name: 'app',
        component: app,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/workload',
        name: 'workload',
        component: workload
    }, {
        path: '/statistics',
        name: 'statistics',
        component: statistics
    }, {
        path: '/data',
        name: 'data',
        component: data
    }, {
        path: '/detCab',
        name: 'detCab',
        component: detCab,
    }, {
        path: '/calibration',
        name: 'calibration',
        component: calibration,
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
    }, {
        path: '/detrep',
        name: 'detrep',
        component: detrep,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/detsheet',
        name: 'detsheet',
        component: detsheet
    }, {
        path: '/repair',
        name: 'repair',
        component: repair,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/sheet',
        name: 'sheet',
        component: sheet,
        meta: {
            isUseCache: false,
            keepAlive: true
        }
    }, {
        path: '/timess',
        name: 'timess',
        component: timess
    }, ]
});