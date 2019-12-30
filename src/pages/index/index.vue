<template>
    <div class="ej-mian">
        <EJ-Header v-if="isHeadMenuVisible" :userName="userInfo.personName"></EJ-Header>
        <div class="ej-main" id="mainBox">
            <EJ-Menu v-if="isHeadMenuVisible" :menusList="rightListsEx"></EJ-Menu>

            <keep-alive>
                <router-view class="page-iframe" v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view class="page-iframe" v-if="!$route.meta.keepAlive"></router-view>
            <!-- <iframe id="pageIframe" class="page-iframe"></iframe> -->
            <div style="width:0;overflow:hidden;">
                <audio id="audio" :src="audio" />
            </div>
        </div>
    </div>
</template>
<script>
    import Header from "components/common/header";
    import Menu from "components/common/menu";
    import Common from "@/assets/js/common.js";
    import Bus from "@/assets/js/bus.js";
    import Audio from "@/assets/audio/tips.mp3";
    export default {
        name: "Index",
        components: {
            "EJ-Header": Header,
            "EJ-Menu": Menu
        },
        data() {
            return {
                isHeadMenuVisible: true,
                userInfo: {},
                path: '',
                audio: Audio,
                rightListsEx: [],
                DOMS: {}, // 弹出的实例集合
                domIndex: 0, // 实例对象的key值
            }
        },
        created() {
            this.isHeadMenuVisible = Common.getQueryString("headMenu") != 'hide';
            this.$store.commit('changeVisible', Common.getQueryString("headMenu") != 'hide');
            console.log(this.$store.getters.getIsHeadMenuVisible)
            this.rightListsEx = [{
                children: [{
                    checked: true,
                    rightName: "申报管理",
                    rightElCss: "menu-repair",
                    rightUrl: "",
                    children: [{
                            checked: true,
                            rightName: "维修申报",
                            rightUrl: "sheet?type=0"
                        },
                        {
                            checked: true,
                            rightName: "优化申报",
                            rightUrl: "repair?type=2"
                        }
                    ]
                }, {
                    checked: true,
                    rightName: "工单管理",
                    rightUrl: "",
                    rightElCss: "menu-repair",
                    children: [{
                            checked: true,
                            rightName: "科室审核",
                            rightUrl: "sheet?type=1"
                        },
                        {
                            checked: true,
                            rightName: "处室审核",
                            rightUrl: "sheet?type=2",
                        },
                        {
                            checked: true,
                            rightName: "转单审核",
                            rightUrl: "sheet?type=3"
                        },
                        {
                            checked: true,
                            rightName: "延期审核",
                            rightUrl: "sheet?type=4",
                        },
                        {
                            checked: true,
                            rightName: "工单下发",
                            rightUrl: "sheet?type=5"
                        },
                        {
                            checked: true,
                            rightName: "工单指派",
                            rightUrl: "sheet?type=6"
                        },
                    ]
                }, {
                    checked: true,
                    rightName: "工单查询",
                    rightUrl: "",
                    rightElCss: "menu-repair",
                    children: [{
                            checked: true,
                            rightName: "工单查询",
                            rightUrl: "sheet?type=7"
                        },
                        {
                            checked: true,
                            rightName: "延期查询",
                            rightUrl: "sheet?type=8",
                        },
                        {
                            checked: true,
                            rightName: "转单查询",
                            rightUrl: "sheet?type=9"
                        },
                        {
                            checked: true,
                            rightName: "停用查询",
                            rightUrl: "sheet?type=10",
                        },
                    ]
                }, {
                    checked: true,
                    rightName: "维修处置",
                    rightUrl: "sheet?type=11",
                    rightElCss: "menu-repair",
                    children: []
                }, {
                    checked: true,
                    rightName: "工单确认",
                    rightUrl: "sheet?type=12",
                    rightElCss: "menu-repair",
                    children: []
                }, {
                    checked: true,
                    rightName: "工单评价",
                    rightUrl: "sheet?type=13",
                    rightElCss: "menu-repair",
                    children: []
                }, {
                    checked: true,
                    rightName: "监理点位校准",
                    rightUrl: "calibration",
                    rightElCss: "menu-repair",
                    children: []
                }, {
                    checked: true,
                    rightName: "材料审核",
                    rightUrl: "sheet?type=21",
                    rightElCss: "menu-repair",
                    children: []
                }, {
                    checked: true,
                    rightName: "查询统计",
                    rightUrl: "",
                    rightElCss: "menu-repair",
                    children: [{
                            checked: true,
                            rightName: "工单查询",
                            rightUrl: "data"
                        },
                        {
                            checked: true,
                            rightName: "工单统计",
                            rightUrl: "statistics",
                        },
                        {
                            checked: true,
                            rightName: "工作量查询",
                            rightUrl: "workload"
                        }
                    ]
                }]
            }];
            if (this.isHeadMenuVisible) {
                this.getUserInfo();
            }
        },
        mounted() {
            if (this.isHeadMenuVisible) {
                this.tipsPush('EFOMS_OPERATION');
                this.tipsPush('efoms_heartbeat');
            }
            window.myVue = this;
        },
        methods: {
            // 获取用户信息
            getUserInfo() {
                let host = this.$config.efoms_HOST;
                let method = '/userCheck/selectUser';
                let token = Common.getQueryString("token");
                this.$api.getMethod(host, method, { token: token }, token).then(res => {
                    if (res.appCode == 0) {
                        this.userInfo = res.resultList || {};
                        this.rightListsEx = this.userInfo.rightListsEx || [];
                        sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));
                        window.userInfo = this.userInfo;
                    }
                }).catch(err => {
                    Common.printErrorLog(err);
                });
            },
            tipsPush(code) {
                let _this = this;
                ServerPush.receive(code, 'message', (res) => {
                    console.log(res);
                    let arr = res.users || [];
                    let isPower = arr.some(item => { return item == this.userInfo.personId });
                    //NOTICETYPE01待办，NOTICETYPE02通知
                    res.type = res.type == 'NOTICETYPE01' ? '待办' : '通知';
                    if (isPower) {
                        this.domIndex += 1;
                        res.key = this.domIndex;
                        document.getElementById('audio').play();
                        this.DOMS[this.domIndex] = this.$notify({
                            title: `${res.type}消息`,
                            position: 'bottom-right',
                            dangerouslyUseHTMLString: true,
                            duration: 0,
                            message: `<a style="cursor: pointer;" onclick="myVue.onclickNotification('${encodeURIComponent(JSON.stringify(res))}')">${res.content}</a>`,
                            customClass: 'serverpushNotice'
                        });
                    }
                });
            },
            onclickNotification(res) {
                let obj = JSON.parse(decodeURIComponent(res));
                this.DOMS[obj.key].close();

                let entrance = this.getType(obj.class);
                if (entrance == '转单审核') {
                    this.$api.get(`${this.$config.efoms_HOST}/opr/search/page/transfer`, { pageSize: 10, currentPage: 1, type: 0, applyId: obj.wokrorderIds }, { token: Common.getQueryString("token") })
                        .then(res => {
                            if (res.appCode == 0) {
                                let tableData = res.resultList.result || [];
                                if (tableData.length > 0) {
                                    sessionStorage.setItem('transferInfo', JSON.stringify(tableData[0]));
                                    this.$router.push({
                                        path: '/detsheet',
                                        query: { pre: entrance, id: obj.wokrorderIds, isread: obj.type == '待办' ? 'edit' : undefined }
                                    });
                                }

                            }
                        });
                } else {
                    this.$router.push({
                        path: '/detsheet',
                        query: { pre: entrance, id: obj.wokrorderIds, isread: obj.type == '待办' ? 'edit' : undefined }
                    });
                }
            },
            getType(className) {
                //   //================待办子类==================//
                //     MESSAGE_WAIT_DISPATCH("NOTICECLASS02","待下发"),
                //     MESSAGE_WAIT_APPOINT("NOTICECLASS03","待指派"),
                //     MESSAGE_WAIT_ACCEPT("NOTICECLASS04","待接收"),
                //     MESSAGE_WAIT_SURE("NOTICECLASS05","待确认"),
                //     MESSAGE_WAIT_SURE_REJECT("NOTICECLASS06","驳回"), 申请完成的驳回
                //     MESSAGE_WAIT_APPO_REJECT("NOTICECLASS07","退回需下发"),
                //     MESSAGE_WAIT_DISP_REJECT("NOTICECLASS08","退回需指派"),
                //     MESSAGE_WAIT_POSTPONE("NOTICECLASS09","延期申请"),
                //     MESSAGE_WAIT_DEPART("NOTICECLASS10","科室审核"),
                //     MESSAGE_WAIT_SPACE("NOTICECLASS11","处所审核"),
                //     MESSAGE_WAIT_EVALUATE("NOTICECLASS27","待评价"),

                //     MESSAGE_NOTICE_MATERIAL_APPLY("NOTICECLASS28","材料申请"),
                //     MESSAGE_NOTICE_TRANSFER_APPLY("NOTICECLASS31","转单申请"),

                //   //================通知子类类==================//
                //     MESSAGE_NOTICE_AUTO("NOTICECLASS12","自动下发"),
                //     MESSAGE_NOTICE_DISPATCH("NOTICECLASS13","已下发"),
                //     MESSAGE_NOTICE_SURE("NOTICECLASS14","已确认"),
                //     MESSAGE_NOTICE_REACHED("NOTICECLASS15","已到达"),
                //     MESSAGE_NOTICE_TIME("NOTICECLASS16","超时"),
                //     MESSAGE_NOTICE_TIME_WARN("NOTICECLASS17","超时预警"),
                //     MESSAGE_NOTICE_OVER("NOTICECLASS18","已修复"),
                //     MESSAGE_NOTICE_RECOVER("NOTICECLASS19","恢复正常"),
                //     MESSAGE_NOTICE_CLOSE("NOTICECLASS20","关闭"),
                //     MESSAGE_NOTICE_APPLY("NOTICECLASS21","已申报"),
                //     MESSAGE_NOTICE_PRESS("NOTICECLASS22","催办"),
                //     MESSAGE_NOTICE_DELETE("NOTICECLASS23","撤回"),
                //     MESSAGE_NOTICE_SUPER_REJECT("NOTICECLASS24","监理驳回"),
                //     MESSAGE_NOTICE_POST_REJECT("NOTICECLASS25","延期驳回"),
                //     MESSAGE_NOTICE_POST_PASS("NOTICECLASS26","延期审核通过"),

                //     MESSAGE_NOTICE_MATERIAL_PASS("NOTICECLASS29","材料审核通过"),
                //     MESSAGE_NOTICE_MATERIAL_REJECT("NOTICECLASS30","材料审核不通过"),
                //     MESSAGE_NOTICE_TRANSFER_PASS("NOTICECLASS32","转单审核通过"),
                //     MESSAGE_NOTICE_TRANSFER_REJECT("NOTICECLASS33","转单审核不通过"),
                let entrance;
                switch (className) {
                    case 'NOTICECLASS02':
                    case 'NOTICECLASS07':
                        entrance = '工单下发';
                        break;
                    case 'NOTICECLASS03':
                    case 'NOTICECLASS08':
                        entrance = '工单指派';
                        break;
                    case 'NOTICECLASS06':
                    case 'NOTICECLASS04':
                        entrance = '维修处置';
                        break;
                    case 'NOTICECLASS05':
                        entrance = '工单确认';
                        break;
                    case 'NOTICECLASS27':
                        entrance = '工单评价';
                        break;
                    case 'NOTICECLASS09':
                        entrance = '延期审核';
                        break;
                    case 'NOTICECLASS10':
                        entrance = '科室审核';
                        break;
                    case 'NOTICECLASS11':
                        entrance = '处所审核';
                        break;
                    case 'NOTICECLASS28':
                        entrance = '材料审核';
                        break;
                    case 'NOTICECLASS31':
                        entrance = '转单审核';
                        break;
                    default:
                        break;
                }
                return entrance;
            }
        }
    };
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

    .ej-main .ej-menu {
        width: 150px;
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

    body {
        min-width: 1150px;
    }

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .el-menu--popup {
        min-width: 140px;
    }

    .serverpushNotice {
        bottom: 16px !important;
    }
</style>