<template>
    <div id="node-bar-container">
        <p class="notification is-info">Node Details</p>

        <section class="m-md">
            <div class="field">
                <label class="label">Node Type</label>
                <div class="control">
                    <input class="input" type="text" placeholder="Node Type" :value="selectedNode.type.name" disabled="disabled">
                </div>
            </div>
        </section>
        <template v-if="hasErrors">
            <article class="message is-danger m-md codegen-section">
                <div class="message-header">
                    <p>Errors on Node</p>
                </div>
                <div class="message-body">
                    <ul v-for="(error, key) in nodeErrors">
                        <li>{{key}} | {{error}}</li>
                    </ul>
                </div>
            </article>
        </template>
        <template v-if="!hasErrors && generatedCodeList.length == 0">
            <article class="message is-info m-md codegen-section">
                <div class="message-header">
                    <p>No Generated Code For This Node</p>
                </div>
            </article>
        </template>
        <template v-else v-for="codePreview in generatedCodeList">
            <codegen-preview :generatedCode="codePreview"></codegen-preview>
        </template>
    </div>
</template>

<script lang="ts">
import {Prop, Component, Vue, Watch} from 'vue-property-decorator';
import {Getter, State} from "vuex-class";
import {debounce} from "lodash-es";
import {nodeGeneratorRegistry, INodeGroup, INode, IGeneratedCode, IProject} from "@alchemist/core";

import CodegenPreview from "./codegen-preview.vue";
import {generationManager} from "../../helpers/generation-helper";

@Component({
    components: {
        CodegenPreview
    }
})
export default class extends Vue {

    @State(state => state.editor.selectedNode)
    public selectedNode: INode;

    @Getter("getNodeErrors")
    public getNodeErrors;

    @Getter("selectedGroup")
    public selectedGroup: INodeGroup;

    @State(state => state.project.activeProject)
    public project: IProject;

    public generatedCodeList: Array<IGeneratedCode> = [];
    public nodeErrors: any = {};

    public get hasErrors(){
        return Object.keys(this.nodeErrors).length > 0;
    }

    private async updateCode() {
        this.generatedCodeList.length = 0;
        const generatedNodeCode = await generationManager.generateForNode(this.selectedNode, this.selectedGroup, this.project);
        this.generatedCodeList.push(...generatedNodeCode);
    }

    private updateCodeWrapper = debounce(this.updateCode, 500, { leading: true });

    @Watch("selectedNode", { deep: true })
    public selectedNodeChanged() {
        this.nodeErrors = this.getNodeErrors(this.selectedNode.id);
        if(this.hasErrors) { return; }

        this.updateCodeWrapper();
    }

    public mounted(){
        this.selectedNodeChanged();
    }
}
</script>

<style lang="scss">
    #node-bar-container
    {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>