<template>
    <div>
        <p class="notification is-info">Project Structure</p>

        <section class="p-sm">
            <a class="button is-primary" @click="showNodeGroupModal = true">Add New Group</a>
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
        <div id="node-group-creator-modal" class="modal" :class="{ 'is-active': showNodeGroupModal }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <article class="message is-dark">
                    <div class="message-header">
                        <p>Create Node Group</p>
                    </div>
                    <div class="message-body">
                        <div class="field">
                            <label class="label">Group Name</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="Group name" v-model="nodeGroupForm.groupName" />
                            </div>
                        </div>
                        <button class="button is-primary" :disabled="!isValid" @click="createNewNodeGroup()">Create</button>
                        <button class="button" @click="showNodeGroupModal = false">Cancel</button>
                    </div>
                </article>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

import {Prop, Component, Vue, Watch} from 'vue-property-decorator';
import {
    IProject,
    INodeGroup,
    INode,
    NodeEntry,
    NodeGroupEntry,
    projectRegistry,
    nodeRegistry,
    nodeGroupRegistry
} from "@alchemist/core";
import { Mutation, State, Getter } from "vuex-class";
import Tree from "liquor-tree";
import {createRulesetFor, required, withDisplayName} from "@treacherous/decorators";
import {createRuleset} from "@treacherous/core";
import {ValidateWith} from "@treacherous/vue";
import {EditorEvents} from "../../events/editor-events";
import {eventBus} from "../../events/event-bus";

class NodeGroupForm
{
    @required()
    @withDisplayName("Group Name")
    public groupName = "";
}

const nodeGroupRuleset = createRulesetFor(NodeGroupForm);
const componentRuleset = createRuleset()
    .forProperty("nodeGroupForm")
    .addRuleset(nodeGroupRuleset)
    .build();

@Component({
    components: {Tree},
    mixins: [ValidateWith(componentRuleset, { withReactiveValidation: true, validateOnStart: true })]
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
    public nodeGroupForm = new NodeGroupForm();

    public compatibleNodes: NodeEntry[] = [];
    public compatibleNodeGroups: NodeGroupEntry[] = [];

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

        const projectEntry = projectRegistry.getProject(this.project.projectType);
        const compatibleNodeTypes = projectEntry.projectDescriptor.compatibleNodeTypeIds;
        const availableNodes = nodeRegistry.getNodes();
        this.compatibleNodes = availableNodes.filter(x => compatibleNodeTypes.indexOf(x.nodeTypeId) >= 0);

        const compatibleNodeGroupTypes = projectEntry.projectDescriptor.compatibleNodeGroupTypeIds;
        const availableNodeGroups = nodeGroupRegistry.getNodeGroups();
        this.compatibleNodeGroups = availableNodeGroups.filter(x => compatibleNodeGroupTypes.indexOf(x.nodeGroupTypeId) >= 0);

        this.refreshProjectTree();

        eventBus.subscribe(EditorEvents.NodeAddedEvent, this.refreshProjectTree);
        eventBus.subscribe(EditorEvents.GroupAddedEvent, this.refreshProjectTree);
    }

    public beforeDestroy()
    {
        eventBus.unsubscribe(EditorEvents.NodeAddedEvent, this.refreshProjectTree);
        eventBus.unsubscribe(EditorEvents.GroupAddedEvent, this.refreshProjectTree);
    }

    public async createNewNodeGroup() {
        const isValid = await (<any>this).getValidationGroup().validate();
        if(!isValid) { return; }

        const nodeGroupType = this.compatibleNodeGroups[0];
        const newNodeGroup = nodeGroupType.nodeGroupFactory.create(nodeGroupType.nodeGroupTypeId, this.nodeGroupForm.groupName);
        console.log(`CREATING NEW GROUP ${this.nodeGroupForm.groupName}`);
        this.project.nodeGroups.push(newNodeGroup);
        eventBus.publish(EditorEvents.GroupAddedEvent, newNodeGroup, this);
        this.showNodeGroupModal = false;
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