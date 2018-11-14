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
import store from "./stores/store"

import "./filters/truncate";
import "./filters/capitalize";

import {
  nodeRegistry,
  nodeGeneratorRegistry,
  projectRegistry,
  PluginContext,
  codeProcessorRegistry, projectGeneratorRegistry
} from "@alchemist/core";

import {viewStrategyRegistry} from "@treacherous/view";
import {TooltipViewStrategy} from "@/validation/view-strats/tooltip-view-strategy";
const inlineStrat = viewStrategyRegistry.getStrategyNamed("inline");
viewStrategyRegistry.unregisterStrategy(inlineStrat);
viewStrategyRegistry.registerStrategy(new TooltipViewStrategy());

Vue.config.productionTip = false;

const pluginContext: PluginContext = {
  codeProcessorRegistry: codeProcessorRegistry,
  nodeGeneratorRegistry: nodeGeneratorRegistry,
  nodeRegistry: nodeRegistry,
  projectGeneratorRegistry: projectGeneratorRegistry,
  projectRegistry: projectRegistry,
  store: store
};

const startApp = () => {
    console.log("Starting App");
    return new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');
};

const registerNodes = () => {
    nodeRegistry.registerAllNodes();
};

const initPlugin = async (plugin: any) =>
{
    console.log("Starting Plugin", plugin);
    await plugin.setup(pluginContext)
};

const plugins = [
    "@/nodegen-dotnet/entry-point",
    "@/nodegen-ecsrx/entry-point"
];

const loadedPlugins = [
    import("@alchemist/dotnet"),
    import("@alchemist/ecsrx")
];

const loadAllPlugins = async (plugins) => {
    console.log("Found Plugins", plugins);
    await plugins.forEach(await initPlugin);
};


//Promise.all(plugins.map(x => import(x))) // TODO: This needs to be re-added later
Promise.all(loadedPlugins)
    .then(loadAllPlugins)
    .then(registerNodes)
    .then(startApp);
//    .then(loadExampleProject);
