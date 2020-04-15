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
                                    <label>设施类别</label>
                                    <mInput :list="systemList" :code.sync="systemCode" :name.sync="systemName" @keyup.enter.native="searchTableInfo"></mInput>
                                </el-col>
                                <el-col :span="7">
                                    <label>维修类型</label>
                                    <mInput :list="reptypeList" :code.sync="reptypeCode" :name.sync="reptypeName" @keyup.enter.native="searchTableInfo"></mInput>
                                </el-col>
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
                            <h3>期限时间列表</h3>
                            <div class="operation export" @click="openDetail({})">
                                <p>添加</p>
                            </div>
                        </div>
                        <div class="content">
                            <el-table :highlight-current-row="false" :data="tableData" border class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                                <el-table-column type="index" label="编号"></el-table-column>
                                <el-table-column prop="devTypeName" label="设施类别" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column>
                                <el-table-column label="默认期限完成时间" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{scope.row.deadlineTime?`${scope.row.deadlineTime}小时`:''}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="createPersonName" label="创建人" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="updateDate" label="更新时间" show-overflow-tooltip min-width="120">
                                    <template slot-scope="scope">
                                        {{scope.row.updateDate||scope.row.createDate}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <div class="tab-operation" @click="openDetail(scope.row)">修改</div>
                                        <div class="tab-operation" @click="deleteItem(scope.row)">删除</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <EJ-Paging ref="tableList" id="asRoom" :totalCount="totalCount" :queryConditions="queryConditions" @pageAsk="searchPageInfo"></EJ-Paging>
                        </div>
                        <el-dialog title="添加/修改" :visible.sync="detailVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                            <div class="dialog-main">
                                <div class="revoke-reason">
                                    <label class="dialog-label"><span>*</span>设施类别</label>
                                    <mInput :list="systemList" :code.sync="detailInfo.devTypeCode" :name.sync="devTypeName" class="dialog-select"></mInput>
                                </div>
                                <div class="revoke-reason">
                                    <label class="dialog-label"><span>*</span>维修类型</label>
                                    <mInput :list="reptypeList" :code.sync="detailInfo.typeCode" :name.sync="typeName" class="dialog-select"></mInput>
                                </div>
                                <div class="revoke-reason">
                                    <label class="dialog-label" style="width:96px;"><span>*</span>默认期限完成时间</label>
                                    <el-input v-model="detailInfo.deadlineTime" placeholder="请输入" size='mini' class="dialog-select" clearable style="width:200px;"></el-input>
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
    import mInput from "components/common/selectDrop";
    export default {
        components: {
            "EJ-Paging": Paging,
            mInput
        },
        data() {
            return {
                token: '',
                systemCode: '',
                systemName: '',
                systemList: [],
                reptypeCode: '',
                reptypeName: '',
                reptypeList: [],
                tableData: [],
                totalCount: 0,
                queryConditions: {},
                detailVisible: false,
                devTypeName: '',
                typeName: '',
                detailInfo: {},
                isTableLoading: false,
                isAjaxing: false,
            };
        },
        watch: {
            'queryConditions.currentPage'(val) {
                this.$refs.tableList.zjCurrentPage = val;
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.searchTableInfo();

            //设施类别
            this.systemList = [{ dicCode: '1', dicName: '电子设施' }, { dicCode: '2', dicName: '非电子设施' }];
            //维修类型
            this.reptypeList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' }, { dicCode: 'REPAIRTYPE03', dicName: '优化' }];
        },
        methods: {
            searchTableInfo() {
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = { pageSize: pageSize, currentPage: 1 };
                let obj = {
                    devTypeCode: this.systemCode,
                    typeCode: this.reptypeCode,
                    isUse: '1'
                };
                this.queryConditions = { ...this.queryConditions, ...obj }
                this.searchPageInfo();
            },
            searchPageInfo() {
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/workorderDeadline/selectDeadlineConfPageSign`, this.queryConditions, { token: this.token })
                    .then(res => {
                        setTimeout(load => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.result || [];
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
            openDetail(item) {
                this.detailVisible = true;
                this.$nextTick(() => {
                    this.detailInfo = JSON.parse(JSON.stringify(item));
                });
            },
            deleteItem(item) {
                this.$confirm('确认删除该条时间配置吗？', '操作提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$api.delete(`${this.$config.efoms_HOST}/workorderDeadline/deleteDeadlineConfById`, { deadlineConfId: item.deadlineConfId }, { token: this.token })
                        .then(res => {
                            if (res.appCode == 0) {
                                Common.ejMessage("success");
                                this.searchPageInfo();
                            } else {
                                Common.printErrorLog(res);
                            }
                        })
                        .catch(err => {
                            Common.printErrorLog(err);
                        });
                });
            },
            saveItem() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (!this.detailInfo.devTypeCode || this.detailInfo.devTypeCode == '') {
                    Common.ejMessage("warning", "设施类别必填");
                    return;
                }
                if (!this.detailInfo.typeCode || this.detailInfo.typeCode == '') {
                    Common.ejMessage("warning", "维修类型必填");
                    return;
                }
                if (!this.detailInfo.deadlineTime || this.detailInfo.deadlineTime == '') {
                    Common.ejMessage("warning", "默认期限完成时间必填");
                    return;
                }
                if (!(/^\d+(\.\d{1})?$/.test(this.detailInfo.deadlineTime))) {
                    Common.ejMessage("warning", "默认期限完成时间最多一位小数");
                    return;
                }
                this.detailInfo.devTypeName = this.devTypeName;
                this.detailInfo.typeName = this.typeName;

                this.isAjaxing = true;
                let ajxQA;
                if (this.detailInfo.deadlineConfId) {
                    ajxQA = this.$api.put(`${this.$config.efoms_HOST}/workorderDeadline/updateDeadlineConf`, { ...this.detailInfo, ...{ workType: '2' } }, { token: this.token, "Content-Type": "application/json;charset=UTF-8" });
                } else {
                    ajxQA = this.$api.post(`${this.$config.efoms_HOST}/workorderDeadline/insertDeadlineConfSign`, this.detailInfo, { token: this.token });
                }
                ajxQA.then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.detailVisible = false;
                            this.searchTableInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: this.token, data: JSON.stringify(obj) }, {}
                );
            },
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