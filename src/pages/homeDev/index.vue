<template>
    <div class="ej-mian">
        <div class="ej-main" id="mainBox">
            <router-view class="page-iframe"></router-view>
        </div>
    </div>
</template>
<script>
    export default {
        mounted() {

        },
        methods: {

        }
    };
</script>
<style scoped>
    .ej-mian {
        display: flex;
        height: 100%;
        flex-flow: column;
        overflow: hidden;
        min-width: 1000px;
    }

    .ej-main {
        display: flex;
        flex: 1;
        overflow: hidden;
        background-color: #f9fafc;
    }

    .page-iframe {
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        /*position: absolute;*/
    }
</style>
<style>
    @import "../../assets/css/clean.css";
    @import "../../assets/css/blue.css";
</style>