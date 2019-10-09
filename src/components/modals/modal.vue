<template>
    <div class="modal" :class="{ 'is-active': isActive }">
        <div class="modal-background"></div>
        <div class="modal-content">
            <article class="message is-dark">
                <div class="message-header">
                    <p>{{title}}</p>
                </div>
                <div class="message-body">
                    <slot name="content">
                        Modal Content goes here
                    </slot>
                </div>
            </article>
        </div>
    </div>
</template>

<script lang="ts">
    import {Prop, Component, Vue} from 'vue-property-decorator';

    @Component
    export default class extends Vue {
        @Prop()
        public isActive: boolean = false;

        @Prop()
        public title: string;
    }
</script>

<style lang="scss">

</style>