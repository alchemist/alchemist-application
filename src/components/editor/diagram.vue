<template>
    <div id="diagram-container" @click.left.stop="deselectNode($event)" @contextmenu.prevent="$refs.menu.open">
        <div id="workspace-info">
            <nav class="breadcrumb is-large tag is-light" aria-label="breadcrumbs">
                <ul>
                    <li><a href="#">{{project.projectName}}</a></li>
                    <li><a href="#" class="is-active" aria-current="page">{{selectedNodeGroup.displayName}}</a></li>
                </ul>
            </nav>
        </div>
        <virtual-workspace id="diagram-content" ref="diagramContent" :workspace-config="selectedNodeGroup.workspaceConfig">
            <template slot="content" v-for="node in selectedNodeGroup.nodes" >
                <component class="component-instance" v-bind:is="node.type.id" :node="node"></component>
            </template>
        </virtual-workspace>
        <vue-context ref="menu">
            <nav class="panel has-text-black">
                <template v-for="(nodes, category) in nodeCategories">
                    <p class="panel-heading">{{category || "Other"}}</p>
                    <template v-for="node in nodes">
                        <a class="panel-block" @click="addNode(node, $event)">
                            <span class="panel-icon">
                              <i class="fas fa-edit" aria-hidden="true"></i>
                            </span>
                            Add {{node.friendlyName || node.nodeTypeId}}
                        </a>
                    </template>
                </template>
            </nav>
        </vue-context>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from "vue-property-decorator";
    import {
        IProject,
        NodeEntry,
        nodeRegistry,
        Point,
        INodeGroup,
        projectRegistry, NodeGroupEntry, INode
    } from "@alchemist/core";
    import {Mutation, State} from "vuex-class";
    import { VueContext } from 'vue-context';
    import {default as VirtualWorkspace} from "./virtual-workspace.vue";
    import {EditorEvents} from "../../events/editor-events";
    import {eventBus} from "../../events/event-bus";

    @Component({
        components: {VueContext, VirtualWorkspace}
    })
    export default class extends Vue
    {
        @State(state => state.project.activeProject)
        public project: IProject;

        @State(state => state.editor.selectedGroupIndex)
        public selectedGroupIndex: number;

        @State(state => state.editor.headerHeight)
        public headerHeight: number;

        @Mutation('selectNode')
        public changeSelectedNode;

        public compatibleNodes: NodeEntry[] = [];

        public get selectedNodeGroup(): INodeGroup{
            if(this.project.nodeGroups.length <= this.selectedGroupIndex)
            { return null; }

            return this.project.nodeGroups[this.selectedGroupIndex];
        }

        public get nodeCategories() {

            const nodeCategories = {};
            this.compatibleNodes.forEach(node => {

                if(!nodeCategories.hasOwnProperty(node.category))
                { nodeCategories[node.category] = []; }

                nodeCategories[node.category].push(node);
            });

            return nodeCategories;
        }

        public getClickPosition(x: number, y: number): Point
        {
            const translation = this.selectedNodeGroup.workspaceConfig.translation;
            const scale = this.selectedNodeGroup.workspaceConfig.scale;
            const clickPosition = new Point(x / scale, (y-this.headerHeight) / scale);
            //console.log("raw, clicked", {x,y}, clickPosition);
            //console.log("translation", translation.x, translation.y);
            //console.log("scale", scale);
           //console.log("scaled translation mul", translation.x * scale);
           //console.log("scaled translation div", translation.x / scale);

            const scaledTranslation = new Point(translation.x/scale, translation.y/scale);
            const differenceTranslation = new Point((translation.x - scaledTranslation.x)/2, (translation.y - scaledTranslation.y)/2);

            return new Point(translation.x + clickPosition.x, translation.y + clickPosition.y);
        }

        public addNode(node: NodeEntry, evt: any) {

            const position = this.getClickPosition(evt.pageX, evt.pageY);
            console.log(`Creating Node [${node.nodeTypeId}] @ x: ${position.x}, y: ${position.y}`);
            const newNode = node.nodeFactory.create(node.nodeTypeId, position);
            this.project.nodeGroups[this.selectedGroupIndex].nodes.push(newNode);
            eventBus.publish(EditorEvents.NodeAddedEvent, newNode, this);
        }

        public createDotAtPoint(evt)
        {
            const position = this.getClickPosition(evt.pageX, evt.pageY);
            console.log(`Creating Point @ x: ${position.x}, y: ${position.y}`)

            const contents = <HTMLElement>this.$refs.diagramContent["$el"];
            const div = document.createElement("div");
            div.classList.add("test-pix");
            div.style.top = `${position.y}px`;
            div.style.left = `${position.x}px`;
            contents.appendChild(div);
        }

        public deselectNode(evt)
        {
            this.changeSelectedNode(null);
            //this.createDotAtPoint(evt);
        }

        private onNodeDeleted(node: INode)
        {
            const nodes = this.selectedNodeGroup;
        }

        public mounted()
        {
          const projectEntry = projectRegistry.getProject(this.project.projectType);
          const compatibleNodeTypes = projectEntry.projectDescriptor.compatibleNodeTypeIds;
          const availableNodes = nodeRegistry.getNodes();
          this.compatibleNodes = availableNodes.filter(x => compatibleNodeTypes.indexOf(x.nodeTypeId) >= 0);
          console.log("COMPATIBLE", this.compatibleNodes, availableNodes);

            eventBus.subscribe(EditorEvents.NodeRemovedEvent, this.onNodeDeleted);
        }

        public beforeDestroy()
        {
            eventBus.unsubscribe(EditorEvents.NodeRemovedEvent, this.onNodeDeleted);
        }

    }
</script>

<style lang="scss">
    @import "~bulma/bulma";

    .test-pix
    {
        position: absolute;
        display: block;
        width: 10px;
        height: 10px;
        border: 2px solid #FFF;
        background-color: #FF0000;
    }

    #workspace-info
    {
        position: absolute;
        display: block;
        z-index: 10000;
        padding: 2em;

        li
        {
            color: rgba(255,255,255,0.5);
            font-weight: bold;
        }
    }

    #diagram-container
    {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>