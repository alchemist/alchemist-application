<template>
    <div>
        <p class="notification is-info">Project Details</p>

        <section class="p-sm">
            <div class="field">
                <label class="label">Project Name</label>
                <div class="control">
                    <input class="input" type="text" placeholder="Project Name" v-model="project.projectName">
                </div>
            </div>

            <div class="field">
                <label class="label">Output Directory</label>
                <div class="control">
                    <input class="input" type="text" placeholder="Output Directory" v-model="project.outputDirectory">
                </div>
            </div>
        </section>

    </div>
</template>

<script lang="ts">

import {Prop, Component, Vue} from 'vue-property-decorator';
import {IProject} from "@alchemist/core";
import {State} from "vuex-class";

@Component
export default class extends Vue {

    @State(state => state.project.activeProject)
    public project: IProject;
}
</script>

<style lang="scss">

</style>