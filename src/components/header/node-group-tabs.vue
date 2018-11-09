<template>
    <div class="tabs is-boxed">
        <ul>
            <template v-for="(group, index) in project.nodeGroups">
                <li :class="{ 'is-active': index == selectedGroupIndex }" @click.left="selectGroup(index)">
                    <a>
                        <span class="icon is-small"><i class="fas fa-file-code" aria-hidden="true"></i></span>
                        <span>{{group.displayName}}</span>
                    </a>
                </li>
            </template>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Mutation, State} from "vuex-class";
    import {IProject} from "@alchemist/core";

    @Component
    export default class extends Vue
    {
        @State(state => state.project.activeProject)
        public project: IProject;

        @State(state => state.editor.selectedGroupIndex)
        public selectedGroupIndex;

        @Mutation('selectGroup')
        public selectGroup;
    }

</script>

<style>

</style>