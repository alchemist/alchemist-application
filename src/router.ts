import Vue from 'vue'
import Router from 'vue-router'
import MainWindow from './views/main-window.vue'
import ProjectPicker from './views/project-picker-window.vue'
import store from "./stores/store";

Vue.use(Router);

export default new Router({
  routes: [
    {
        path: '/',
        name: 'project-picker',
        component: ProjectPicker
    },
    {
        path: '/editor',
        name: 'editor',
        component: MainWindow,
        beforeEnter: (to, from, next) => {
            console.log("loaded", store.getters.hasLoadedProject);
            if(store.getters.hasLoadedProject)
            { next(); }
            else
            { next({ name: "project-picker" }) }
        }
    }
  ]
})
