<template>
    <div class="header">
        <div></div>
        <div class="time">
            <a>当前在线人数： <i>{{(parseInt(onlineCount.APP)||0)+(parseInt(onlineCount.WEB)||0)}}</i> <span>|</span> 今日上线人数：<i>{{(parseInt(onlineCount.APP_TOTAL)||0)+(parseInt(onlineCount.WEB_TOTAL)||0)}}</i> <span>|</span> 注册人数：<i>{{userNum}}</i></a>
            {{date}} {{week}}
        </div>
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
                week: '',
                onlineCount: {},
                userNum: 0,
            };
        },
        methods: {
            getOnline() {
                // this.$api.get(`${this.$config.efoms_HOST}/userCheck/countOnlineUsers`, {}, { token: this.token })
                //     .then(res => {
                //         if (res.appCode == 0) {
                //             this.onlineCount = res.resultList || {};
                //         } else {
                //             Common.printErrorLog(res);
                //         }
                //     })
                //     .catch(err => {
                //         Common.printErrorLog(err);
                //     });

                this.$api.get(`${this.$config.efoms_HOST}/uums/countUserBySystem`, {}, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.userNum = res.resultList || 0;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.week = Common.showWeek();
            let nowTime = Date.parse(new Date());
            this.date = Common.dateFormat('yyyy/MM/dd hh:mm:ss', new Date(nowTime));
            let i = 1;
            this.getOnline();
            setInterval(() => {
                i++;
                if (i % 60 == 0) this.getOnline();
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

            a {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #C0DAFF;
                padding: 12px;
                margin-right: 18px;

                span {
                    color: #498BF2;
                    margin: 0 12px;
                }

                i {
                    color: #fff;
                }
            }
        }
    }
</style>