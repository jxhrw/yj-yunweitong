<template>
    <div class="ej-mian">
        <div class="ej-main" id="mainBox">
            <!-- <router-view class="page-iframe"></router-view> -->
            <Introduce></Introduce>
        </div>
    </div>
</template>
<script>
    import Introduce from "components/other/introduce";
    export default {
        components: {
            Introduce
        }
    }
</script>
<style scoped>
    .ej-mian {
        display: flex;
        height: 100%;
        flex-flow: column;
        overflow: hidden;
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