import "core-js";

import Vue from 'vue'
import Vuex from "vuex";
Vue.use(Vuex);

import TreacherousPlugin from "@treacherous/vue";
Vue.use(TreacherousPlugin);

import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    iconPack : 'fontawesome'
});

import App from './App.vue'
import router from './router'

import "./filters/truncate";
import "./filters/capitalize";

import {viewStrategyRegistry} from "@treacherous/view";
import {TooltipViewStrategy} from "./validation/view-strats/tooltip-view-strategy";
const inlineStrat = viewStrategyRegistry.getStrategyNamed("inline");
viewStrategyRegistry.unregisterStrategy(inlineStrat);
viewStrategyRegistry.registerStrategy(new TooltipViewStrategy());

Vue.config.productionTip = false;

import {pluginContext, loadPlugins} from "./plugins";
const {store} = pluginContext;

const startApp = () => {
    console.log("Starting App");
    return new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');
};

loadPlugins().then(startApp);