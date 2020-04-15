<template>
    <div class="ej-main">
        <div class="layout">
            <Header v-show="isHeadVisible"></Header>
            <div v-show="!isHeadVisible" style="height: 60px"></div>
            <div class="h-content h-currency">
                <div class="h-left">
                    <div class="h-left-1">
                        <div class="l1-box">
                            <el-select v-model="deptId" placeholder="辖区选择" class="absolute" popper-class="selectClass">
                                <el-option v-for="item in deptList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                </el-option>
                            </el-select>
                            <div class="li-cont">
                                <p class="num">{{devFaultTotal.TOTAL_SUM||0}}</p>
                                <p class="txt">设备数</p>
                            </div>
                        </div>
                        <div class="l1-box">
                            <h6 class="h-title"><span>&nbsp;</span><i class="left-arrow el-icon-arrow-right"></i></h6>
                            <div class="li-cont">
                                <p class="num">{{devFaultTotal.FAULT_SUM||0}}</p>
                                <p class="txt">故障数</p>
                            </div>
                        </div>
                    </div>
                    <div class="h-left-2">
                        <div class="cor-left"></div>
                        <div class="cor-right"></div>
                        <div class="l2-box">
                            <h6 class="h-title"><span>完好率</span><i class="left-arrow el-icon-arrow-right"></i></h6>
                            <div class="l2-sg">
                                <div class="l2-sg-left">
                                    <div class="speed-box">
                                        <div class="speed">
                                            <i class="big"></i>
                                            <i class="small" :style="'transform:rotate('+(devFaultTotal.GOOD_RATE*180/100-135)+'deg)'"></i>
                                            <span>{{devFaultTotal.GOOD_RATE|twoDecimal}}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="l2-sg-right">
                                    <ul class="l2-sg-pillar">
                                        <li v-for="(item,index) in goodRateOppmTypeList" :key="index">
                                            <span class="name">{{item.OPPM_TYPE_NAME}}</span>
                                            <div class="line">
                                                <span class="ln" :class="'pill-color'+(index+1)" :style="'width:calc('+item.GOOD_RATE+'% - 50px)'"></span>
                                                <span class="wd">{{item.GOOD_RATE|twoDecimal}}%</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="l2-box">
                            <h6 class="h-title"><span>及时修复率</span><i class="left-arrow el-icon-arrow-right"></i></h6>
                            <div class="l2-sg">
                                <div class="l2-sg-left">
                                    <div class="speed-box">
                                        <div class="speed">
                                            <i class="big"></i>
                                            <i class="small" :style="'transform:rotate('+(timelyRepairAll*180/100-135)+'deg)'"></i>
                                            <span>{{timelyRepairAll|twoDecimal}}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="l2-sg-right">
                                    <ul class="l2-sg-pillar">
                                        <li v-for="(item,index) in timelyRepairList" :key="index">
                                            <span class="name">{{item.OPPM_TYPE_NAME}}</span>
                                            <div class="line">
                                                <span class="ln" :class="'pill-color'+(index+1)" :style="'width:calc('+item.GOOD_RATE+'% - 50px)'"></span>
                                                <span class="wd">{{item.GOOD_RATE|twoDecimal}}%</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="h-left-3">
                        <div class="cor-left"></div>
                        <div class="cor-right"></div>
                        <div class="l3-box">
                            <h6 class="h-title"><span>工单数量</span><i class="left-arrow el-icon-arrow-right"></i></h6>
                            <ul class="l3-ul">
                                <li>
                                    <p class="l3-p1">今日工单</p>
                                    <p class="l3-p2">{{workordersInfo.TOTAL_SUM||0}}</p>
                                </li>
                                <li>
                                    <p class="l3-p1">已修复</p>
                                    <p class="l3-p2">{{workordersInfo.GOOD_SUM||0}}</p>
                                </li>
                                <li>
                                    <p class="l3-p1">未修复</p>
                                    <p class="l3-p2">{{workordersInfo.FAULT_SUM||0}}</p>
                                </li>
                                <li>
                                    <p class="l3-p1">超时</p>
                                    <p class="l3-p2">{{workordersInfo.TIMEOUT_SUM||0}}</p>
                                </li>
                            </ul>
                        </div>
                        <div class="l3-box">
                            <h6 class="h-title"><span>维护资源</span><i class="left-arrow el-icon-arrow-right"></i></h6>
                            <ul class="l3-ul">
                                <li>
                                    <p class="l3-p1">维护人员</p>
                                    <p class="l3-p2">5</p>
                                </li>
                                <li>
                                    <p class="l3-p1">维护车辆</p>
                                    <p class="l3-p2">3</p>
                                </li>
                                <li>
                                    <p class="l3-p1">维护监理</p>
                                    <p class="l3-p2">0</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="h-right">
                    <div class="h-right-1">
                        <div class="h-rt-map">
                            <span :class="{'active':mapMode=='GPS'}" @click="mapMode='GPS'">GPS模式</span>
                            <span :class="{'active':mapMode!='GPS'}" @click="mapMode='NOTGPS'">统计模式</span>
                        </div>
                        <div class="h-rt-tips">
                            <div class="cor-left small"></div>
                            <div class="cor-right small"></div>
                            <div class="h-rt-div color-red">
                                <p class="h-rt-p">故障：</p>
                                <div class="h1-wd-box" id="animateBox">
                                    <p class="animate" id="animate1" :style="{'animation-duration': mtimeOne+'s'}">
                                        {{faultTxt}}
                                    </p>
                                </div>
                            </div>
                            <div class="h-rt-div">
                                <p class="h-rt-p">通知：</p>
                                <div class="h1-wd-box" id="animateBox">
                                    <p class="animate" id="animate2" :style="{'animation-duration': mtimeTwo+'s'}">
                                        {{notice}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="m-map-new m-hz" v-show="mapMode=='NOTGPS'">
                            <div class="box-map"></div>
                            <ul class="m-area">
                                <li v-show="getAreaRate('西湖区')>0" class="hover" :class="getColor(getAreaRate('西湖区'))" :alt="getAreaShow('西湖区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('西湖区')+'px'}"></div>
                                    <p>西湖区</p>
                                </li>
                                <li v-show="getAreaRate('拱墅区')>0" class="hover" :class="getColor(getAreaRate('拱墅区'))" :alt="getAreaShow('拱墅区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('拱墅区')+'px'}"></div>
                                    <p>拱墅区</p>
                                </li>
                                <li v-show="getAreaRate('下城区')>0" class="hover" :class="getColor(getAreaRate('下城区'))" :alt="getAreaShow('下城区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('下城区')+'px'}"></div>
                                    <p>下城区</p>
                                </li>
                                <li v-show="getAreaRate('上城区')>0" class="hover" :class="getColor(getAreaRate('上城区'))" :alt="getAreaShow('上城区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('上城区')+'px'}"></div>
                                    <p>上城区</p>
                                </li>
                                <li v-show="getAreaRate('江干区')>0" class="hover" :class="getColor(getAreaRate('江干区'))" :alt="getAreaShow('江干区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('江干区')+'px'}"></div>
                                    <p>江干区</p>
                                </li>
                                <li v-show="getAreaRate('滨江区')>0" class="hover" :class="getColor(getAreaRate('滨江区'))" :alt="getAreaShow('滨江区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('滨江区')+'px'}"></div>
                                    <p>滨江区</p>
                                </li>
                                <li v-show="getAreaRate('景区')>0" class="hover" :class="getColor(getAreaRate('景区'))" :alt="getAreaShow('景区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('景区')+'px'}"></div>
                                    <p>景区</p>
                                </li>
                            </ul>
                        </div>
                        <div class="m-map-url" v-show="mapMode=='GPS'"></div>
                    </div>
                    <div class="h-right-2">
                        <div class="cor-left"></div>
                        <div class="cor-right"></div>
                        <h6 class="h-title"><span>各系统完好率</span></h6>
                        <el-carousel class="r2-box" arrow="always" :autoplay="false" :loop="false" indicator-position="none" v-if="devRepDevType.length>0">
                            <el-carousel-item v-for="(itemNun,indexNun) in Math.ceil(devRepDevType.length/6)" :key="itemNun">
                                <ul class="r2-ul">
                                    <li v-for="(item,index) in 6" :key="item+'a'">
                                        <template v-if="(6*indexNun+index)<devRepDevType.length">
                                            <div class="speed-box small-size" :class="getColor(devRepDevType[6*indexNun+index].GOOD_RATE)">
                                                <div class="speed">
                                                    <i class="big"></i>
                                                    <i class="small" :style="'transform:rotate('+(devRepDevType[6*indexNun+index].GOOD_RATE*180/100-135)+'deg)'"></i>
                                                    <span>{{devRepDevType[6*indexNun+index].GOOD_RATE|twoDecimal}}%</span>
                                                </div>
                                            </div>
                                            <p class="r2-p1">{{devRepDevType[6*indexNun+index].DEV_TYPE_NAME}}</p>
                                            <p class="r2-p2">{{devRepDevType[6*indexNun+index].TOTAL_SUM}}</p>
                                        </template>
                                    </li>
                                </ul>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Header from "./header_sb.vue";
    export default {
        components: {
            Header,
        },
        filters: {
            twoDecimal(val) {
                return Math.round((val || 0) * 100) / 100;
            }
        },
        data() {
            return {
                title: '',
                token: "",
                devFaultTotal: {},
                goodRateOppmTypeList: [],
                devRepDevType: [],
                devFaultAreaObj: {},
                areaPillarMaxHeight: 100, //区域柱形图的最高高度（单位像素）
                mapMode: 'NOTGPS',
                timelyRepairAll: 0,
                timelyRepairList: [],
                workordersInfo: {},
                faultTxt: '',
                notice: '',
                deptId: '',
                deptList: [],
                userInfo: {},
                isHeadVisible: false,
                isHeadMenuVisible: true,
                mtimeOne: 0,
                mtimeTwo: 0
            };
        },
        watch: {
            deptId(val) {
                this.initGet();
            }
        },
        methods: {
            // 设备数和故障数
            getFaultTotal() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectTotal`, { deptId: this.deptId }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.devFaultTotal = res.resultList && res.resultList.length > 0 ? res.resultList[0] : {};
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 项目类型（支队外建等）
            getFaultOppmType() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectByOppmType`, { deptId: this.deptId }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = res.resultList || [];
                            let order = ['支队维护', '租赁维护', '外建维护']
                            let rt = [];
                            for (let i = 0; i < 3; i++) {
                                let qw = arr.filter(tiem => tiem.OPPM_TYPE_NAME == order[i]);
                                if (qw.length > 0) {
                                    rt.push(qw[0]);
                                } else {
                                    rt.push({ OPPM_TYPE_NAME: order[i], GOOD_RATE: 0 });
                                }
                            }
                            this.goodRateOppmTypeList = rt;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 各子系统完好率（电警信号机等）
            getRepDevType() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectByDevType`, { deptId: this.deptId }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.devRepDevType = res.resultList || [];
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 区域的完好率
            getFaultDevArea() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectByDevArea`, { deptId: this.deptId }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = res.resultList || [];
                            this.devFaultAreaObj = { maxNum: 0 };
                            arr.map(item => {
                                if (item.GOOD_RATE > this.devFaultAreaObj.maxNum) {
                                    this.devFaultAreaObj.maxNum = item.GOOD_RATE || 0;
                                }
                                switch (item.DEV_AREA_NAME) {
                                    case '上城区':
                                    case '拱墅区':
                                    case '滨江区':
                                    case '江干区':
                                    case '西湖区':
                                    case '下城区':
                                    case '景区':
                                    case '高架辖区':
                                        this.devFaultAreaObj[item.DEV_AREA_NAME] = item;
                                        break;
                                    default:
                                        break;
                                }
                            });
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 区域完好率的百分比
            getAreaPer(name) {
                // 区域完好率里基于最大数的百分比
                // return (this.devFaultAreaObj[name] ? this.devFaultAreaObj[name].GOOD_RATE : 0) / (this.devFaultAreaObj.maxNum || 1);
                let num = this.devFaultAreaObj[name] ? (this.devFaultAreaObj[name].GOOD_RATE || 0) : 0;
                return num / 100;
            },
            // 区域里每个地区的总数和百分比
            getAreaShow(name) {
                return this.devFaultAreaObj[name] ? (`${this.devFaultAreaObj[name].TOTAL_SUM}(${Math.round((this.devFaultAreaObj[name].GOOD_RATE || 0) * 100) / 100}%)`) : '';
            },
            // 区域里每个地区的完好率
            getAreaRate(name) {
                return this.devFaultAreaObj[name] ? (this.devFaultAreaObj[name].GOOD_RATE || 0) : 0;
            },
            // 根据完好率的值给颜色
            getColor(num) {
                num = parseFloat(num);
                let arr = [100, 98, 95, 90]; //颜色层次
                let txt = '';
                if (num >= arr[0]) {
                    txt = 'color1';
                } else if (num >= arr[1]) {
                    txt = 'color2';
                } else if (num >= arr[2]) {
                    txt = 'color3';
                } else if (num >= arr[3]) {
                    txt = 'color4';
                } else {
                    txt = 'color5';
                }
                return txt;
            },
            // 整体及时修复率
            getRepairAll() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/worksTimelyRepairCollectAll`, { deptId: this.deptId }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.timelyRepairAll = res.resultList ? res.resultList[0].GOOD_RATE : 0;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 项目及时修复率
            getRepairOppm() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/worksTimelyRepairCollectOppm`, { deptId: this.deptId }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = res.resultList || [];
                            let order = ['支队维护', '租赁维护', '外建维护']
                            let rt = [];
                            for (let i = 0; i < 3; i++) {
                                let qw = arr.filter(tiem => tiem.OPPM_TYPE_NAME == order[i]);
                                if (qw.length > 0) {
                                    rt.push(qw[0]);
                                } else {
                                    rt.push({ OPPM_TYPE_NAME: order[i], GOOD_RATE: 0 });
                                }
                            }
                            this.timelyRepairList = rt;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 工单数量
            getWorkorders() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/workordersRepairCollect`, { deptId: this.deptId }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.workordersInfo = res.resultList ? res.resultList[0] : {};
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 消息--查询最近N条故障工单
            getLatelyFault() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/getDeviceLatelyFault`, {}, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = [];
                            res.resultList.map(item => {
                                arr.push(`${item.DEV_NAME}（${item.DEV_TYPE_NAME}） - ${item.FAILURE_DESCRIBLE}`);
                            });
                            this.faultTxt = arr.join('，');

                            this.$nextTick(() => {
                                let sudu = 6; // 代表速度，速度越大动画越慢
                                let all = document.getElementById('animateBox').getBoundingClientRect().width / sudu;
                                let width1 = document.getElementById('animate1').getBoundingClientRect().width;
                                this.mtimeOne = width1 / all;
                                // let width2 = document.getElementById('animate2').getBoundingClientRect().width;
                                // this.mtimeTwo = width2 / all;
                            });
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },

            // 获取用户信息
            getUserInfo() {
                let host = this.$config.efoms_HOST;
                let method = '/userCheck/selectUser';
                let token = Common.getQueryString("token");
                this.$api.getMethod(host, method, { token: token, systemKey: this.$config.systemKeyDev }, token).then(res => {
                    if (res.appCode == 0) {
                        this.userInfo = res.resultList || {};
                    }
                }).catch(err => {
                    Common.printErrorLog(err);
                });
            },
            initGet() {
                this.getFaultTotal();
                this.getFaultOppmType();
                this.getRepDevType();
                this.getFaultDevArea();
                this.getRepairAll();
                this.getRepairOppm();
                this.getWorkorders();
                this.getLatelyFault();
            }
        },
        created() {
            this.isHeadVisible = Common.getQueryString("head") != 'hide';
            this.isHeadMenuVisible = Common.getQueryString("headMenu") != 'hide';
            // if (this.isHeadMenuVisible) {
            //     this.getUserInfo();
            // }
        },
        mounted() {
            let _this = this;
            this.token = Common.getQueryString("token");
            this.deptList = [{ dicCode: '', dicName: '全部辖区' }, { dicCode: '330106000000', dicName: '西湖大队' }, { dicCode: '330104000000', dicName: '江干大队' }, { dicCode: '330105000000', dicName: '拱墅大队' }, { dicCode: '330192000000', dicName: '高架大队' }, { dicCode: '330103000000', dicName: '下城大队' }, { dicCode: '330108000000', dicName: '滨江大队' }, { dicCode: '330102000000', dicName: '上城大队' }, { dicCode: '330197000000', dicName: '景区大队' }, { dicCode: '330198000000', dicName: '下沙大队' }];

            // if (this.isHeadMenuVisible) {
            //     this.tipsPush('EFOMS_OPERATION');
            //     this.tipsPush('efoms_heartbeat');
            // }

            this.initGet();
            // // 一定时间后刷新页面数据
            setInterval(() => {
                this.initGet();
            }, 1 * 60 * 1000);

            // 监听窗口的变化
            let width = document.body.clientWidth;

            if (width <= 1366) {
                this.areaPillarMaxHeight = 70;
            } else if (width <= 1440) {
                this.areaPillarMaxHeight = 80;
            } else if (width <= 1600) {
                this.areaPillarMaxHeight = 90;
            } else {
                this.areaPillarMaxHeight = 100;
            }
            window.onresize = () => {
                let width = document.body.clientWidth;
                if (width <= 1366) {
                    this.areaPillarMaxHeight = 70;
                } else if (width <= 1440) {
                    this.areaPillarMaxHeight = 80;
                } else if (width <= 1600) {
                    this.areaPillarMaxHeight = 90;
                } else {
                    this.areaPillarMaxHeight = 100;
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "./home.less";
    @import "./home_sb.less";

    .absolute {
        position: absolute;
        left: 20px;
        top: 3px;

        /deep/ &.el-select {
            width: 90px;

            .el-input__inner {
                background: transparent;
                border: none;
                height: 20px;
                line-height: 20px;
                padding: 0;
                font-size: 12px;
                color: #16F7FB;


            }

            .el-input__icon {
                line-height: 22px;
                font-size: 10px;
                color: #16F7FB;
            }

            ::-webkit-input-placeholder {
                /*Webkit browsers*/
                color: #16F7FB;
            }

            :-moz-placeholder {
                /*Mozilla Firefox 4 to 8*/
                color: #16F7FB;
            }

            :-ms-input-placeholder {
                /*Internet Explorer 10+*/
                color: #16F7FB;
            }
        }
    }
</style>
<style>
    /* 下拉框弹出样式 */
    .selectClass.el-popper[x-placement^=bottom] {
        margin-top: 4px;
    }

    .selectClass.el-popper[x-placement^=bottom] .popper__arrow {
        display: none;
    }

    .selectClass.el-select-dropdown {
        background: #040B19;
        border: 1px solid #124D78;
        border-radius: 0;
    }

    .selectClass .el-select-dropdown__list {
        padding: 0;
    }

    .selectClass .el-select-dropdown__item {
        font-size: 12px;
        padding: 0;
        /* width: 58px; */
        text-align: center;
        height: 24px;
        line-height: 24px;
        color: #d6d4d4;
        font-weight: 100;
    }

    .selectClass .el-select-dropdown__item.selected {
        color: #ffffff;
        font-weight: 700;
    }

    .selectClass .el-select-dropdown__item.hover,
    .selectClass .el-select-dropdown__item:hover {
        background: rgba(0, 46, 117, 0.96);
    }

    /* 下拉框弹出样式 */


    /* 浮窗样式 */
    .el-popover.pop-table {
        background: rgba(0, 46, 117, 0.96);
        border: 1px solid #2B68C8;
        box-shadow: 0 11px 20px -6px rgba(9, 23, 73, 0.91);
        border-radius: 2px;
    }

    .el-popover.pop-table .popper__arrow {
        display: none;
    }

    /* 浮窗样式 */
</style>