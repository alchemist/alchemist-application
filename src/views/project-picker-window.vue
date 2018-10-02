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
                <a class="button is-primary m-sm" @click="createNewProject()">Create New Project</a>
                <a class="button is-info m-sm" @click="openExistingProject()">Or Open New Project</a>
                <a class="button is-info m-sm" @click="openExampleProject()">Or View Example Project</a>
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
const {dialog} = remote;

@Component({
    components: {

    }
})
export default class extends Vue {
    @Mutation("loadProject")
    public loadProject;

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
