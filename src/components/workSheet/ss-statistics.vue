<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="'工单统计'" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
            <template slot="condFirst">
                <el-col :span="7">
                    <label>所属区域</label>
                    <mSelectMult :list="regionList" :code.sync="regionCode" :name.sync="regionName" showAttr="regionName" getAttr="regionId" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>所属部门</label>
                    <mSelectMult :list="departList" :code.sync="departCode" :name.sync="departName" showAttr="deptName" getAttr="deptId" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>所属系统</label>
                    <mSelectMult :list="systemList" :code.sync="systemCode" :name.sync="systemName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
            </template>

            <template slot="condSecond">
                <el-col :span="7">
                    <label>来源</label>
                    <mSelectMult :list="sourceList" :code.sync="sourceCode" :name.sync="sourceName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>当前状态</label>
                    <mSelectMult :list="stateList" :code.sync="stateCode" :name.sync="stateName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>时间类型</label>
                    <mInput :list="timeTypeList" :code.sync="timeTypeCode" :name.sync="timeTypeName" :clearable="false" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7">
                    <label>时间范围</label>
                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
            </template>

            <template slot="tableBtn">
                <div class="operation export" @click="exportExcel">
                    <p>导出</p>
                </div>
            </template>

            <template slot="table">
                <el-table :highlight-current-row="false" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="REP_DEPT_NAME" label="所属部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="GDZC" label="工单总数" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="YWC" label="已完成" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="WWC" label="未完成" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="XFL" label="修复率" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{(scope.row.XFL&&scope.row.XFL>0)?`${scope.row.XFL}%`:scope.row.XFL}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="JSXFL" label="及时修复率" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{(scope.row.JSXFL&&scope.row.JSXFL>0)?`${scope.row.JSXFL}%`:scope.row.JSXFL}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="CSGD" label="超时工单" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="GBGD" label="关闭工单" show-overflow-tooltip> </el-table-column>
                </el-table>
            </template>
        </WkLayout>
    </div>
</template>
<script>
    import WkLayout from "components/common/wklayout";
    import mInput from "components/common/selectDrop";
    import Common from "@/assets/js/common.js";
    import mSelectMult from "@/components/common/selectMult";
    export default {
        components: {
            WkLayout,
            mInput,
            mSelectMult
        },
        filters: {
            dateTime(val) {
                if (parseInt(val) == val) {
                    return Common.dateFormat('yyyy-MM-dd hh:ss:mm', new Date(parseInt(val)))
                } else {

                }
            }
        },
        data() {
            return {
                title: '',
                token: "",
                key: "",
                times: "",
                regionCode: [],
                regionName: [],
                regionList: [],
                departCode: [],
                departName: [],
                departList: [],
                systemCode: [],
                systemName: [],
                systemList: [],
                sourceCode: [],
                sourceName: [],
                sourceList: [],
                stateCode: [],
                stateName: [],
                stateList: [],
                timeTypeCode: '',
                timeTypeName: '',
                timeTypeList: [],
                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
            };
        },
        methods: {
            searchTableInfo() {
                // console.log("table");
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = {
                    pageSize: pageSize,
                    currentPage: 1,
                    areaCode: this.regionCode.join(","),
                    deptId: this.departCode.join(","),
                    devTypeCode: this.systemCode.join(","),
                    sourceCode: this.sourceCode.join(","),
                    statusCode: this.stateCode.join(","),
                    dataType: this.timeTypeCode,
                    beginTime: this.times ? `${this.times[0]} 00:00:00` : '',
                    endTime: this.times ? `${this.times[1]} 23:59:59` : '',
                };
                this.searchPageInfo();
            },
            searchPageInfo() {
                // console.log("page");
                this.tableData = [];
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/workordersRecord/getWorkordersForArea`, this.queryConditions, { token: this.token })
                    .then(res => {
                        setTimeout(load => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.result;
                            this.totalPage = res.resultList.totalPage;
                            this.totalCount = res.resultList.totalCount;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isTableLoading = false;
                        Common.printErrorLog(err);
                    });
            },
            exportExcel() {
                let host = this.$config.efoms_HOST;
                let method = "/export/exportGDTJ";
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api
                    .getMethod(host, method, obj, this.token)
                    .then(res => {
                        window.open(res.path + '&token=' + this.token);
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            currentSelect(e) {},
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: this.token, data: JSON.stringify(obj) }, {}
                );
            },
            // 页面初始化
            initPage() {
                this.searchTableInfo();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            //所属区域
            this.getDicInfo(
                `${this.$config.ubms_HOST}/RegionInfo/getRegionInfo.htm`, {}
            ).then(res => {
                this.regionList = res.resultList || [];
            });
            //部门
            this.getDicInfo(
                `${this.$config.ubms_HOST}/DeptInfo/getDeptInfo.htm`, {}
            ).then(res => {
                this.departList = res.resultList || [];
            });
            //所属系统
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPDEVCATEGORY01"
            }).then(res => {
                this.systemList = res.resultList || [];
            });
            //申报来源
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPAIRSSOURCE"
            }).then(res => {
                this.sourceList = res.resultList || [];
            });
            //当前状态
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "ORDERSSTATUS"
            }).then(res => {
                this.stateList = res.resultList || [];
            });
            //时间类型
            this.timeTypeList = [{ dicCode: 'CREATE', dicName: '创建时间' }, { dicCode: 'FINISH', dicName: '完结时间' }];
            this.timeTypeCode = this.timeTypeList[0].dicCode;
            this.timeTypeName = this.timeTypeList[0].dicName;

            this.initPage();
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/less/baseInfo.less";
    @import "../../assets/less/depiction.less";
    @import "../../assets/less/list.less";
    @import "../../assets/less/dialog.less";

    .base-info {
        border-top: 1px solid #e4eaee;
        border-radius: 2px;
    }

    .depiction-info .content {
        padding-bottom: 20px;
    }

    .relative {
        position: relative;
    }
</style>
<style lang="less">
    @import "../../assets/css/tableHeight.css";
    @import "../../assets/less/tAll.less";

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>