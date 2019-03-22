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
                        <div id="project-container" class="tile is-ancestor">
                            <div class="tile is-6 is-vertical is-parent">
                                <div class="tile is-child box">
                                    <ul>
                                        <template v-for="(descriptor, index) in projectTemplates">
                                            <li class="m-sm p-sm" @click="projectForm.projectType = descriptor.projectType"
                                                :class="{ 'has-background-success': projectForm.projectType == descriptor.projectType, 'has-background-light': projectForm.projectType != descriptor.projectType }">
                                                <span class="tag is-dark">{{descriptor.tagName}}</span>
                                                <span class="m-l-md">{{descriptor.title}}</span>
                                            </li>
                                        </template>

                                        <li class="m-sm p-sm has-background-light">
                                            <span class="tag is-dark">ecsrx</span>
                                            <span class="m-l-md">EcsRx Unity Project</span>
                                        </li>
                                        <li class="m-sm p-sm has-background-light">
                                            <span class="tag is-dark">ecsrx</span>
                                            <span class="m-l-md">EcsRx MG Project</span>
                                        </li>
                                        <li class="m-sm p-sm has-background-light">
                                            <span class="tag is-dark">mvc</span>
                                            <span class="m-l-md">ASP MVC Project</span>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div class="tile is-parent">
                                <div class="tile is-child box">
                                    {{projectTypeDescription}}
                                </div>
                            </div>
                        </div>
                        <div class="field is-horizontal">
                            <label class="field-label is-normal">Project Name</label>
                            <div class="field-body">
                                <div class="control">
                                    <input class="input" type="text" placeholder="MyProject" v-model="projectForm.projectName">
                                </div>
                            </div>
                        </div>
                        <div class="field is-horizontal">
                            <label class="field-label is-normal">Location</label>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <input class="input" type="text" placeholder="c:/some/directory" v-model="projectForm.directory">
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="control">
                                        <button class="button is-light" @click="selectDirectory()">Browse</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="is-danger box" v-if="validationGroup != null && !isValid" v-validation-summary="validationGroup"></div>
                        <button class="button is-primary" @click="createNewProject()">Create</button>
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
import { IProjectDescriptor, ProjectEntry, projectRegistry } from "@alchemist/core";
import { createRulesetFor, required, withDisplayName, regex } from "@treacherous/decorators";
import { createRuleset, ValidateWith } from "@treacherous/vue";

const {dialog} = remote;

class ProjectForm
{
  @required()
  @withDisplayName("Project Type")
  public projectType = "";

  @required()
  @regex(/^[\w]*$/g, true, "Should contain only alphanumeric characters")
  @withDisplayName("Project Name")
  public projectName = "";

  @required()
  @withDisplayName("Project Directory")
  public directory = "";
}

const projectFormRuleset = createRulesetFor(ProjectForm);
const componentRuleset = createRuleset()
  .forProperty("projectForm")
  .addRuleset(projectFormRuleset)
  .build();

@Component({
    components: {  },
    mixins: [ValidateWith(componentRuleset, { withReactiveValidation: true, validateOnStart: true })]
})
export default class extends Vue {
    @Mutation("loadProject")
    public loadProject;

    public showProjectModal = false;
    public projectForm = new ProjectForm();

    public get projectTemplates(): Array<IProjectDescriptor>{
        return projectRegistry.getProjects().map(x => x.projectDescriptor);
    }

    public get projectTypeDescription(): string
    {
      const projectEntry = this.selectedProjectEntry;
      if(projectEntry == null) { return ""; }

      return projectEntry.projectDescriptor.description;
    }

    public get selectedProjectEntry(): ProjectEntry
    {
      if(this.projectForm.projectType == "") { return null; }
      return projectRegistry.getProject(this.projectForm.projectType);
    }

    public selectDirectory()
    {
      const dialogResult = dialog.showOpenDialog({properties: ['openDirectory']});

      if(dialogResult.length > 0)
      { this.projectForm.directory = dialogResult[0]; }
    }

    public async createNewProject() {
        const isValid = await (<any>this).validationGroup.validate();
        if(!isValid) { return; }

        const projectEntry = this.selectedProjectEntry;
        const projectFactory = projectEntry.projectFactory;
        const project = projectFactory.create(this.projectForm.projectType, this.projectForm.projectName, this.projectForm.directory);
        this.loadProject(project);

        console.log("loading project", project);
        router.push('editor');
    }

/*
    public createNewProject() {
        const directory = dialog.showOpenDialog({properties: ['openDirectory']})[0];
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
    }*/
}
</script>

<style lang="scss">
    @import "../styles/default/theme";

    #project-creator-modal
    {
        .modal-content
        {
            width: 75vw;
        }

        #project-container
        {
            min-height: 50vh;
        }
    }

</style>
