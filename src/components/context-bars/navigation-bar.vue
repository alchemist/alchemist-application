<template>
    <div>
        <p class="notification is-info">Project Structure</p>

        <section class="p-sm">
            <tree id="project-tree" ref="tree" :data="projectTreeData">
                <span class="tree-text" slot-scope="{ node }">
                    <template v-if="node.data.isRoot === true">
                        <i class="fa fa-project-diagram has-text-primary"></i>
                        <span class="has-text-primary">{{ node.text }}</span>
                    </template>
                    <template v-else-if="!node.data.type">
                        <i class="fa" :class="[node.expanded() ? 'fa-folder-open' : 'fa-folder']"></i>
                        <span>{{ node.text }}</span>
                    </template>
                    <template v-if="node.data.type">
                        <div class="tree-node-content" :class="{ 'is-selected-node': node == selectedNode, 'has-error': hasNodeErrors(node.data.id) }">
                            <span :node-type="node.data.type.id" class="tag tree-node-element"></span>
                            <span>{{ node.text }}</span>
                        </div>
                    </template>
                </span>
            </tree>
        </section>
    </div>

</template>

<script lang="ts">

import {Prop, Component, Vue, Watch} from 'vue-property-decorator';
import {IProject, INodeGroup, INode} from "@alchemist/core";
import { Mutation, State, Getter } from "vuex-class";
import Tree from "liquor-tree";

@Component({
    components: {Tree}
})
export default class extends Vue {

    @State(state => state.project.activeProject)
    public project: IProject;

    @Mutation('selectNode')
    public changeSelectedNode;

    @State(state => state.editor.selectedNode)
    public selectedNode;

    @Getter("hasNodeErrors")
    public hasNodeErrors;

    @Mutation('selectGroup')
    public selectGroup;

    @State(state => state.editor.selectedGroupIndex)
    public selectedGroupIndex: number;

    @Watch("selectedNode")
    public updateSelection(newNode: INode)
    {
      const tree = (<any>this.$refs.tree);
      tree.selected().unselect();

      if(newNode == null) { return; }

      const selection = tree.find(node => {
        return node.data.id == newNode.id;
      });

      selection.select(true);
    }

    @Watch("project")
    public get projectTreeData()
    {
        const rootNode = {
            text: "Project",
            data: { isRoot: true },
            children: []
        };

        for(let i=0;i<this.project.nodeGroups.length;i++)
        {
            const nodeGroup = this.project.nodeGroups[i];
            const childNode = this.generateTreeDataForNodeGroup(nodeGroup, i);
            rootNode.children.push(childNode);
        }

        return rootNode;
    }

    public get selectedNodeGroup(): INodeGroup{
        if(this.project.nodeGroups.length <= this.selectedGroupIndex)
        { return null; }

        return this.project.nodeGroups[this.selectedGroupIndex];
    }

    private generateTreeDataForNodeGroup(nodeGroup: INodeGroup, nodeGroupIndex: number)
    {
        const treeNode: any = {
                text: nodeGroup.displayName,
                data: { groupIndex: nodeGroupIndex },
                children: []
        };

        for(const node of nodeGroup.nodes)
        {
            const treeSubNode = { text: node.data.name, data: node };
            treeNode.children.push(treeSubNode);
        }

        return treeNode;
    }

    private onNodeDoubleClicked = (node) => {
        if(node.data.groupIndex >= 0) {
            this.selectGroup(node.data.groupIndex);
            this.changeSelectedNode(null);
        }
    }

    private onNodeSelected = (node) => {
        if(!node.data.id) { return; }

        const parentGroupIndex = node.parent.data.groupIndex;
        if(parentGroupIndex >= 0) {
            if(parentGroupIndex != this.selectedGroupIndex)
            { this.selectGroup(parentGroupIndex); }
        }

        this.changeSelectedNode(node.data);
    }

    public mounted()
    {
        const tree = (<any>this.$refs.tree);
        tree.$on("node:selected", this.onNodeSelected);
        tree.$on("node:dblclick", this.onNodeDoubleClicked);
    }
}
</script>

<style lang="scss">
    .project-structure-section
    {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    #project-tree
    {
        width: 100%;

        .tree-anchor { color: wheat; }

        .tree-node-content
        {
            color: white;

            &.is-selected-node
            {
                background-color: rgba(0,0,0,0.5);
            }
        }

        .has-error
        {
            .tree-node-element { border: 1px solid red; }
            color: red;
        }
    }

    #project-tree .tree-node
    {
        &.selected .tree-content
        {
            background-color: rgba(0,0,0,0.5);
        }

        .tree-content:hover
        {
            background-color: rgba(0,0,0,0.2);
        }
    }
</style>