<template>
    <div class="ej-main">
        <div class="layout">
            <div class="top-title Driver">
                <p>智能运维平台</p>
            </div>
            <div style="height: 60px"></div>
            <!-- <Header v-show="isHeadVisible"></Header>
            <div v-show="!isHeadVisible" style="height: 60px"></div> -->
            <div class="h-content h-currency" style="padding-top:25px;">
                <div class="h-top">
                    <div class="h-left">
                        <div class="bg-style h-top-left">
                            <div class="bg-title">
                                <h5>设备总览</h5>
                                <div class="tl-box">
                                    时间选择：
                                    <el-select v-model="period" class="tl-select" popper-class="perdClass">
                                        <el-option v-for="item in periodList" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="htl-cent">
                                <div class="chart">
                                    <div class="speed">
                                        <i :style="'transform:rotate('+(goodRateAll.GOOD_RATE*180/100-135)+'deg)'"></i>
                                        <span><b>完好率</b><br />{{goodRateAll.GOOD_RATE|twoDecimal}}%</span>
                                    </div>
                                    <ul class="ct-ul">
                                        <li>
                                            <span class="name">区域</span>
                                            <el-progress class="porss" :percentage="Math.round((goodRateAll.GOOD_RATE_AREA||0)*100)/100" color="#0ED8A0" :stroke-width="3"></el-progress>
                                        </li>
                                        <li>
                                            <span class="name">项目类型</span>
                                            <el-progress class="porss" :percentage="Math.round((goodRateAll.GOOD_RATE_OPPM||0)*100)/100" color="#0ED8A0" :stroke-width="3"></el-progress>
                                        </li>
                                        <li>
                                            <span class="name">设备类型</span>
                                            <el-progress class="porss" :percentage="Math.round((goodRateAll.GOOD_RATE_TYPE||0)*100)/100" color="#0ED8A0" :stroke-width="3"></el-progress>
                                        </li>
                                    </ul>
                                </div>
                                <ul class="htl-cent-ul1">
                                    <li class="sbs">
                                        <p>{{devFaultTotal.TOTAL_SUM}}</p><span>设备数</span>
                                    </li>
                                    <li class="gzs">
                                        <p>{{devFaultTotal.FAULT_SUM}}</p><span>故障数</span>
                                    </li>
                                    <li class="whl">
                                        <p>{{devFaultTotal.GOOD_RATE|twoDecimal}}%</p><span>完好率</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- <div class="c-echart">
                                <ECharts class="c-bar" :options="bar" ref="echarts2"></ECharts>
                            </div> -->
                        </div>
                        <div class="bg-style h-top-left">
                            <div class="bg-title">
                                <h5>资产项目类型分布</h5>
                            </div>

                            <div class="htl-cent" style="position:relative;">
                                <div class="chart">
                                    <div class="c-echart">
                                        <ECharts class="c-ring" :options="ring" ref="echarts1" @click="ringSolidClick" @mouseout="ringSolidMouseout" @mouseover="ringSolidMouseover"></ECharts>
                                    </div>
                                    <div id='oppmTu' v-popover:bbq style="width:0;height:0;position:absolute;top:0;right:0;"></div>
                                    <el-popover ref="bbq" popper-class="pop-table" placement="right-start" width="710" trigger="click" @show="getDevDteail('oppm',{})">
                                        <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                    </el-popover>
                                </div>
                                <ul class="htl-cent-ul2">
                                    <li>
                                        <div>
                                            <p class="p1">{{goodRateOppmTypeSingle.TOTAL_SUM}}</p>
                                            <p class="p2">
                                                {{goodRateOppmTypeSingle.OPPM_TYPE_NAME?goodRateOppmTypeSingle.OPPM_TYPE_NAME.slice(0,2):''}}项目设备数</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <p class="p1">{{goodRateOppmTypeSingle.FAULT_SUM}}
                                                <!-- <b>&#8593;</b> -->
                                            </p>
                                            <p class="p2">
                                                {{goodRateOppmTypeSingle.OPPM_TYPE_NAME?goodRateOppmTypeSingle.OPPM_TYPE_NAME.slice(0,2):''}}项目故障数</p>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <p class="p1">{{goodRateOppmTypeSingle.GOOD_RATE|twoDecimal}}%
                                                <!-- <b>&#8595;</b> -->
                                            </p>
                                            <p class="p2">
                                                {{goodRateOppmTypeSingle.OPPM_TYPE_NAME?goodRateOppmTypeSingle.OPPM_TYPE_NAME.slice(0,2):''}}项目完好率</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="h-middle">
                        <div class="bg-style h-top-middle-2">
                            <div class="m-map m-hz" v-if="$config.cityName=='hangzhou'">
                                <div class="box-map"></div>
                                <ul class="m-area">
                                    <li v-popover:aba :class="getColor(getAreaGoodRate('西湖区'))">
                                        <el-popover ref="aba" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['西湖区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('西湖区')+'px'}"></div>
                                        <p>西湖区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('西湖区')+'px)'}">{{getAreaGoodRate('西湖区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abb :class="getColor(getAreaGoodRate('拱墅区'))">
                                        <el-popover ref="abb" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['拱墅区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('拱墅区')+'px'}"></div>
                                        <p>拱墅区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('拱墅区')+'px)'}">{{getAreaGoodRate('拱墅区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abc :class="getColor(getAreaGoodRate('下城区'))">
                                        <el-popover ref="abc" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['下城区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('下城区')+'px'}"></div>
                                        <p>下城区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('下城区')+'px)'}">{{getAreaGoodRate('下城区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abd :class="getColor(getAreaGoodRate('上城区'))">
                                        <el-popover ref="abd" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['上城区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('上城区')+'px'}"></div>
                                        <p>上城区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('上城区')+'px)'}">{{getAreaGoodRate('上城区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abe :class="getColor(getAreaGoodRate('江干区'))">
                                        <el-popover ref="abe" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['江干区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('江干区')+'px'}"></div>
                                        <p>江干区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('江干区')+'px)'}">{{getAreaGoodRate('江干区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abf :class="getColor(getAreaGoodRate('滨江区'))">
                                        <el-popover ref="abf" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['滨江区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('滨江区')+'px'}"></div>
                                        <p>滨江区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('滨江区')+'px)'}">{{getAreaGoodRate('滨江区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abg :class="getColor(getAreaGoodRate('景区'))">
                                        <el-popover ref="abg" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['景区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('景区')+'px'}"></div>
                                        <p>景区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('景区')+'px)'}">{{getAreaGoodRate('景区')|twoDecimal}}%</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="m-map m-nc" v-if="$config.cityName=='nanchang'">
                                <div class="box-map"></div>
                                <ul class="m-area">
                                    <li v-popover:abca>
                                        <el-popover ref="abca" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['西湖区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('西湖区')+'px'}"></div>
                                        <p>西湖区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('西湖区')+'px)'}">{{getAreaGoodRate('西湖区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abcb>
                                        <el-popover ref="abcb" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['红谷滩区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('红谷滩区')+'px'}"></div>
                                        <p>红谷滩区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('红谷滩区')+'px)'}">{{getAreaGoodRate('红谷滩区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abcc>
                                        <el-popover ref="abcc" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['青山湖区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('青山湖区')+'px'}"></div>
                                        <p>青山湖区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('青山湖区')+'px)'}">{{getAreaGoodRate('青山湖区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abcd>
                                        <el-popover ref="abcd" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['东湖区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('东湖区')+'px'}"></div>
                                        <p>东湖区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('东湖区')+'px)'}">{{getAreaGoodRate('东湖区')|twoDecimal}}%</span>
                                    </li>
                                    <li v-popover:abce>
                                        <el-popover ref="abce" popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('area',devFaultAreaObj['青云谱区'])">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                        </el-popover>
                                        <div :style="{'height': 1*getAreaGoodRate('青云谱区')+'px'}"></div>
                                        <p>青云谱区</p>
                                        <span class="span" :style="{'transform':'translate(-50%,-'+getAreaGoodRate('青云谱区')+'px)'}">{{getAreaGoodRate('青云谱区')|twoDecimal}}%</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- <table class="m-table">
                                <tr v-for="item in devFaultAreaList" :key="item.DEV_AREA_NAME">
                                    <td>{{item.DEV_AREA_NAME}}</td>
                                    <td>{{item.GOOD_RATE|twoDecimal}}%</td>
                                </tr>
                            </table> -->
                            <img style="display:block;position: absolute;bottom: 14px;right: 14px;width:137px;" src="../../assets/images/home/icon-map-legend.png" alt="">
                        </div>

                        <div class="bg-style h-top-middle-3">
                            <!-- <div class="ct-title">
                                <h5>运维效能分布</h5>
                            </div> -->
                            <div class="bg-title">
                                <h5>设备类型完好率</h5>
                            </div>
                            <ul class="h-top-middle-ul">
                                <template v-for="(item,index) in devRepDevType">
                                    <li v-if="index<10" :key="item.DEV_TYPE_NAME">
                                        <el-popover popper-class="pop-table" placement="right" width="710" trigger="click" @show="getDevDteail('devtype',item)">
                                            <Popover :popoverData="popoverDatas" :popoverList="popoverLists" @fatherMethod="getDevDetailPage"></Popover>
                                            <div slot="reference" style="cursor: pointer;">
                                                <div class="speed" :alt="Math.round(item.GOOD_RATE*100)/100+'%'"><i :style="'transform:rotate('+(item.GOOD_RATE*180/100-135)+'deg)'"></i><span>{{item.TOTAL_SUM}}</span></div>
                                                <p>{{item.DEV_TYPE_NAME}}</p>
                                            </div>
                                        </el-popover>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
                    <div class="h-right">
                        <div class="h-top-right">
                            <div class="bg-style h-top-right-1">
                                <ul class="m-ul">
                                    <li class="gds">
                                        <p>{{devRepTotal.TOTAL_SUM}}</p><span>工单数</span>
                                    </li>
                                    <li class="whz">
                                        <p>{{devRepTotal.FAULT_SUM}}</p><span>维护中</span>
                                    </li>
                                    <li class="whl">
                                        <p>{{devRepTotal.GOOD_RATE|twoDecimal}}%</p><span>修复率</span>
                                    </li>
                                </ul>
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
                                            <p class="row-1"><i>{{index+1}}</i></p>
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
                                <!-- <ECharts class="c-ring" :options="circular" ref="echarts3"></ECharts> -->
                                <Pie ref="pie3d" id="test" :option="option"></Pie>
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
                            <div class="bg-style h-bottom-middle-2">
                                <!-- <div class="ct-title">
                                    <h5>维护单位运营能力</h5>
                                </div> -->
                                <div class="bg-title">
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
                                            <p class="row-5 t-right">{{item.ONTIME_RATE|twoDecimal}}{{item.ONTIME_RATE>0?'%':''}}</p>
                                            <p class="row-5 t-right">{{item.FINISH_RATE|twoDecimal}}{{item.FINISH_RATE>0?'%':''}}</p>
                                            <p class="row-7 t-right">{{item.POSTPONE_RATE|twoDecimal}}{{item.POSTPONE_RATE>0?'%':''}}</p>
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
                            </div>
                            <div class="h-bottom-right-table h-bottom-right-table-title">
                                <p class="row-1"></p>
                                <p class="row-2">单位名称</p>
                                <!-- <p class="row-3">当前周期申报数量</p>
                                <p class="row-4">对比上一周期数量</p>
                                <p class="row-5">环比(百分比)</p> -->
                                <p class="row-3">申报数量</p>
                                <p class="row-4">申报占比</p>
                                <p class="row-5">修复率</p>
                            </div>
                            <el-scrollbar class="h-bottom-right-scroll">
                                <template v-for="(item,index) in devRepDept">
                                    <div class="h-bottom-right-table h-bottom-right-table-content" :key="index">
                                        <p class="row-1"><i>{{index+1}}</i></p>
                                        <p class="row-2" :title="item.REP_DEPT_NAME">{{item.REP_DEPT_NAME}}</p>
                                        <p class="row-3">{{item.TOTAL_SUM}}</p>
                                        <p class="row-4">{{item.TOTAL_RATE|twoDecimal}}%</p>
                                        <p class="row-5">{{item.GOOD_RATE|twoDecimal}}%
                                            <!-- <b class="red">&#8593;</b><b class="green">&#8595;</b> -->
                                        </p>
                                    </div>
                                </template>
                            </el-scrollbar>
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

    import Pie from './pie.vue';
    import Popover from './popover.vue';
    export default {
        components: {
            Header,
            ECharts,
            Pie,
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
                devFaultTotal: {},
                devRepTotal: {},
                devFaultAreaObj: {},
                devFaultAreaList: [],
                devRepOppmDept: [],
                devRepDevType: [],
                devRepDept: [],
                todoList: [],
                onlineCount: {},
                userInfo: {},
                isHeadVisible: false,
                isHeadMenuVisible: true,
                dataIndex: 0, //项目类型高亮扇区的索引
                goodRateAll: {},
                goodRateOppmTypeList: [],
                goodRateOppmTypeSingle: {},
                option: EchartsJs.get3dPie,
                popoverDatas: {},
                popoverLists: {},
                popQuery: {}, //浮窗的请求参数
            };
        },
        watch: {
            period(val) {
                this.initGet();
            }
        },
        methods: {
            getAreaPer(name) {
                return (this.devFaultAreaObj[name] ? this.devFaultAreaObj[name].GOOD_RATE : 0) / (this.devFaultAreaObj.maxNum || 1);
            },
            getAreaGoodRate(name) {
                return (this.devFaultAreaObj[name] ? this.devFaultAreaObj[name].GOOD_RATE : 0);
            },
            // 根据完好率的值给颜色
            getColor(num) {
                num = parseFloat(num);
                let arr = [90, 80, 70, 60]; //颜色层次
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
                if (num == 0) txt = '';
                return txt;
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
            getFaultOppmType() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/devGoodRateByOppmType`, { timeType: this.period, startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let lgData = [];
                            let ssData = [];
                            this.goodRateOppmTypeList = res.resultList || [];
                            res.resultList.map((item, index) => {
                                lgData.push(item.OPPM_TYPE_NAME);
                                ssData.push({ name: item.OPPM_TYPE_NAME, value: Math.round(item.TOTAL_SUM), selected: index == this.dataIndex });
                            });

                            let ring = EchartsJs.getRingSolid;
                            ring.legend.data = lgData;
                            ring.series[1].data = ssData;
                            this.ring = ring;
                            // 默认选中第一个
                            setTimeout(() => {
                                this.$nextTick(() => {
                                    this.$refs.echarts1.dispatchAction({
                                        type: 'highlight',
                                        seriesIndex: 1,
                                        dataIndex: this.dataIndex
                                    });
                                    this.goodRateOppmTypeSingle = this.goodRateOppmTypeList[this.dataIndex];
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
            getFaultDevArea() {
                this.$api.get(`${this.$config.efoms_HOST}/homeDevice/devGoodRateByDevArea`, { timeType: this.period, startTime: this.getWhatTime(this.period).start, endTime: this.getWhatTime(this.period).end }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let arr = res.resultList || [];
                            this.devFaultAreaList = [];
                            this.devFaultAreaObj = { maxNum: 0 };
                            arr.map(item => {
                                if (item.GOOD_RATE > this.devFaultAreaObj.maxNum) {
                                    this.devFaultAreaObj.maxNum = item.GOOD_RATE || 0;
                                }
                                if (this.$config.cityName == 'hangzhou') {
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
                                            // this.devFaultAreaObj[item.DEV_AREA_NAME] = item.GOOD_RATE || 0;
                                            // this.devFaultAreaObj[item.DEV_AREA_NAME + 'Code'] = item.DEV_AREA_CODE;
                                            this.devFaultAreaList.push(item);
                                            break;
                                        default:
                                            // this.devFaultAreaList.push(item);
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
                                            this.devFaultAreaObj[item.DEV_AREA_NAME] = item;
                                            // this.devFaultAreaObj[item.DEV_AREA_NAME] = item.GOOD_RATE || 0;
                                            // this.devFaultAreaObj[item.DEV_AREA_NAME + 'Code'] = item.DEV_AREA_CODE;
                                            this.devFaultAreaList.push(item);
                                            break;
                                        default:
                                            // this.devFaultAreaList.push(item);
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
                this.getGoodRateAll();
                this.getFaultOppmType();
                // this.getFaultDevType();
                this.getFaultRanking();
                this.getFaultTotal();
                this.getRepTotal();
                this.getFaultDevArea();
                this.getRepDevType();
                this.getRepOppmDept();
                // this.getOnline();
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
            }

            this.initGet();
            // 一定时间后刷新页面数据
            // setInterval(() => {
            //     this.initGet();
            // }, 1 * 60 * 1000);

            // 监听窗口的变化，实时调用 echarts的 resize事件
            window.onresize = () => {
                this.$refs.echarts1.resize();
                // this.$refs.echarts2.resize();
                // this.$refs.echarts3.resize();
                // this.$refs.echarts4.resize();
                this.$refs.echarts1.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 1,
                    dataIndex: this.dataIndex
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "./home.less";

    .top-title.Driver {
        background: url(../../assets/images/home/title-flow.png) no-repeat center;
        width: 100%;
        height: 65px;
        position: absolute;

        p {
            line-height: 60px;
            font-family: HYGangYiTi-GEW;
            font-size: 30px;
            color: #FFFFFF;
            letter-spacing: 1px;
            text-align: center;
            text-shadow: 0 6px 8px rgba(25, 37, 78, 0.84);
        }

        &::before {
            content: '';
            position: absolute;
            left: 0px;
            width: 529px;
            height: 22px;
            top: 19px;
            background: url(../../assets/images/home/title-flowl.png) repeat-x;
        }

        &::after {
            content: '';
            position: absolute;
            right: 0px;
            width: 529px;
            height: 22px;
            top: 19px;
            background: url(../../assets/images/home/title-flowl.png) repeat-x;
        }
    }

    .h-top-middle-ul {
        overflow: hidden;
    }
</style>
<style>
    /* 下拉框弹出样式 */
    .perdClass.el-popper[x-placement^=bottom] {
        margin-top: 4px;
    }

    .perdClass.el-popper[x-placement^=bottom] .popper__arrow {
        display: none;
    }

    .perdClass.el-select-dropdown {
        background: #174283;
        border: 1px solid #325EA1;
        border-radius: 0;
    }

    .perdClass .el-select-dropdown__list {
        padding: 0;
    }

    .perdClass .el-select-dropdown__item {
        font-size: 12px;
        padding: 0;
        width: 58px;
        text-align: center;
        height: 18px;
        line-height: 18px;
        color: #d6d4d4;
        font-weight: 100;
    }

    .perdClass .el-select-dropdown__item.selected {
        color: #ffffff;
        font-weight: 700;
    }

    .perdClass .el-select-dropdown__item.hover {
        background: #3E88E6;
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