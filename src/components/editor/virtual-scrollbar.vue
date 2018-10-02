<template>
    <input class="virtual-scrollbar" @input="onChange" :step="step" :min="min" :max="max" :value.number="value" type="range" />
</template>

<script lang="ts">
    import {Prop, Vue, Component} from "vue-property-decorator";

    @Component
    export default class extends Vue
    {
        @Prop({ default: () => { return 0; }})
        public min: number;

        @Prop({ default: () => { return 100; }})
        public max: number;

        @Prop({ default: () => { return 1; }})
        public step: number;

        @Prop()
        public value: number;

        public onChange(evt: Event) {
            const slider = <HTMLInputElement>evt.target;
            const newValue = parseFloat(slider.value);
            this.$emit("update:value", newValue);
            this.$emit("change", newValue)
        }
    }
</script>

<style lang="scss" scoped>
    input[type=range] {
        -webkit-appearance: none;
        background: transparent;

        &::-webkit-slider-thumb { -webkit-appearance: none; }
        &:focus { outline: none; }
    }

    input[type=range]
    {
        margin: 1em;
        width: calc(100% - 2em);

        &::-webkit-slider-thumb
        {
            width: 4em;
            height: 0.8em;
        }

        &::-webkit-slider-runnable-track {
            height: 1em;
        }

        &::-webkit-slider-thumb {
            margin-top: 0.1em;
            margin-bottom: 0.1em;
            background: rgba(255,255,255,0.5);
            border-radius: 0.25em;
        }

        &::-webkit-slider-runnable-track {
            background: rgba(0,0,0,0.5);
            border-radius: 0.25em;
        }

        &:focus {
            &::-webkit-slider-runnable-track {
                background: rgba(0,0,0,1);
            }

            &::-webkit-slider-thumb {
                background: rgba(255,255,255,0.8);
            }
        }
    }
</style>