<template>
    <tree id="project-tree" :data="projectTreeData">
        <span class="tree-text" slot-scope="{ node }">
            <template v-if="!node.data.type">
                <i class="fa" :class="[node.expanded() ? 'fa-folder-open' : 'fa-folder']"></i>
                {{ node.text }}
            </template>
            <template v-if="node.data.type">
                <span class="tag is-black">C</span>{{node.text}}
            </template>
        </span>
    </tree>
</template>

<script lang="ts">

import {Prop, Component, Vue, Watch} from 'vue-property-decorator';
import {IProject, INodeGroup, INode} from "@alchemist-editor/core";
import {State} from "vuex-class";
import Tree from "liquor-tree";

@Component({
    components: {Tree}
})
export default class extends Vue {

    @State(state => state.project.activeProject)
    public project: IProject;

    @Watch("project")
    public get projectTreeData()
    {
        const rootNode = {
            text: this.project.projectName,
            children: []
        };

        for(const nodeGroup of this.project.nodeGroups)
        {
            const childNode = this.generateTreeDataForNodeGroup(nodeGroup);
            rootNode.children.push(childNode);
        }

        return rootNode;
    }

    private generateTreeDataForNodeGroup(nodeGroup: INodeGroup)
    {
        const treeNode: any = {
                text: nodeGroup.displayName,
                children: []
        };

        for(const node of nodeGroup.nodes)
        {
            const treeSubNode = { text: node.data.name, data: { type: node.type.id } };
            treeNode.children.push(treeSubNode);
        }

        return treeNode;
    }
}
</script>

<style lang="scss">
    #project-tree .tree-node.selected
    {
        background-color: rgba(0,0,0,0.5);
    }
</style>