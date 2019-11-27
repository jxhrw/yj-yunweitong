<template>
    <div class="ej-main">
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>期限时间管理</h2>
            </div>
            <div class="ej-content-main">
                <div>
                    <div class="base-info">
                        <div class="content">
                            <el-row class="content-row-select">
                                <el-col :span="7">
                                    <label>所属系统</label>
                                    <el-select v-model="systemSelect" placeholder="请选择" size='mini' class="content-select" clearable>
                                        <el-option v-for="item in systemList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="7">
                                    <label>维修类型</label>
                                    <el-select v-model="tenTypeSelect" placeholder="请选择" size='mini' class="content-select" clearable>
                                        <el-option v-for="item in tenTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="7">&nbsp;</el-col>
                                <el-col :span="3">
                                    <div class="relative">
                                        <div class="content-search" @click="searchTable">
                                            <p>查询</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="depiction-info">
                        <div class="title">
                            <h3>期限时间列表</h3>
                            <div class="operation export" @click="openDetail">
                                <p>添加</p>
                            </div>
                        </div>
                        <div class="content">
                            <el-table :highlight-current-row="false" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                                <el-table-column type="index" label="编号"></el-table-column>
                                <el-table-column prop="aa" label="所属系统" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="ab" label="维修类型" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="ac" label="默认期限完成时间" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="ad" label="更新人" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="ae" label="更新时间" show-overflow-tooltip></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <div class="tab-operation" @click="openDetail(scope.row)">修改</div>
                                        <div class="tab-operation" @click="deleteItem(scope.row)">删除</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <EJ-Paging ref="tableList" id="asRoom" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" @pageAsk="selectRepairsInfoPage"></EJ-Paging>
                        </div>
                        <el-dialog title="添加/修改" :visible.sync="detailVisible" width='400px' class="dialog-urge">
                            <div class="dialog-main">
                                <div class="revoke-reason">
                                    <label class="dialog-label">所属系统</label>
                                    <el-select v-model="detailInfo.aa" placeholder="请选择" size='mini' class="dialog-select" clearable>
                                        <el-option v-for="item in systemList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="revoke-reason">
                                    <label class="dialog-label">维修类型</label>
                                    <el-select v-model="detailInfo.ac" placeholder="请选择" size='mini' class="dialog-select" clearable>
                                        <el-option v-for="item in tenTypeList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="revoke-reason">
                                    <label class="dialog-label" style="width:96px;">默认期限完成时间</label>
                                    <el-input v-model="detailInfo.ad" placeholder="请输入" size='mini' class="dialog-select" clearable style="width:200px;"></el-input>
                                    <span style="font-size:12px;">小时</span>
                                </div>
                            </div>
                            <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="saveItem" size='mini' class="submit">提 交</el-button>
                                <el-button @click="detailVisible = false" size='mini' class="cancel">取 消</el-button>
                            </div>
                        </el-dialog>
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
    export default {
        components: {
            "EJ-Paging": Paging,
        },
        data() {
            return {
                token: '',
                systemSelect: '',
                systemList: [],
                tenTypeSelect: '',
                tenTypeList: [],
                tableData: [],
                totalCount: 0,
                totalPage: 0,
                queryConditions: {},
                detailVisible: false,
                detailInfo: {},
                isTableLoading: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");

            this.tableData = [{
                aa: 'scats信号',
                ab: '维护',
                ac: '24小时',
                ad: '超级管理员',
                ae: '2018-11-19 14:32'
            }, {
                aa: 'scats信号',
                ab: '维护',
                ac: '24小时',
                ad: '超级管理员',
                ae: '2018-11-19 14:32'
            }, {
                aa: 'scats信号',
                ab: '维护',
                ac: '24小时',
                ad: '超级管理员',
                ae: '2018-11-19 14:32'
            }, {
                aa: 'scats信号',
                ab: '维护',
                ac: '24小时',
                ad: '超级管理员',
                ae: '2018-11-19 14:32'
            }, {
                aa: 'scats信号',
                ab: '维护',
                ac: '24小时',
                ad: '超级管理员',
                ae: '2018-11-19 14:32'
            }]
        },
        methods: {
            searchTable() {

            },
            selectRepairsInfoPage() {

            },
            exportExcel() {

            },
            openDetail() {
                this.detailVisible = true;
            },
            deleteItem() {

            },
            saveItem() {

            },
            currentSelect() {

            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../../assets/css/main.css";
    @import '../../../assets/less/baseInfo.less';
    @import '../../../assets/less/depiction.less';
    @import '../../../assets/less/list.less';
    @import '../../../assets/less/dialog.less';

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
    @import "../../../assets/css/tableHeight.css";
    @import "../../../assets/less/tAll.less";

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>