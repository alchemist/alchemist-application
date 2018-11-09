<template>
    <div class="virtual-workspace" ref="container">

        <virtual-scrollbar class="x-scroller" :max="maxTranslateX" :value.sync="workspaceConfig.translation.x" @change="refreshWorkspace()"></virtual-scrollbar>
        <virtual-scrollbar class="y-scroller" :max="maxTranslateY" :value.sync="workspaceConfig.translation.y" @change="refreshWorkspace()"></virtual-scrollbar>
        <!--<virtual-scrollbar class="scale-scroller" :min="minScale" :max="maxScale" :step="scaleSpeed" :value.sync="workspaceConfig.scale" @change="refreshWorkspace()"></virtual-scrollbar>-->

        <div class="workspace-content" ref="workspace" @mousedown.self.left="startDrag($event)" @mousemove="mouseMoveEvent($event)" @mouseup="stopDrag($event)">
            <slot name="content">
            </slot>
        </div>
    </div>
</template>

<script lang="ts">
    import {Prop, Vue, Component} from "vue-property-decorator";
    import {Point, IWorkspaceConfig} from "@alchemist/core";
    import {default as VirtualScrollbar} from "./virtual-scrollbar.vue";

    @Component({
        components: {VirtualScrollbar}
    })
    export default class extends Vue
    {
        @Prop({ default: () => { return 1.2; }})
        public maxScale: number;

        @Prop({ default: () => { return 0.5; }})
        public minScale: number;

        @Prop({ default: () => { return 0.1; }})
        public scaleSpeed: number;

        @Prop({ default: () => { return 1; }})
        public panningSpeed: number;

        public maxTranslateX = 0;
        public minTranslateX = 0;
        public maxTranslateY = 0;
        public minTranslateY = 0;

        public refreshMaxTranslate(){
            if(!this.$refs.workspace){ return 0; }
            const workspace = <HTMLElement>this.$refs.container;
            const scaledSize = this.workspaceConfig.size*this.workspaceConfig.scale;
            const difference = this.workspaceConfig.size - scaledSize;
            this.maxTranslateX = (this.workspaceConfig.size-workspace.clientWidth)*this.workspaceConfig.scale;
            //this.minTranslateX = (-difference)-workspace.clientWidth;
            this.maxTranslateY = (this.workspaceConfig.size-workspace.clientHeight)*this.workspaceConfig.scale;
            //this.minTranslateY = (-difference)-workspace.clientHeight;
            //console.log("b", scaledSize, difference, workspace.clientWidth/this.workspaceConfig.scale, this.maxTranslateX);
        }

        @Prop()
        public workspaceConfig: IWorkspaceConfig;

        private previousPosition = new Point();
        private isDragging = false;

        private mouseWheelEvent(e: MouseWheelEvent) {
            let newScale = this.workspaceConfig.scale;
            if (e.deltaY < 0) { newScale += this.scaleSpeed; }
            if (e.deltaY > 0) { newScale -= this.scaleSpeed; }

            if(newScale > this.maxScale) { newScale = this.maxScale; }
            else if(newScale < this.minScale) { newScale = this.minScale; }

            const workspace = <HTMLElement>this.$refs.workspace;
            workspace.style.transform = `scale(${newScale}, ${newScale})`;
            this.workspaceConfig.scale = newScale;
            this.refreshWorkspace();
        };

        private stopDrag() {
            this.setDragging(false);
            this.previousPosition.x = 0;
            this.previousPosition.y = 0;
        };

        private startDrag(evt: MouseEvent)
        {
            this.setDragging(true);
            this.previousPosition.x = evt.pageX;
            this.previousPosition.y = evt.pageY;
        };

        private mouseMoveEvent(evt: MouseEvent) {
            if(!this.isDragging) { return; }
            const changedX = (this.previousPosition.x  - evt.pageX) * this.panningSpeed;
            const changedY = (this.previousPosition.y  - evt.pageY) * this.panningSpeed;

            const newTranslation = new Point(this.workspaceConfig.translation.x, this.workspaceConfig.translation.y);
            newTranslation.x += changedX;
            newTranslation.y += changedY;

            this.previousPosition.x = evt.pageX;
            this.previousPosition.y = evt.pageY;
            this.workspaceConfig.translation.x = newTranslation.x;
            this.workspaceConfig.translation.y = newTranslation.y;
            this.refreshWorkspace();
        };

        public refreshWorkspace()
        {
            this.refreshMaxTranslate();

            const workspace = <HTMLElement>this.$refs.workspace;
            workspace.style.width = `${this.workspaceConfig.size}px`;
            workspace.style.height = `${this.workspaceConfig.size}px`;
            workspace.style.left = `${-this.workspaceConfig.translation.x}px`;
            workspace.style.top = `${-this.workspaceConfig.translation.y}px`;
        }

        public setDragging(isDragging: boolean)
        {
            this.isDragging = isDragging;
            const workspace = <HTMLElement>this.$refs.workspace;

            if(isDragging)
            { workspace.classList.add("is-dragging"); }
            else
            { workspace.classList.remove("is-dragging"); }
        }

        public mounted()
        {
            const workspace = <HTMLElement>this.$refs.workspace;

            //workspace.addEventListener('wheel', this.mouseWheelEvent);

            this.refreshWorkspace();
        }

        public beforeDestroy()
        {
            const workspace = <HTMLElement>this.$refs.workspace;

            //workspace.removeEventListener('wheel', this.mouseWheelEvent);
        }
    }
</script>

<style lang="scss" scoped>
    @import "~bulma/bulma";

    @mixin grid-background($dot-size: 2px, $dot-space: 32px, $bgColor: $grey-darker) {
        $gridLines: rgba(#fff, 0.1);

        background-color: $bgColor;
        background-image: linear-gradient($gridLines .1em, transparent .1em), linear-gradient(90deg, $gridLines .1em, transparent .1em);
        background-size: 16px 16px;
    }

    .workspace-content
    {
        @include grid-background();
        position: absolute;
        display: block;
    }

    .virtual-workspace
    {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .x-scroller
    {
        width: 80% !important;
        position: absolute;
        bottom: 0;
        z-index: 1;
    }

    .y-scroller
    {
        position: absolute;
        transform: rotate(90deg);
        width: calc(100vh - 4em);
        top: 48%;
        left: 48%;
        z-index: 1;
    }

    .is-dragging
    {
        cursor: all-scroll;
    }
</style>