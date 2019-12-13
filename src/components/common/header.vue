<template>
    <header class="ej-header">
        <div>
            <h1>{{title}}</h1>
        </div>
        <div style="display:flex;">
            <span class="ej-date" v-if="dateShow">{{date | dateSpecific}}</span>
            <div class="ej-user" v-popover:out style="height:24px;">
                <div class="user-img">
                    <img :src="userHearder || errorImg" @error="errorImgFuc" />
                </div>
                <div class="user-name">{{userName||'用户名'}} <i class="el-icon-arrow-down"></i></div>
                <el-popover ref="out" placement="bottom" :width="80" trigger="click" popper-class="logout">
                    <ul>
                        <li><a class="ej-out" @click="logOutFuc"><i class="el-icon-switch-button"></i>退出</a></li>
                        <li v-if="$config.systemUrl"><a class="ej-out" @click="logBackFuc"><i class="el-icon-house"></i>返回首页</a></li>
                    </ul>
                </el-popover>
            </div>
        </div>
    </header>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Request from "@/assets/js/request.js";
    import UserHearder from "@/assets/images/icon-user-header.png";
    export default {
        filters: {
            dateSpecific: function(value) {
                return Common.dateFormat('yyyy-MM-dd hh:mm:ss', new Date(parseInt(value)));
            }
        },
        props: ['userName'],
        data() {
            return {
                title: '杭州交警运维通',
                errorImg: require('../../assets/images/icon-user-header.png'),
                userHearder: '',
                // userName: '用户名',
                date: '',
                dateShow: true
            };
        },
        watch: {
            date(newVal, oldVal) {
                sessionStorage.setItem("serviceTime", newVal);
            }
        },
        mounted() {
            this.date = parseInt((new Date()).getTime()); // 默认本地时间
            // this.getUserInfo();
            this.getDateInfo();
            let timeCount = setInterval(() => {
                this.date += 1000;
            }, 1000);
        },
        methods: {
            errorImgFuc() {
                this.userHearder = this.errorImg;
            },
            // 查询服务器时间信息
            getDateInfo() {
                let host = this.$config.efoms_HOST;
                let method = '/date/getServiceTimeReal';
                let token = Common.getQueryString("token");
                this.$api.getMethod(host, method, {}, token).then(res => {
                    if (res.appCode == 0) {
                        this.date = (new Date(res.resultList.time)).getTime();
                    } else {
                        this.date = (new Date()).getTime();
                        this.dateShow = false;
                    }
                });
            },
            logOutFuc() {
                let host = this.$config.efoms_HOST;
                let method = '/system/logout';
                let token = Common.getQueryString("token");
                this.$api.getMethod(host, method, {}, token).then(res => {
                        // if (res) {
                        location.reload();
                        // }
                    })
                    .catch(err => {
                        if (err.response.status == 403) {
                            location.reload();
                        } else {
                            Common.printErrorLog(err);
                        }
                    });
            },
            logBackFuc() {
                let token = Common.getQueryString("token");
                top.location.href = `${this.$config.systemUrl}?token=${token}`;
            }
        }
    };
</script>
<style scoped>
    .ej-header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        background: #272C38;
        min-height: 58px;
        bottom: 0;
        left: 0;
        top: 0;
        right: 0;
    }

    .ej-header h1 {
        margin-top: 13px;
        margin-left: 15px;
        font-size: 20px;
        line-height: 30px;
        padding-left: 36px;
        color: #FFFFFF;
        display: inline-block;
        background: url('../../assets/images/icon-platform.png') no-repeat center left;
    }

    .ej-header .ej-date {
        font-size: 12px;
        line-height: 20px;
        margin-top: 19px;
        margin-right: 30px;
        color: #FFFFFF;
    }

    .ej-header .ej-user {
        display: flex;
        margin-top: 18px;
        margin-right: 20px;
        cursor: pointer;
    }

    .ej-header .ej-user::after {
        content: '';
        margin-left: 10px;
        margin-top: 11px;
        border-width: 4px 4px 0;
        border-style: solid;
        border-color: #BAF1FA transparent transparent;
        display: none;
    }

    .ej-header .ej-user .user-img {
        width: 22px;
        height: 22px;
    }

    .ej-header .ej-user .user-img img {
        width: 22px;
        height: 22px;
    }

    .ej-header .ej-user .user-name {
        color: #FFFFFF;
        margin-left: 10px;
    }

    .ej-header .span-txt {
        color: #FFFFFF;
        font-size: 14px;
        margin-left: 10px;
        position: relative;
        top: -1px;
    }
</style>
<style>
    .logout {
        min-width: 50px !important;
    }

    .logout li{
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .logout li i{
        color: #262626;
        /* font-weight: bold; */
        font-size: 14px;
        margin-right: 4px;
    }

    .logout li+li{
        margin-top: 10px;
    }

    .ej-out {
        border-radius: 20px;
        color: #262626;
        font-size: 12px;
        box-sizing: border-box;
    }
</style>