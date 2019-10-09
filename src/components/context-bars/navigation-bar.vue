<template>
    <div>
        <p class="notification is-info">Project Structure</p>

        <section class="p-sm">
            <a class="button is-primary" @click="showNodeGroupModal = true">Add New Group</a>
            <tree id="project-tree" ref="tree" :data="projectTreeData" :options="{ deletion: onNodeDeleted }">
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
        <node-group-modal :is-active="showNodeGroupModal" :project="project" @node-group-created="onNodeGroupCreated"></node-group-modal>
    </div>
</template>

<script lang="ts">

import {Prop, Component, Vue, Watch} from 'vue-property-decorator';
import {
    IProject,
    INodeGroup,
    INode,
    NodeEntry,
    projectRegistry,
    nodeRegistry,
} from "@alchemist/core";
import { Mutation, State, Getter } from "vuex-class";
import Tree from "liquor-tree";

import {EditorEvents} from "../../events/editor-events";
import {eventBus} from "../../events/event-bus";

import {default as NodeGroupModal} from "../modals/node-group-creator-modal.vue";

@Component({
    components: {Tree, NodeGroupModal}
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

    public showNodeGroupModal = false;

    public compatibleNodes: NodeEntry[] = [];

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

    public projectTreeData =  {
        text: "Project",
        data: { isRoot: true },
        children: []
    };

    public refreshProjectTree()
    {
        this.projectTreeData.children.length = 0;
        for(let i=0;i<this.project.nodeGroups.length;i++)
        {
            const nodeGroup = this.project.nodeGroups[i];
            const childNode = this.generateTreeDataForNodeGroup(nodeGroup, i);
            this.projectTreeData.children.push(childNode);
        }

        (<any>this.$refs.tree).setModel(this.projectTreeData);
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

    private onNodeDeleted = (node) => {
        if(!node.data.id) { return; }

        const nodeData : INode = node.data;
        if(confirm(`Are you sure you want to delete "${nodeData.data.name}"?`))
        {
            this.deleteNode(node.data);
            return true;
        }

        return false;
    }

    private deleteNode(node: INode)
    {
        const containingNodeGroup = this.project.nodeGroups.find(x => x.nodes.some(y => y.id == node.id));
        const indexOfNode = containingNodeGroup.nodes.findIndex(x => x.id == node.id);
        containingNodeGroup.nodes.splice(indexOfNode, 1);

        this.changeSelectedNode(null);
        eventBus.publish(EditorEvents.NodeRemovedEvent, node, this);
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

    public onNodeGroupCreated(nodeGroup: INodeGroup)
    {
        console.log(`CREATING NEW GROUP ${nodeGroup.displayName}`);
        this.project.nodeGroups.push(nodeGroup);
        eventBus.publish(EditorEvents.GroupAddedEvent, nodeGroup, this);
        this.showNodeGroupModal = false;
    }

    public mounted()
    {
        const tree = (<any>this.$refs.tree);
        tree.$on("node:selected", this.onNodeSelected);
        tree.$on("node:dblclick", this.onNodeDoubleClicked);

        const projectEntry = projectRegistry.getProject(this.project.projectType);
        const compatibleNodeTypes = projectEntry.projectDescriptor.compatibleNodeTypeIds;
        const availableNodes = nodeRegistry.getNodes();
        this.compatibleNodes = availableNodes.filter(x => compatibleNodeTypes.indexOf(x.nodeTypeId) >= 0);

        this.refreshProjectTree();

        eventBus.subscribe(EditorEvents.NodeAddedEvent, this.refreshProjectTree);
        eventBus.subscribe(EditorEvents.GroupAddedEvent, this.refreshProjectTree);
    }

    public beforeDestroy()
    {
        eventBus.unsubscribe(EditorEvents.NodeAddedEvent, this.refreshProjectTree);
        eventBus.unsubscribe(EditorEvents.GroupAddedEvent, this.refreshProjectTree);
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