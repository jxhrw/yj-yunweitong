<template>
    <div class="header">
        <div></div>
        <div class="time">{{date}} {{week}}</div>
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
        mounted() {
            this.token = Common.getQueryString("token");
            this.week = Common.showWeek();
            let nowTime = Date.parse(new Date());
            this.date = Common.dateFormat('yyyy/MM/dd hh:mm:ss', new Date(nowTime));
            setInterval(() => {
                nowTime += 1000;
                this.date = Common.dateFormat('yyyy/MM/dd hh:mm:ss', new Date(nowTime));
            }, 1000);
        }
    };
</script>
<style lang="less" scoped>
    .header {
        height: 60px;
        background: #002969;
        display: flex;
        color: #fff;
        justify-content: space-between;
        align-items: center;

        .time {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #FFFFFF;
            margin-right: 25px;
        }
    }
</style>