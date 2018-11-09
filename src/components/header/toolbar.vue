<template>
    <nav id="main-toolbar" class="navbar">
        <div class="navbar-start">
            <div class="navbar-item">
                <a class="button tooltip is-tooltip-right" data-tooltip="Save project changes" @click="saveProject()">
                    <span class="icon">
                      <i class="fas fa-save"></i>
                    </span>
                </a>
            </div>
            <div class="navbar-item">
                <a class="button tooltip" data-tooltip="Generate project code" @click="compileCode()">
                    <span class="icon">
                      <i class="fas fa-ship"></i>
                    </span>
                </a>
            </div>
            <hr class="navbar-divider">
            <div class="navbar-item">
                <a class="button tooltip" data-tooltip="Show codegen preview bar" :class="{'is-success': isContextSidebarVisible}" @click="showContextSideBar(!isContextSidebarVisible)">
                    <span class="icon">
                      <i class="fas fa-columns"></i>
                    </span>
                </a>
            </div>
            <div class="navbar-item">
                <a class="button tooltip" data-tooltip="Show folder exporer bar" :class="{'is-success': isFolderSidebarVisible}" @click="showFolderSideBar(!isFolderSidebarVisible)">
                    <span class="icon">
                      <i class="fas fa-columns"></i>
                    </span>
                </a>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Mutation, State} from "vuex-class";
    import {IProject, nodeGeneratorRegistry} from "@alchemist/core";
    import {generationManager} from "../../helpers/generation-helper"

    import { remote } from 'electron';
    const fs = remote.require('fs-extra');

    @Component
    export default class extends Vue {

        @State(state => state.project.activeProject)
        public project: IProject;

        @State(state => state.editor.showContextSideBar)
        public isContextSidebarVisible;

        @State(state => state.editor.showFolderSideBar)
        public isFolderSidebarVisible;

        @Mutation('showContextSideBar')
        public showContextSideBar;

        @Mutation('showFolderSideBar')
        public showFolderSideBar;

        public async saveProject() {
            const projectJson = JSON.stringify(this.project, null, 2);
            console.log("project", projectJson);

            await fs.writeFile(`${this.project.outputDirectory}/project.diagram`, projectJson);

            Vue["toasted"].success(
                "Project saved", {
                    duration: 3000,
                    icon : {
                        name : 'save'
                    }
                });
        }

        public async compileCode() {
            await generationManager.generateAll(this.project);
            Vue["toasted"].success(
                "Code generation complete", {
                    duration: 3000,
                    icon : {
                        name : 'ship'
                    }
                });
        }
    }

</script>

<style>

</style>