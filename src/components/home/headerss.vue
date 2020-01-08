<template>
    <div class="header">
        <div class="left"></div>
        <div class="title">智能交通可视化应用平台</div>
        <div class="right"></div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Header from "./header.vue";
    export default {
        comments: {
            Header
        },
        data() {
            return {
                title: '',
                token: "",
                date: '',
                week: ''
            };
        },
        methods: {},
        mounted() {}
    };
</script>
<style lang="less" scoped>
    .header {
        height: 60px;
        display: flex;
        color: #fff;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 3;

        .title {
            height: 100%;
            width: 44.89%;
            background: url('../../assets/images/home/bg-title-center.png') no-repeat center top/100% 100%;
            text-align: center;
            line-height: 48px;
            font-size: 26px;
            color: #FFFFFF;
            letter-spacing: 1px;
            text-align: center;
            text-shadow: 0 6px 8px rgba(48, 25, 78, 0.84);
        }

        .left,
        .right {
            height: 100%;
            flex: 1;
            overflow: hidden;
            background: url('../../assets/images/home/bg-title-left.png') no-repeat center/110% 17%;
            background-position-x: 10%;
            background-position-y: 30%;
        }

        // .right {
        //     background-image: url('../../assets/images/home/bg-title-right.png');
        //     background-position-x: 10%;
        // }
    }



    @media screen and (max-width: 1440px) {
        .header .title {
            font-size: 22px;
        }
    }
</style>