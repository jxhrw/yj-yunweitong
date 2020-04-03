<template>
    <div class="ej-main">
        <div class="layout">
            <Header v-show="isHeadVisible"></Header>
            <div v-show="!isHeadVisible" style="height: 60px"></div>
            <div class="h-content h-currency">
                <div class="h-left">
                    <div class="h-left-1">
                        <div class="l1-box">
                            <el-select v-model="areaCode" placeholder="辖区选择" class="absolute" popper-class="selectClass">
                                <el-option label="大啊" value="1">
                                </el-option>
                                <el-option label="小啊" value="2">
                                </el-option>
                                <!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option> -->
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
                                            <i class="small" :style="'transform:rotate('+(60*180/100-135)+'deg)'"></i>
                                            <span>{{60|twoDecimal}}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="l2-sg-right">
                                    <ul class="l2-sg-pillar">
                                        <li>
                                            <span class="name">支队维护</span>
                                            <div class="line">
                                                <span class="ln pill-color1" :style="'width:calc('+91+'% - 30px)'"></span>
                                                <span class="wd">91%</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span class="name">外建维护</span>
                                            <div class="line">
                                                <span class="ln pill-color2" :style="'width:calc('+51+'% - 30px)'"></span>
                                                <span class="wd">51%</span>
                                            </div>
                                        </li>
                                        <li>
                                            <span class="name">其他维护</span>
                                            <div class="line">
                                                <span class="ln pill-color3" :style="'width:calc('+25+'% - 30px)'"></span>
                                                <span class="wd">25%</span>
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
                                    <p class="l3-p2">303</p>
                                </li>
                                <li>
                                    <p class="l3-p1">已修复</p>
                                    <p class="l3-p2">303</p>
                                </li>
                                <li>
                                    <p class="l3-p1">未修复</p>
                                    <p class="l3-p2">303</p>
                                </li>
                                <li>
                                    <p class="l3-p1">超时</p>
                                    <p class="l3-p2">303</p>
                                </li>
                            </ul>
                        </div>
                        <div class="l3-box">
                            <h6 class="h-title"><span>维护资源</span><i class="left-arrow el-icon-arrow-right"></i></h6>
                            <ul class="l3-ul">
                                <li>
                                    <p class="l3-p1">维护人员</p>
                                    <p class="l3-p2">303</p>
                                </li>
                                <li>
                                    <p class="l3-p1">维护车辆</p>
                                    <p class="l3-p2">303</p>
                                </li>
                                <li>
                                    <p class="l3-p1">维护监理</p>
                                    <p class="l3-p2">303</p>
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
                                        文字滚动的内容文字滚动的内容文字滚动的内容文字滚动的内容文字滚动的内容文字滚动的内容文字滚动的内容文字滚动的内容
                                    </p>
                                </div>
                            </div>
                            <div class="h-rt-div">
                                <p class="h-rt-p">通知：</p>
                                <div class="h1-wd-box" id="animateBox">
                                    <p class="animate" id="animate2" :style="{'animation-duration': mtimeTwo+'s'}">
                                        放就放了看见分厘卡即使骷髅法师发生发撒的拉法基拉开圣诞节立刻发酵饲料去微软推哦爬山的功夫还将开展宣传v你妈妈11111111111222222222299999
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="m-map-new m-hz" v-show="mapMode=='NOTGPS'">
                            <div class="box-map"></div>
                            <ul class="m-area">
                                <li :alt="getAreaShow('西湖区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('西湖区')+'px'}"></div>
                                    <p>西湖区</p>
                                </li>
                                <li :alt="getAreaShow('拱墅区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('拱墅区')+'px'}"></div>
                                    <p>拱墅区</p>
                                </li>
                                <li :alt="getAreaShow('下城区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('下城区')+'px'}"></div>
                                    <p>下城区</p>
                                </li>
                                <li :alt="getAreaShow('上城区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('上城区')+'px'}"></div>
                                    <p>上城区</p>
                                </li>
                                <li :alt="getAreaShow('江干区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('江干区')+'px'}"></div>
                                    <p>江干区</p>
                                </li>
                                <li :alt="getAreaShow('滨江区')">
                                    <div :style="{'height': areaPillarMaxHeight*getAreaPer('滨江区')+'px'}"></div>
                                    <p>滨江区</p>
                                </li>
                                <li :alt="getAreaShow('景区')">
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
                                            <div class="speed-box small-size" :class="'color'+(item)">
                                                <div class="speed">
                                                    <i class="big"></i>
                                                    <i class="small" :style="'transform:rotate('+(devRepDevType[6*indexNun+index].GOOD_RATE*180/100-135)+'deg)'"></i>
                                                    <span>{{devRepDevType[6*indexNun+index].GOOD_RATE|twoDecimal}}%</span>
                                                </div>
                                            </div>
                                            <p class="r2-p1">{{devRepDevType[6*indexNun+index].DEV_TYPE_NAME}}</p>
                                            <p class="r2-p2">{{devRepDevType[6*indexNun+index].GOOD_SUM}}</p>
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
    import Popover from './popover.vue';
    export default {
        components: {
            Header,
            Popover
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



                areaCode: '',
                period: 'month',
                periodList: [{
                    value: 'month',
                    label: '按月'
                }, {
                    value: 'week',
                    label: '按周'
                }, {
                    value: 'day',
                    label: '按日'
                }],
                ring: {},
                bar: {},
                circular: {},
                devFaultRank: [],
                devRepTotal: {},
                devRepOppmDept: [],
                devRepDept: [],
                todoList: [],
                onlineCount: {},
                userInfo: {},
                isHeadVisible: false,
                isHeadMenuVisible: true,
                dataIndex: 0, //项目类型高亮扇区的索引
                goodRateAll: {},
                goodRateOppmTypeSingle: {},
                // option: EchartsJs.get3dPie,
                popoverDatas: {},
                popoverLists: {},
                popQuery: {}, //浮窗的请求参数

                mtimeOne: 0,
                mtimeTwo: 0
            };
        },
        watch: {
            period(val) {
                this.initGet();
            }
        },
        methods: {
            // 设备数和故障数
            getFaultTotal() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectTotal`, {}, { token: this.token })
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
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/devGoodRateByOppmType`, { timeType: this.period, startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.goodRateOppmTypeList = res.resultList || [];
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
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/devGoodRateByDevType`, { timeType: this.period, startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
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
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/devGoodRateByDevArea`, { timeType: this.period, startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
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
            // 区域完好率里基于最大数的百分比
            getAreaPer(name) {
                return (this.devFaultAreaObj[name] ? this.devFaultAreaObj[name].GOOD_RATE : 0) / (this.devFaultAreaObj.maxNum || 1);
            },
            // 区域里每个地区的完好数和百分比
            getAreaShow(name) {
                return this.devFaultAreaObj[name] ? (`${this.devFaultAreaObj[name].GOOD_SUM}(${Math.round((this.devFaultAreaObj[name].GOOD_RATE || 0) * 100) / 100}%)`) : '';
            },




            getDevDteail(type, data) {
                this.popoverLists = {}; //重置浮窗数据，其实是初始化浮窗位置
                let obj = { startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end, devTypeCode: undefined, devAreaCode: undefined, oppmType: undefined, pageSize: 10, currentPage: 1 };

                if (type == 'area') {
                    obj.devAreaCode = data.DEV_AREA_CODE;
                    this.popoverDatas = {
                        type: type,
                        name: data.DEV_AREA_NAME,
                        totalSum: data.TOTAL_SUM,
                        faultSum: data.FAULT_SUM,
                        goodRate: data.GOOD_RATE
                    };
                }
                if (type == 'oppm') {
                    data = this.goodRateOppmTypeSingle;
                    obj.oppmType = data.OPPM_TYPE;
                    this.popoverDatas = {
                        type: type,
                        name: data.OPPM_TYPE_NAME,
                        totalSum: data.TOTAL_SUM,
                        faultSum: data.FAULT_SUM,
                        goodRate: data.GOOD_RATE
                    };
                }
                if (type == 'devtype') {
                    obj.devTypeCode = data.DEV_TYPE_CODE;
                    this.popoverDatas = {
                        type: type,
                        name: data.DEV_TYPE_NAME,
                        totalSum: data.TOTAL_SUM,
                        faultSum: data.FAULT_SUM,
                        goodRate: data.GOOD_RATE
                    };
                }
                this.popQuery = obj;
                this.getDevDetailPage();
            },
            getDevDetailPage(page) {
                this.popQuery.currentPage = page || 1;
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/selectDeviceFaultDetailPage`, this.popQuery, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.popoverLists = res.resultList || {};
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getGoodRateAll() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/devGoodRateByAll`, { timeType: this.period, startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.goodRateAll = res.resultList ? res.resultList[0] : {};
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            ringSolidClick(event, instance, echarts) {
                // console.log(event);
                if (event.dataIndex != this.dataIndex) {
                    this.$refs.echarts1.dispatchAction({
                        type: 'downplay',
                        seriesIndex: 1,
                        dataIndex: this.dataIndex
                    });
                }
                // this.ring.series[1].data[this.dataIndex] = false;
                this.dataIndex = event.dataIndex;
                this.goodRateOppmTypeSingle = this.goodRateOppmTypeList[this.dataIndex];
                // this.ring.series[1].data[this.dataIndex] = true;
                // this.$refs.echarts1.dispatchAction({
                //     type: 'highlight',
                //     seriesIndex: 1,
                //     dataIndex: this.dataIndex
                // });
                setTimeout(() => {
                    document.getElementById('oppmTu').click();
                }, 300);

            },
            ringSolidMouseover(event) {
                // console.log(event);
                // if (event.dataIndex != this.dataIndex) {
                //     this.$refs.echarts1.dispatchAction({
                //         type: 'downplay',
                //         seriesIndex: 1,
                //         dataIndex: event.dataIndex
                //     });
                // }
            },
            ringSolidMouseout(event) {
                // console.log(event);
                this.$refs.echarts1.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 1,
                    dataIndex: this.dataIndex
                });
            },
            getFaultDevType() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectByDevType`, {}, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let xData = [];
                            let ssData = [];
                            res.resultList.map(item => {
                                xData.push(item.DEV_TYPE_NAME);
                                ssData.push(Math.round(item.FAULT_SUM));
                            });

                            let bar = EchartsJs.getBar;
                            bar.xAxis[0].data = xData;
                            bar.series[0].data = ssData;
                            this.bar = bar;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getFaultRanking() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultRanking`, { startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.devFaultRank = res.resultList;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getRepTotal() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairCollectTotal`, { startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.devRepTotal = res.resultList && res.resultList.length > 0 ? res.resultList[0] : {};
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getRepOppmDept() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairCollectByOppmDept`, { startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.devRepOppmDept = res.resultList || [];
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
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
            },
            getNotice() {
                let startTime = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 00:00:00';
                let endTime = Common.dateFormat('yyyy-MM-dd hh:mm:ss', new Date());
                this.todoList = [];
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/getNoticeHisCollect`, { startTime: startTime, endTime: endTime }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = res.resultList || {};
                            arr.map(item => {
                                this.todoList.push({
                                    content: item.noticeContent,
                                    type: item.noticeClassName,
                                    time: item.noticeTime
                                });
                            });
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getRepStatus() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairStatusCollect`, { startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = [];
                            let arr3d = [];
                            let obj = res.resultList || {};
                            if (obj.APPLY_SUM > 0) {
                                // arr.push({ name: '已申报', value: parseInt(obj.APPLY_SUM) });
                                arr3d.push({ name: '已申报', y: parseInt(obj.APPLY_SUM) });
                            }
                            if (obj.SEND_SUM > 0) {
                                // arr.push({ name: '已下发', value: parseInt(obj.SEND_SUM) });
                                arr3d.push({ name: '已下发', y: parseInt(obj.SEND_SUM) });
                            }
                            if (obj.ACCEPT_SUM > 0) {
                                // arr.push({ name: '已接受', value: parseInt(obj.ACCEPT_SUM) });
                                arr3d.push({ name: '已接受', y: parseInt(obj.ACCEPT_SUM) });
                            }
                            if (obj.TIMEOUT_SUM > 0) {
                                // arr.push({ name: '已超时', value: parseInt(obj.TIMEOUT_SUM) });
                                arr3d.push({ name: '已超时', y: parseInt(obj.TIMEOUT_SUM) });
                            }
                            if (obj.REPAIR_SUM > 0) {
                                // arr.push({ name: '已维修', value: parseInt(obj.REPAIR_SUM) });
                                arr3d.push({ name: '已维修', y: parseInt(obj.REPAIR_SUM) });
                            }
                            if (obj.SURE_SUM > 0) {
                                // arr.push({ name: '已确定', value: parseInt(obj.SURE_SUM) });
                                arr3d.push({ name: '已确定', y: parseInt(obj.SURE_SUM) });
                            }
                            if (obj.EVALUATE_SUM > 0) {
                                // arr.push({ name: '已评价', value: parseInt(obj.EVALUATE_SUM) });
                                arr3d.push({ name: '已评价', y: parseInt(obj.EVALUATE_SUM) });
                            }

                            // let circular = EchartsJs.getCircular;
                            // circular.series[0].data = arr;
                            // this.circular = circular;
                            this.option.series[0].data = arr3d;
                            this.$refs.pie3d.update();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getRepDept() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairCollectByDept`, { startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = res.resultList || [];
                            this.devRepDept = arr;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // serverpush
            tipsPush(code) {
                let _this = this;
                ServerPush.receive(code, 'message', (res) => {
                    console.log(res);
                    if (code == 'EFOMS_OPERATION' && res.type == '待办') {
                        _this.todoList.unshift({
                            content: res.content,
                            type: _this.getType(res.class),
                            time: res.recordTime
                        });
                    }
                });
            },
            // 获取用户信息
            getUserInfo() {
                let host = this.$config.efoms_HOST;
                let method = '/userCheck/selectUser';
                let token = Common.getQueryString("token");
                this.$api.getMethod(host, method, { token: token }, token).then(res => {
                    if (res.appCode == 0) {
                        this.userInfo = res.resultList || {};
                    }
                }).catch(err => {
                    Common.printErrorLog(err);
                });
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
            },
            getWhatTime(type) {
                let obj = { start: '', end: '' };
                obj.end = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 23:59:59';
                if (type == 'month') {
                    obj.start = Common.dateFormat('yyyy-MM-01', new Date()) + ' 00:00:00';
                } else if (type == 'week') {
                    let date = new Date();
                    let weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
                    date.setDate(date.getDate() - weekday + 1);
                    obj.start = Common.dateFormat('yyyy-MM-dd', date) + ' 00:00:00';
                } else {
                    obj.start = Common.dateFormat('yyyy-MM-dd', new Date()) + ' 00:00:00';
                }
                return obj;
            },
            initGet() {
                this.getFaultTotal();
                this.getFaultOppmType();
                this.getRepDevType();
                this.getFaultDevArea();
                // this.getGoodRateAll();
                // // this.getFaultDevType();
                // this.getFaultRanking();
                // this.getRepTotal();
                // this.getRepOppmDept();
                // // this.getOnline();
                // this.getNotice();
                // this.getRepStatus();
                // this.getRepDept();
            }
        },
        created() {
            this.isHeadVisible = Common.getQueryString("head") != 'hide';
            this.isHeadMenuVisible = Common.getQueryString("headMenu") != 'hide';
            if (this.isHeadMenuVisible) {
                this.getUserInfo();
            }
        },
        mounted() {
            let _this = this;
            this.token = Common.getQueryString("token");
            this.$nextTick(() => {
                let sudu = 6; // 代表速度，速度越大动画越慢
                let all = document.getElementById('animateBox').getBoundingClientRect().width / sudu;
                let width1 = document.getElementById('animate1').getBoundingClientRect().width;
                let width2 = document.getElementById('animate2').getBoundingClientRect().width;
                this.mtimeOne = width1 / all;
                this.mtimeTwo = width2 / all;
            });

            if (this.isHeadMenuVisible) {
                this.tipsPush('EFOMS_OPERATION');
                this.tipsPush('efoms_heartbeat');
            }

            this.initGet();
            // // 一定时间后刷新页面数据
            // setInterval(() => {
            //     this.initGet();
            // }, 1 * 60 * 1000);

            // 监听窗口的变化
            let width = document.body.clientWidth;
            if (width <= 1366) {
                this.areaPillarMaxHeight = 80;
            }
            window.onresize = () => {
                let width = document.body.clientWidth;
                if (width <= 1366) {
                    this.areaPillarMaxHeight = 80;
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