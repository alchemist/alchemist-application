<template>
    <article class="message is-info m-md codegen-section">
        <div class="message-header">
            <p>{{generatedCode.fileLocation}}</p>
        </div>
        <div class="message-body codegen-section p-none">
            <ace-editor class="m-none codegen-editor" @init="editorInit" v-model="generatedCode.code" lang="csharp" theme="monokai"></ace-editor>
        </div>
    </article>
</template>

<script lang="ts">
    import * as AceEditor from "vue2-ace-editor";
    import "brace/ext/language_tools";
    import "brace/mode/csharp";
    import "brace/theme/monokai";

    import {Prop, Component, Vue} from 'vue-property-decorator';
    import {IGeneratedCode} from "@alchemist/core";

    @Component({
        components: {
            AceEditor
        }
    })
    export default class extends Vue {
        @Prop()
        public generatedCode: IGeneratedCode;

        private editor: any;

        public editorInit(editor: any) {
            this.editor = editor;
            this.editor.setReadOnly(true);
            this.editor.resize();
        }
    }
</script>

<style lang="scss">
    .codegen-section
    {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
</style>