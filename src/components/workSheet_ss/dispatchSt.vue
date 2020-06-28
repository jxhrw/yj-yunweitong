<template>
    <div class="ej-main">
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>派单统计</h2>
            </div>
            <div class="ej-content-main">
                <div>
                    <div class="base-info">
                        <div class="content">
                            <el-row class="content-row-select">
                                <el-col :span="7">
                                    <label>申报时间</label>
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
                            <h3>维护单位派单统计</h3>
                        </div>
                        <div class="content">
                            <el-table :highlight-current-row="false" :data="tableData" border class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                                <el-table-column prop="NAME" label="属性" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="SH_SUM" label="审核通过" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="WX_SUM" label="施工中" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="JL_SUM" label="监理验收" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="ZD_SUM" label="中队民警验收" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="DD_SUM" label="大队民警验收" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="YS_SUM" label="验收完成" show-overflow-tooltip></el-table-column>
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
                this.$api.get(`${this.$config.efoms_HOST}/SignsWorkordersReport/statSignsWorkProcessCollect`, this.queryConditions, { token: this.token })
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