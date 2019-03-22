<template>
    <section class="hero is-dark is-fullheight">
        <div class="hero-head">
            <div class="header-section" ref="headerElement">
                <main-menu></main-menu>
                <toolbar></toolbar>
                <node-group-tabs></node-group-tabs>
            </div>
        </div>
        <div id="main-area" class="hero-body m-none p-none is-fullwidth is-fullheight">
            <div id="main-section">
                <div id="side-bar-left" class="has-background-grey" v-if="showFolderSideBar">
                    <navigation-bar></navigation-bar>
                </div>
                <div id="editor-section">
                    <diagram></diagram>
                </div>
                <div id="side-bar-right" class="has-background-grey" v-if="showContextSideBar">
                    <project-bar v-if="!hasSelectedNode"></project-bar>
                    <node-bar v-if="hasSelectedNode"></node-bar>
                </div>
            </div>
        </div>
        <div class="hero-foot">
        </div>
    </section>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import {Getter, Mutation, State} from "vuex-class";
import debounce from "lodash/debounce";

import {default as Diagram} from "../components/editor/diagram.vue";
import {default as ProjectBar} from "../components/context-bars/project-bar.vue";
import {default as NodeBar} from "../components/context-bars/node-bar.vue";
import {default as MainMenu} from "../components/header/main-menu.vue";
import {default as Toolbar} from "../components/header/toolbar.vue";
import {default as NodeGroupTabs} from "../components/header/node-group-tabs.vue";

import NavigationBar from "../components/context-bars/navigation-bar.vue";

@Component({
    components: {
        NavigationBar,
        Diagram, ProjectBar, NodeBar, MainMenu, Toolbar, NodeGroupTabs
    }
})
export default class extends Vue {
    @State(state => state.editor.showContextSideBar)
    public showContextSideBar;

    @State(state => state.editor.showFolderSideBar)
    public showFolderSideBar;

    @Mutation("updateHeaderHeight")
    public updateHeaderHeight;

    public get hasSelectedNode()
    { return this.$store.state.editor.selectedNode != null; }

    public mounted(){

        const getCurrentHeight = () => {
            const headerElement = <HTMLElement>this.$refs.headerElement;
            const height = window.getComputedStyle(headerElement, null)
                .getPropertyValue("height");

            return parseFloat(height.replace("px", ""));
        };

        const handleResize = debounce(() => {
            const currentHeight = getCurrentHeight();
            this.updateHeaderHeight(currentHeight);
        }, 500);

        window.addEventListener('resize', handleResize);
        const currentHeight = getCurrentHeight();
        this.updateHeaderHeight(currentHeight);
    }
}
</script>

<style lang="scss">
    @import "../styles/default/theme";

    #main-menu
    {
        z-index: 100;
    }

    #main-area
    {
        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        padding-right: 0;
        display: flex;
        flex-direction: column;
    }

    #main-section
    {
        display: flex;
        flex: 1;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
    }

    #editor-section
    {
        flex: 1;
    }

    #side-bar-right
    {
        display: flex;
        width: 35em;

        &>div
        { width: 100%; }
    }

    #side-bar-left
    {
        display: flex;
        width: 20em;
    }
</style>
