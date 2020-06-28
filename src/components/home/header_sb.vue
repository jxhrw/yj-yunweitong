<template>
    <div class="header">
        <div class="title">杭州交警智能设备运维态势</div>
        <div class="time">
            <a v-popover:tpll>当前在线人数： <i class="txt-futura-hd">{{onlineCount.onlineTotal||0}}</i></a>
            <span class="name" v-popover:out>{{userName}}</span>
            <span class="txt-futura-hd span">{{date}}</span> {{week}}

            <el-popover ref="tpll" placement="bottom" width="128" trigger="hover" popper-class='tp-pop'>
                <ul>
                    <li>
                        <span>交警</span>
                        <span class="txt-futura-hd">{{onlineCount.trafficPolice||0}}</span>
                    </li>
                    <li>
                        <span>辅警</span>
                        <span class="txt-futura-hd">{{onlineCount.auxiliaryPolice||0}}</span>
                    </li>
                    <li>
                        <span>监理</span>
                        <span class="txt-futura-hd">{{onlineCount.superPerson||0}}</span>
                    </li>
                    <li>
                        <span>维护人员</span>
                        <span class="txt-futura-hd">{{onlineCount.repairPerson||0}}</span>
                    </li>
                    <li>
                        <span>施工人员</span>
                        <span class="txt-futura-hd">{{onlineCount.constPerson||0}}</span>
                    </li>
                    <li>
                        <span>外建业主</span>
                        <span class="txt-futura-hd">{{onlineCount.buildPerson||0}}</span>
                    </li>
                </ul>
            </el-popover>
            <el-popover ref="out" placement="bottom" width="60" trigger="hover" popper-class="tp-pop">
                <ul class="log">
                    <li @click="logOutFuc"><i class="el-icon-switch-button"></i><a>退出</a></li>
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
                userName: '',
                onlineCount: {},
            };
        },
        methods: {
            getOnline() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/selectOnlineUserCollect`, {}, { token: this.token })
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
            },
            getUserInfo() {
                let host = this.$config.efoms_HOST;
                let method = '/userCheck/selectUser';
                let token = Common.getQueryString("token");
                this.$api.getMethod(host, method, { token: token, systemKey: this.$config.systemKeyDev }, token).then(res => {
                    if (res.appCode == 0) {
                        let obj = res.resultList || {};
                        this.userName = obj.personName || '';
                    }
                }).catch(err => {
                    Common.printErrorLog(err);
                });
            },
            logOutFuc() {
                let host = this.$config.efoms_HOST;
                let method = '/system/logout';
                let token = Common.getQueryString("token");
                this.$api.getMethod(host, method, {}, token).then(res => {
                        try {
                            top.location.reload();
                        } catch (aa) {
                            top.location.href = document.referrer;
                        }
                    })
                    .catch(err => {
                        if (err.response.status == 403) {
                            try {
                                top.location.reload();
                            } catch (aa) {
                                top.location.href = document.referrer;
                            }
                        } else {
                            Common.printErrorLog(err);
                        }
                    });
            },
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.week = Common.showWeek();
            let nowTime = Date.parse(new Date());
            this.date = Common.dateFormat('yyyy/MM/dd hh:mm:ss', new Date(nowTime));
            this.getUserInfo();
            let i = 1;
            this.getOnline();
            setInterval(() => {
                i++;
                if (i % 60 == 0) {
                    this.week = Common.showWeek();
                    this.getOnline();
                }
                nowTime += 1000;
                this.date = Common.dateFormat('yyyy/MM/dd hh:mm:ss', new Date(nowTime));
            }, 1000);
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

        .title {
            padding-left: 60px;
            line-height: 50px;
            background: url('../../assets/images/favicon.png') no-repeat left 10px center/40px;
            font-size: 20px;
            font-weight: bold;
            margin-left: 10px;
        }

        .time {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #FFFFFF;
            margin-right: 25px;

            a {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: rgba(22, 247, 251, 0.8);
                padding: 12px 0;
                margin-right: 18px;
                cursor: pointer;

                i {
                    color: #16F7FB;
                }
            }

            .span {
                display: inline-block;
                width: 150px;
            }

            .name {
                font-size: 14px;
                color: #69D4FF;
                margin-right: 15px;
                cursor: pointer;
                padding: 12px 0;
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
            min-width: 60px;
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

            &.log {
                li {
                    align-items: center;
                    cursor: pointer;
                    // padding-left: 6px;
                    // padding-right: 6px;
                }
            }
        }
    }
</style>