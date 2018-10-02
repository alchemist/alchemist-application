<template>
    <nav id="main-menu" class="navbar" aria-label="dropdown navigation">
        <div class="navbar-item has-dropdown" @click.left="showHeaderMenu = true" @mouseleave="showHeaderMenu = false" :class="{ 'is-hoverable': showHeaderMenu}">
            <a class="navbar-link">
                File
            </a>

            <div class="navbar-dropdown">
                <a class="navbar-item">
                    Open
                </a>
                <a class="navbar-item">
                    Save
                </a>
                <hr class="navbar-divider">
                <div class="navbar-item">
                    Exit
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class extends Vue {
        public showHeaderMenu = false;
    }
</script>

<style scoped>

</style>