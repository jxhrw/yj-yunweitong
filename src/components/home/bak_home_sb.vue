<template>
    <div class="ej-main">
        <div class="layout">
            <Header v-show="isHeadVisible"></Header>
            <div v-show="!isHeadVisible" style="height: 60px"></div>
            <div class="h-content h-currency">
                <div class="h-top">
                    <div class="h-left">
                        <div class="bg-style h-top-left">
                            <div class="bg-title">
                                <h5>资产项目类型分布</h5>
                                <!-- <ul class="btns">
                                    <li class="active">按年</li>
                                    <li>按月</li>
                                    <li>按日</li>
                                </ul> -->
                            </div>
                            <div class="c-echart">
                                <ECharts class="c-ring" :options="ring" ref="echarts1"></ECharts>
                            </div>
                        </div>
                        <div class="bg-style h-top-left">
                            <div class="bg-title">
                                <h5>故障设备分布</h5>
                                <!-- <ul class="btns">
                                    <li class="active">按年</li>
                                    <li>按月</li>
                                    <li>按日</li>
                                </ul> -->
                            </div>
                            <div class="c-echart">
                                <ECharts class="c-bar" :options="bar" ref="echarts2"></ECharts>
                            </div>
                        </div>
                    </div>
                    <div class="h-middle">
                        <div class="h-top-middle-1">
                            <div class="bg-style h-top-middle-content">
                                <ul class="m-ul">
                                    <li class="sbs">
                                        <p>{{devFaultTotal.TOTAL_SUM}}</p><span>设备数</span>
                                    </li>
                                    <li class="gzs">
                                        <p>{{devFaultTotal.FAULT_SUM}}</p><span>故障数</span>
                                    </li>
                                    <li class="whl">
                                        <p>{{Math.round(devFaultTotal.GOOD_RATE*100)/100}}%</p><span>完好率</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="bg-style h-top-middle-content">
                                <ul class="m-ul">
                                    <li class="gds">
                                        <p>{{devRepTotal.TOTAL_SUM}}</p><span>工单数</span>
                                    </li>
                                    <li class="whz">
                                        <p>{{devRepTotal.FAULT_SUM}}</p><span>维护中</span>
                                    </li>
                                    <li class="whl">
                                        <p>{{Math.round(devRepTotal.GOOD_RATE*100)/100}}%</p><span>修复率</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="bg-style h-top-middle-2">
                            <div class="m-map" v-if="$config.cityName=='hangzhou'">
                                <div class="box-map"></div>
                                <ul class="m-area">
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['西湖区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['西湖区']"></div>
                                        <p>西湖区</p>
                                    </li>
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['拱墅区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['拱墅区']"></div>
                                        <p>拱墅区</p>
                                    </li>
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['下城区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['下城区']"></div>
                                        <p>下城区</p>
                                    </li>
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['上城区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['上城区']"></div>
                                        <p>上城区</p>
                                    </li>
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['江干区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['江干区']"></div>
                                        <p>江干区</p>
                                    </li>
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['滨江区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['滨江区']"></div>
                                        <p>滨江区</p>
                                    </li>
                                </ul>
                            </div>
                            <div class="m-map m-nc" v-if="$config.cityName=='nanchang'">
                                <div class="box-map"></div>
                                <ul class="m-area">
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['西湖区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['西湖区']"></div>
                                        <p>西湖区</p>
                                    </li>
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['红谷滩区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['红谷滩区']"></div>
                                        <p>红谷滩区</p>
                                    </li>
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['青山湖区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['青山湖区']"></div>
                                        <p>青山湖区</p>
                                    </li>
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['东湖区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['东湖区']"></div>
                                        <p>东湖区</p>
                                    </li>
                                    <li>
                                        <div :style="{'height': 80*(devFaultAreaObj['青云谱区']/devFaultAreaObj.maxNum)+'px'}" :alt="devFaultAreaObj['青云谱区']"></div>
                                        <p>青云谱区</p>
                                    </li>
                                </ul>
                            </div>
                            <table class="m-table">
                                <tr v-for="item in devFaultAreaList" :key="item.DEV_AREA_NAME">
                                    <td>{{item.DEV_AREA_NAME}}</td>
                                    <td>{{item.TOTAL_SUM}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="h-right">
                        <div class="h-top-right">
                            <div class="bg-style h-top-right-1">
                                <p>当前在线人数： <i>{{(parseInt(onlineCount.APP)||0)+(parseInt(onlineCount.WEB)||0)}}</i> <span>|</span> 今日上线人数：<i>{{(parseInt(onlineCount.APP_TOTAL)||0)+(parseInt(onlineCount.WEB_TOTAL)||0)}}</i> <i></i></p>
                            </div>
                            <div class="bg-style h-top-right-2">
                                <div class="bg-title">
                                    <h5>待办事项报警详情</h5>
                                </div>
                                <div class="h-top-right-table h-top-right-table-title">
                                    <p class="row-1"></p>
                                    <p class="row-2">消息类型</p>
                                    <p class="row-3">消息内容</p>
                                    <!-- <p class="row-5">报修时间</p> -->
                                    <!-- <p class="row-4">区域</p>
                                    <p class="row-6">报修人</p> -->
                                </div>
                                <el-scrollbar class="h-top-right-scroll">
                                    <template v-for="(item,index) in todoList">
                                        <div class="h-top-right-table h-top-right-table-content" :key="index">
                                            <p class="row-1"><i>{{index}}</i></p>
                                            <p class="row-2" :title="item.type">{{item.type}}</p>
                                            <p class="row-3" :title="item.content">{{item.content}}</p>
                                            <!-- <p class="row-5">{{item.time}}</!-->
                                            <!-- <p class="row-4">西湖</p>
                                            <p class="row-6">弓斌功</p> -->
                                        </div>
                                    </template>
                                </el-scrollbar>
                            </div>
                        </div>
                        <div class="bg-style h-top-right">
                            <div class="bg-title">
                                <h5>工单状态分布</h5>
                            </div>
                            <div class="c-echart">
                                <ECharts class="c-ring" :options="circular" ref="echarts3"></ECharts>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-bottom">
                    <div class="h-left">
                        <div class="bg-style h-bottom-left">
                            <div class="bg-title">
                                <h5>设备故障频率排名</h5>
                                <!-- <ul class="btns">
                                    <li class="active">按年</li>
                                    <li>按月</li>
                                    <li>按日</li>
                                </ul> -->
                            </div>
                            <el-scrollbar class="h-bottom-left-scroll">
                                <ul class="h-bottom-left-ul">
                                    <li v-for="item in devFaultRank" :key="item.DEV_ID">
                                        <p class="name">{{item.DEV_NAME}} {{item.TOTAL_SUM}}</p>
                                        <div class="scale">
                                            <div class="s-color" :style="{'width': `${item.TOTAL_SUM/devFaultRank[0].TOTAL_SUM*100}%`}"></div>
                                        </div>
                                    </li>
                                </ul>
                            </el-scrollbar>
                        </div>
                    </div>
                    <div class="h-middle">
                        <div class="h-bottom-middle">
                            <div class="bg-style h-bottom-middle-1">
                                <div class="ct-title">
                                    <h5>运维效能分布</h5>
                                </div>
                                <ul class="h-bottom-middle-ul">
                                    <li v-for="item in devRepDevType" :key="item.DEV_TYPE_NAME">
                                        <div class="speed" :alt="Math.round(item.GOOD_RATE*100)/100+'%'"><i :style="'transform:rotate('+(item.GOOD_RATE*180/100-135)+'deg)'"></i><span>{{item.TOTAL_SUM}}</span></div>
                                        <p>{{item.DEV_TYPE_NAME}}</p>
                                    </li>
                                </ul>
                            </div>
                            <div class="bg-style h-bottom-middle-2">
                                <div class="ct-title">
                                    <h5>维护单位运营能力</h5>
                                </div>
                                <div class="h-bottom-middle-table h-bottom-middle-table-title">
                                    <p class="row-1">运维单位</p>
                                    <p class="row-4 t-right">工单总数</p>
                                    <p class="row-4 t-right">超时工单</p>
                                    <p class="row-5 t-right">未完成工单</p>
                                    <p class="row-6 t-right">申请延期工单</p>
                                    <p class="row-5 t-right">工单准时率</p>
                                    <p class="row-5 t-right">工单完成率</p>
                                    <p class="row-7 t-right">工单申请延期率</p>
                                </div>
                                <el-scrollbar class="h-bottom-middle-scroll">
                                    <template v-for="item in devRepOppmDept">
                                        <div class="h-bottom-middle-table h-bottom-middle-table-content" :key="item.OP_DEPT_NAME">
                                            <p class="row-1" :title="item.OP_DEPT_NAME">{{item.OP_DEPT_NAME}}</p>
                                            <p class="row-4 t-right">{{item.TOTAL_SUM}}</p>
                                            <p class="row-4 t-right">{{item.TIMEOUT_SUM}}</p>
                                            <p class="row-5 t-right">{{item.UNFINISHED_SUM}}</p>
                                            <p class="row-6 t-right">{{item.POSTPONE_SUM}}</p>
                                            <p class="row-5 t-right">{{Math.round(item.ONTIME_RATE*100)/100}}{{item.ONTIME_RATE>0?'%':''}}</p>
                                            <p class="row-5 t-right">{{Math.round(item.FINISH_RATE*100)/100}}{{item.FINISH_RATE>0?'%':''}}</p>
                                            <p class="row-7 t-right">{{Math.round(item.POSTPONE_RATE*100)/100}}{{item.POSTPONE_RATE>0?'%':''}}</p>
                                        </div>
                                    </template>
                                </el-scrollbar>
                            </div>
                        </div>
                    </div>
                    <div class="h-right">
                        <div class="bg-style h-bottom-right">
                            <div class="bg-title">
                                <h5>工单申报单位排名</h5>
                                <!-- <ul class="btns">
                                    <li class="active">按年</li>
                                    <li>按月</li>
                                    <li>按日</li>
                                </ul> -->
                            </div>
                            <div class="c-echart">
                                <ECharts class="c-ring" :options="threequarters" ref="echarts4"></ECharts>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import Header from "./header.vue";
    import EchartsJs from "./echarts.js";
    import ECharts from 'vue-echarts/components/ECharts';
    // 按需导入echarts的图形类型
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/pie'
    // 导入工具部分
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title';
    // register component to use
    import 'echarts/lib/component/legendScroll';
    export default {
        components: {
            Header,
            ECharts
        },
        data() {
            return {
                title: '',
                token: "",
                ring: {},
                bar: {},
                circular: {},
                threequarters: {},
                devFaultRank: [],
                devFaultTotal: {},
                devRepTotal: {},
                devFaultAreaObj: {},
                devFaultAreaList: [],
                devRepOppmDept: [],
                devRepDevType: [],
                todoList: [],
                onlineCount: {},
                userInfo: {},
                isHeadVisible: false,
                isHeadMenuVisible: true
            };
        },
        methods: {
            getFaultOppmType() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectByOppmType`, {}, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let lgData = [];
                            let ssData = [];
                            let aaData = [];
                            let total = 0;
                            let interval = 0; // 间隔
                            res.resultList.map(item => { total += Math.round(item.TOTAL_SUM) });
                            interval = parseInt(total / 100 * 2);
                            let intervalData = {
                                value: interval,
                                name: '',
                                label: { show: false },
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(0, 0, 0, 0)',
                                    }
                                }
                            };
                            res.resultList.map(item => {
                                lgData.push(item.OPPM_TYPE_NAME);
                                ssData.push({ name: item.OPPM_TYPE_NAME, value: Math.round(item.TOTAL_SUM) });
                                aaData.push({ name: item.OPPM_TYPE_NAME + '(好)', value: Math.round(item.GOOD_SUM) });
                                aaData.push({ name: item.OPPM_TYPE_NAME + '(坏)', value: Math.round(item.FAULT_SUM) });
                            });

                            let ring = EchartsJs.getRing;
                            ring.legend.data = lgData;
                            ring.series[0].data = ssData;
                            ring.series[1].data = aaData;
                            ring.series[1].tooltip = {
                                formatter: function(params) {
                                    var length = res.resultList.length || 0;
                                    var percent = 0;
                                    percent = Math.round((params.value / total) * 10000) / 100;
                                    if (params.name !== '') {
                                        return params.name + ': ' + params.value + ' (' + percent + '%)';
                                    } else {
                                        return '';
                                    }
                                },
                            }
                            this.ring = ring;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
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
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultRanking`, {}, { token: this.token })
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
            getRepTotal() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairCollectTotal`, {}, { token: this.token })
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
            getFaultDevArea() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceFaultCollectByDevArea`, {}, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = res.resultList || [];
                            this.devFaultAreaList = [];
                            this.devFaultAreaObj = { maxNum: 0 };
                            arr.map(item => {
                                if (item.TOTAL_SUM > this.devFaultAreaObj.maxNum) {
                                    this.devFaultAreaObj.maxNum = item.TOTAL_SUM;
                                }
                                if (this.$config.cityName == 'hangzhou') {
                                    switch (item.DEV_AREA_NAME) {
                                        case '上城区':
                                        case '拱墅区':
                                        case '滨江区':
                                        case '江干区':
                                        case '西湖区':
                                        case '下城区':
                                            this.devFaultAreaObj[item.DEV_AREA_NAME] = item.TOTAL_SUM;
                                            break;
                                        default:
                                            this.devFaultAreaList.push(item);
                                            break;
                                    }
                                }
                                if (this.$config.cityName == 'nanchang') {
                                    switch (item.DEV_AREA_NAME) {
                                        case '西湖区':
                                        case '红谷滩区':
                                        case '青山湖区':
                                        case '东湖区':
                                        case '青云谱区':
                                            this.devFaultAreaObj[item.DEV_AREA_NAME] = item.TOTAL_SUM;
                                            break;
                                        default:
                                            this.devFaultAreaList.push(item);
                                            break;
                                    }
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
            getRepDevType() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairCollectByDevType`, {}, { token: this.token })
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
            getRepOppmDept() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairCollectByOppmDept`, {}, { token: this.token })
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
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairStatusCollect`, {}, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = [];
                            let obj = res.resultList || {};
                            if (obj.APPLY_SUM > 0) {
                                arr.push({ name: '已申报', value: parseInt(obj.APPLY_SUM) });
                            }
                            if (obj.SEND_SUM > 0) {
                                arr.push({ name: '已下发', value: parseInt(obj.SEND_SUM) });
                            }
                            if (obj.ACCEPT_SUM > 0) {
                                arr.push({ name: '已接受', value: parseInt(obj.ACCEPT_SUM) });
                            }
                            if (obj.TIMEOUT_SUM > 0) {
                                arr.push({ name: '已超时', value: parseInt(obj.TIMEOUT_SUM) });
                            }
                            if (obj.REPAIR_SUM > 0) {
                                arr.push({ name: '已维修', value: parseInt(obj.REPAIR_SUM) });
                            }
                            if (obj.SURE_SUM > 0) {
                                arr.push({ name: '已确定', value: parseInt(obj.SURE_SUM) });
                            }
                            if (obj.EVALUATE_SUM > 0) {
                                arr.push({ name: '已评价', value: parseInt(obj.EVALUATE_SUM) });
                            }

                            let circular = EchartsJs.getCircular;
                            circular.series[0].data = arr;
                            // circular.series[0].minAngle = 30; //最小的扇区角度
                            this.circular = circular;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            getRepDept() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/deviceRepairCollectByDept`, {}, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = res.resultList || [];
                            let optionData = this.getTqData(arr);
                            let threequarters = EchartsJs.getThreequarters;
                            threequarters.legend.data = optionData.legendDate;
                            threequarters.series = optionData.series;
                            this.threequarters = threequarters;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 处理3/4圆环数据
            getTqData(data) {
                let res = {
                    legendDate: [],
                    series: []
                };
                let total = 0; // total是3/4圈的总量，可能会超出
                // data.map(item => {
                //     total += parseInt(item.value);
                // });
                // total *= 1.25; // 将total放大到一圈
                for (let i = 0; i < data.length; i++) {
                    total = parseInt(data[i].TOTAL_SUM);
                    total *= 1.333; // 将total放大到一圈
                    res.legendDate.push(`${data[i].REP_DEPT_NAME} ${data[i].TOTAL_SUM}`);
                    // console.log([70 - i * 12 + '%', 67 - i * 12 + '%']);
                    res.series.push({
                        name: '',
                        type: 'pie',
                        clockWise: false, //顺时加载
                        hoverAnimation: false, //鼠标移入变大
                        radius: [73 - i * 12 + '%', 68 - i * 12 + '%'],
                        center: ["36%", "50%"],
                        label: {
                            show: false
                        },
                        data: [{
                            value: data[i].FAULT_SUM,
                            name: `${data[i].REP_DEPT_NAME} ${data[i].TOTAL_SUM}`,
                        }, {
                            value: total - data[i].FAULT_SUM,
                            name: '',
                            itemStyle: {
                                color: "rgba(0,0,0,0)",
                                borderWidth: 0
                            },
                            tooltip: {
                                show: false
                            },
                            color: 'rgba(0, 0, 0, 0)',
                            borderColor: 'rgba(0, 0, 0, 0)',
                            borderWidth: 0,
                            hoverAnimation: false
                        }]
                    });
                    res.series.push({
                        name: '',
                        type: 'pie',
                        silent: true,
                        z: 1,
                        clockWise: false, //顺时加载
                        hoverAnimation: false, //鼠标移入变大
                        radius: [73 - i * 12 + '%', 68 - i * 12 + '%'],
                        center: ["36%", "50%"],
                        label: {
                            show: false
                        },
                        data: [{
                            value: 7.5,
                            itemStyle: {
                                color: "#0b3371",
                            },
                            tooltip: {
                                show: false
                            },
                            hoverAnimation: false,
                        }, {
                            value: 2.5,
                            name: '',
                            itemStyle: {
                                color: "rgba(0,0,0,0)",
                                borderWidth: 0
                            },
                            tooltip: {
                                show: false
                            },
                            hoverAnimation: false
                        }]
                    });
                }
                return res;
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
            initGet() {
                this.getFaultOppmType();
                this.getFaultDevType();
                this.getFaultRanking();
                this.getFaultTotal();
                this.getRepTotal();
                this.getFaultDevArea();
                this.getRepDevType();
                this.getRepOppmDept();
                this.getOnline();
                this.getNotice();
                this.getRepStatus();
                this.getRepDept();
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

            if (this.isHeadMenuVisible) {
                this.tipsPush('EFOMS_OPERATION');
                this.tipsPush('efoms_heartbeat');
            }

            this.initGet();
            // 一定时间后刷新页面数据
            setInterval(() => {
                this.initGet();
            }, 1 * 60 * 1000);

            // 监听窗口的变化，实时调用 echarts的 resize事件
            window.onresize = () => {
                this.$refs.echarts1.resize();
                this.$refs.echarts2.resize();
                this.$refs.echarts3.resize();
                this.$refs.echarts4.resize();
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "./home.less";
</style>