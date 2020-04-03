<template>
    <div class="header">
        <div></div>
        <div class="time">
            <a v-popover:tpll>当前在线人数： <i class="txt-futura-hd">{{(parseInt(onlineCount.APP)||0)+(parseInt(onlineCount.WEB)||0)}}</i></a>
            <span class="txt-futura-hd">{{date}}</span> {{week}}

            <el-popover ref="tpll" placement="bottom" width="128" trigger="hover" popper-class='tp-pop'>
                <ul>
                    <li><span>建设单位</span><span class="txt-futura-hd">46</span></li>
                    <li><span>建设单位</span><span class="txt-futura-hd">46</span></li>
                    <li><span>建设单位</span><span class="txt-futura-hd">46</span></li>
                    <li><span>建设单位</span><span class="txt-futura-hd">46</span></li>
                    <li><span>建设单位</span><span class="txt-futura-hd">46</span></li>
                    <li><span>建设单位</span><span>46</span></li>
                </ul>
            </el-popover>
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
                this.$api.get(`${this.$config.efoms_HOST}/userCheck/countOnlineUsers`, {}, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.onlineCount = res.resultList || {};
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });

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
            // this.getOnline();
            // setInterval(() => {
            //     i++;
            //     if (i % 60 == 0) this.getOnline();
            //     nowTime += 1000;
            //     this.date = Common.dateFormat('yyyy/MM/dd hh:mm:ss', new Date(nowTime));
            // }, 1000);
        }
    };
</script>
<style lang="less" scoped>
    .header {
        height: 60px;
        background: #08102B;
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
                color: rgba(22, 247, 251, 0.8);
                padding: 12px;
                margin-right: 18px;
                cursor: pointer;

                i {
                    color: #16F7FB;
                }
            }
        }
    }
</style>
<style lang="less">
    @font-face {
        font-family: 'Futura-Medium';
        src: url('../../assets/images/home_sb/Futura.ttf');
    }

    .txt-futura-hd {
        font-family: Futura-Medium;
    }

    .tp-pop {
        &.el-popover {
            min-width: 120px;
            background: #040B19;
            border: 1px solid #124D78;
            box-shadow: 0 2px 4px 0 rgba(19, 31, 61, 0.50);
            padding: 0 8px;
            box-sizing: border-box;
            margin-top: 0;

            .popper__arrow {
                display: none;
            }
        }

        ul {
            li {
                display: flex;
                justify-content: space-between;
                color: #D9E3FA;
                font-size: 12px;
                line-height: 20px;
                padding: 4px 0;

                &+li {
                    border-top: 1px solid #102144;
                }
            }
        }
    }
</style>