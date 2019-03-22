<template>
    <div>
        <p class="notification is-info">Project Structure</p>

        <section class="p-sm">
            <tree id="project-tree" ref="tree" :data="projectTreeData">
                <span class="tree-text" slot-scope="{ node }">
                    <template v-if="!node.data.type">
                        <i class="fa" :class="[node.expanded() ? 'fa-folder-open' : 'fa-folder']"></i>
                        {{ node.text }}
                    </template>
                    <template v-if="node.data.type">
                        <div class="tree-node-content" :class="{ 'is-selected-node': node == selectedNode }">
                            <span :node-type="node.data.type.id" class="tag tree-node-element"></span>{{node.text}}
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
import { Mutation, State } from "vuex-class";
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
            const treeSubNode = { text: node.data.name, data: node };
            treeNode.children.push(treeSubNode);
        }

        return treeNode;
    }

    public mounted()
    {
        const tree = (<any>this.$refs.tree);
        tree.$on("node:selected", (node) => {
            if(!node.data.id) { return; }
            this.changeSelectedNode(node.data);
        });
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

        .tree-anchor
        {
            color: wheat;
        }

        .tree-node-content
        {
            color: white;

            &.is-selected-node
            {
                background-color: rgba(0,0,0,0.5);
            }
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