<template>
    <modal :is-active="isActive" title="Create Node Group">
        <template slot="content">
            <div class="field">
                <label class="label">Group Name</label>
                <div class="control">
                    <input class="input" type="text" placeholder="Group name" v-model="nodeGroupForm.groupName" v-show-error validate-property="nodeGroupForm.groupName" />
                </div>
            </div>
            <button class="button is-primary" :disabled="!isValid" @click="createNewNodeGroup()">Create</button>
            <button class="button" @click="isActive = false">Cancel</button>
        </template>
    </modal>
</template>

<script lang="ts">
    import {Prop, Component, Vue} from 'vue-property-decorator';
    import {default as Modal} from "./modal.vue";
    import {createRulesetFor, required, withDisplayName} from "@treacherous/decorators";
    import {createRuleset} from "@treacherous/core";
    import {ValidateWith} from "@treacherous/vue";

    import {
        IProject,
        NodeGroupEntry,
        projectRegistry,
        nodeGroupRegistry
    } from "@alchemist/core";

    class NodeGroupForm
    {
        @required()
        @withDisplayName("Group Name")
        public groupName = "";
    }

    const nodeGroupRuleset = createRulesetFor(NodeGroupForm);
    const modalRuleset = createRuleset()
        .forProperty("nodeGroupForm")
        .addRuleset(nodeGroupRuleset)
        .build();

    @Component({
        components: {Modal},
        mixins: [ValidateWith(modalRuleset, { withReactiveValidation: true, validateOnStart: true })]
    })
    export default class extends Vue {
        @Prop()
        public isActive: boolean = false;

        @Prop()
        public project: IProject;

        public compatibleNodeGroups: NodeGroupEntry[] = [];

        public nodeGroupForm = new NodeGroupForm();

        public async createNewNodeGroup() {
            const isValid = await (<any>this).getValidationGroup().validate();
            if(!isValid) { return; }

            const nodeGroupType = this.compatibleNodeGroups[0];
            const newNodeGroup = nodeGroupType.nodeGroupFactory.create(nodeGroupType.nodeGroupTypeId, this.nodeGroupForm.groupName);

            this.nodeGroupForm.groupName = "";
            this.$emit("node-group-created", newNodeGroup);
        }

        public mounted()
        {
            const projectEntry = projectRegistry.getProject(this.project.projectType);
            const compatibleNodeGroupTypes = projectEntry.projectDescriptor.compatibleNodeGroupTypeIds;
            const availableNodeGroups = nodeGroupRegistry.getNodeGroups();
            this.compatibleNodeGroups = availableNodeGroups.filter(x => compatibleNodeGroupTypes.indexOf(x.nodeGroupTypeId) >= 0);
        }
    }
</script>

<style scoped>

</style>