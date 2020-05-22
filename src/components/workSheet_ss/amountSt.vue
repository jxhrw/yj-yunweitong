<template>
    <div class="ej-main">
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>金额统计</h2>
            </div>
            <div class="ej-content-main">
                <div>
                    <div class="base-info">
                        <div class="content">
                            <el-row class="content-row-select">
                                <el-col :span="7">
                                    <label>验收时间</label>
                                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                                    </el-date-picker>
                                </el-col>
                                <el-col :span="7">&nbsp;</el-col>
                                <el-col :span="7">&nbsp;</el-col>
                                <el-col :span="3">
                                    <div class="relative">
                                        <div class="content-search" @click="searchTableInfo">
                                            <p>查询</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="depiction-info">
                        <div class="title">
                            <h3>金额统计</h3>
                        </div>
                        <div class="content">
                            <el-table :highlight-current-row="false" :data="tableData" border class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                                <el-table-column prop="CONTRACT_NAME" label="单位名称" show-overflow-tooltip min-width="120"></el-table-column>
                                <el-table-column prop="ZJE" label="总数" show-overflow-tooltip></el-table-column>
                                <el-table-column label="维修类型">
                                    <el-table-column prop="QX_ZJE" label="抢修" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="WX_ZJE" label="维修" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="YH_ZJE" label="优化" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="SZ_ZJE" label="数字城管" show-overflow-tooltip></el-table-column>
                                </el-table-column>
                                <el-table-column label="设施类型">
                                    <el-table-column prop="DZ_ZJE" label="电子设施" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="BX_ZJE" label="交通标线" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="HL_ZJE" label="交通护栏" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="BZ_ZJE" label="交通标志" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="LS_ZJE" label="临时设施" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="QT_ZJE" label="其他设施" show-overflow-tooltip></el-table-column>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    import Paging from "components/common/paging_new";
    import mInput from "components/common/selectDrop";
    export default {
        components: {
            "EJ-Paging": Paging,
            mInput
        },
        data() {
            return {
                token: '',
                times: '',
                tableData: [],
                queryConditions: {},
                isTableLoading: false,
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.searchTableInfo();
        },
        methods: {
            searchTableInfo() {
                this.queryConditions = {};
                let obj = {
                    startTime: this.times ? `${this.times[0]} 00:00:00` : "",
                    endTime: this.times ? `${this.times[1]} 23:59:59` : "",
                };
                this.queryConditions = { ...this.queryConditions, ...obj }
                this.searchPageInfo();
            },
            searchPageInfo() {
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/SignsWorkordersReport/statSignsWorkCostCollect`, this.queryConditions, { token: this.token })
                    .then(res => {
                        setTimeout(load => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList || [];
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isTableLoading = false;
                        Common.printErrorLog(err);
                    });
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import '../../assets/less/baseInfo.less';
    @import '../../assets/less/depiction.less';
    @import '../../assets/less/list.less';
    @import '../../assets/less/dialog.less';

    .depiction-info .content {
        padding-bottom: 20px;
    }

    .depiction-info .title .operation {
        margin-right: 0;
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