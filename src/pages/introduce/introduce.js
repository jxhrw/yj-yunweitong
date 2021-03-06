import Vue from 'vue';
import router from './router';
import Index from './index.vue';
import Factory from '@/assets/js/factory.js';
import store from '../../store';
var factory = new Factory();
// api.get('./config.json').then((res) => {
    // factory.loadJS(`${res.serverPushUrl}`, () => {
        factory.init(process.env, () => {
            // Vue.prototype.$config = res;
            var vue = new Vue({
                el: '#app',
                router,
                store,
                components: {
                    Index
                },
                template: '<Index/>'
            });
        }, {});
    // });
// });
Vue.prototype.$factory = factory;