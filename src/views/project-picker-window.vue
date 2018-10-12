<template>
    <section class="hero is-dark is-fullheight">
        <div class="hero-head">
            <div class="container">
                <h1 class="title p-md">
                    Project Selection
                </h1>
            </div>
        </div>
        <div class="hero-body">
            <div class="container has-text-centered">
                <article class="message is-primary">
                    <div class="message-header">
                        <p>Recent Projects</p>
                    </div>
                    <div class="message-body">

                    </div>
                </article>
                <a class="button is-primary m-sm" @click="showProjectModal = true">Create New Project</a>
                <!--
                <a class="button is-primary m-sm" @click="createNewProject()">Create New Project</a>
                <a class="button is-info m-sm" @click="openExistingProject()">Or Open Existing Project</a>
                <a class="button is-info m-sm" @click="openExampleProject()">Or View Example Project</a>-->
            </div>
        </div>
        <div id="project-creator-modal" class="modal" :class="{ 'is-active': showProjectModal }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <article class="message is-dark">
                    <div class="message-header">
                        <p>Project Templates</p>
                    </div>
                    <div class="message-body">
                        <div id="project-container" class="columns">
                            <div class="column">
                                <ul>
                                    <template v-for="(entry, index) in projectTemplates">
                                        <li>
                                            <button class="button is-info">{{entry.friendlyName}}</button>
                                        </li>
                                    </template>
                                </ul>
                            </div>
                            <div class="column">
                                {{entry.description}}
                            </div>
                        </div>

                        <button class="button" @click="showProjectModal = false">Cancel</button>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';
import {Getter, State, Mutation} from "vuex-class";

import {remote} from "electron";
import router from "../router";
import {EcsRxProject, exampleProject} from "@alchemist-editor/ecsrx";
import {NamespaceNodeGroup} from "@alchemist-editor/dotnet";
import {ProjectEntry, projectRegistry} from "@alchemist-editor/core";
const {dialog} = remote;

@Component({
    components: {  }
})
export default class extends Vue {
    @Mutation("loadProject")
    public loadProject;

    public showProjectModal = false;

    public get projectTemplates(): Array<ProjectEntry>{
        return projectRegistry.getProjects();
    }

    public createNewProject() {
        const directory = dialog.showOpenDialog({properties: ['openDirectory']})[0];
        const newProject = new EcsRxProject("Example Project 2", directory);
        newProject.nodeGroups.push(new NamespaceNodeGroup(true, "ExampleProject2"));
        this.loadProject(newProject);

        console.log("loading project", newProject);
        router.push('editor');
    }

    public openExistingProject() {
        const directory = dialog.showOpenDialog({properties: ['openDirectory']});
        console.log(directory);
    }

    public openExampleProject() {
        const directory = dialog.showOpenDialog({properties: ['openDirectory']})[0];
        exampleProject.outputDirectory = directory;
        this.loadProject(exampleProject);
        router.push('editor');
    }
}
</script>

<style lang="scss">
    @import "../styles/default/theme";

</style>
