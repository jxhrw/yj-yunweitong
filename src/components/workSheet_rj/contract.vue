<template>
    <div class="ej-main">
        <wkLayout ref="layout" :title="'标段管理'" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="0" @searchTable="searchTableInfo" @searchPage="searchPageInfo">

            <template slot="condFirst">
                <el-col :span="7">
                    <label>所属系统</label>
                    <mInput :list="systemList" :code.sync="systemCode" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7">
                    <label>维护单位</label>
                    <mInput :list="opDeptList" :code.sync="opDeptCode" getAttr="opsDeptId" showAttr="opsDeptName" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7">
                    <label>标段年份</label>
                    <el-date-picker v-model="times" type="year" value-format="yyyy" placeholder="选择年" size='mini' class="content-date content-year" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
            </template>

            <template slot="tableBtn">
                <div class="operation export" @click="conchange({},'add')">
                    <p>添加</p>
                </div>
            </template>

            <template slot="table">
                <el-table :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column prop="contractId" label="编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="systemCodeName" label="所属系统" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="contractDeptName" label="维护单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contractYear" label="标段年份" show-overflow-tooltip></el-table-column>
                    <el-table-column label="标段周期" show-overflow-tooltip min-width="200">
                        <template slot-scope="scope">
                            {{scope.row.contractBeginTime|dateTime}} - {{scope.row.contractEndTime|dateTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" show-overflow-tooltip min-width="120">
                        <template slot-scope="scope">
                            <div class="tab-operation" @click="conchange(scope.row,'edit')">编辑</div>
                            <div class="tab-operation" @click="condelete(scope.row,'edit')">删除</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="添加/修改" :visible.sync="detailVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                    <div class="dialog-main">
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>所属系统</label>
                            <mInput :list="systemList" :code.sync="detailInfo.systemCode" :name.sync="systemCodeName" class="dialog-select"></mInput>
                        </div>
                        <div class="revoke-reason">
                            <label class="dialog-label">标段编号</label>
                            <el-input v-model="detailInfo.contractId" size='mini' class="dialog-select" readonly></el-input>
                        </div>
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>中标单位</label>
                            <mInput :list="opDeptList" :code.sync="detailInfo.contractDept" :name.sync="contractDeptName" getAttr="opsDeptId" showAttr="opsDeptName" class="dialog-select"></mInput>
                        </div>
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>标段年份</label>
                            <el-date-picker v-model="detailInfo.contractYear" type="year" value-format="yyyy" size='mini' class="dialog-select" @keyup.enter.native="searchTableInfo">
                            </el-date-picker>
                        </div>
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>标段周期</label>
                            <el-date-picker v-model="weeks" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" size='mini' class="dialog-select">
                            </el-date-picker>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="saveItem" size='mini' class="submit">提 交</el-button>
                        <el-button @click="detailVisible = false" size='mini' class="cancel">取 消</el-button>
                    </div>
                </el-dialog>
            </template>
        </wkLayout>
    </div>
</template>
<script>
    import wkLayout from "components/common/wklayout";
    import mInput from "components/common/selectDrop";
    import Common from "@/assets/js/common.js";
    import mSelectMult from "@/components/common/selectMult";
    export default {
        components: {
            wkLayout,
            mInput,
            mSelectMult
        },
        filters: {
            dateTime(val) {
                if (val) {
                    return Common.dateFormat('yyyy-MM-dd', new Date((val)))
                } else {
                    return '';
                }
            }
        },
        data() {
            return {
                title: '',
                token: "",
                key: "",
                times: "",
                systemCode: '',
                systemList: [],
                opDeptCode: '',
                opDeptList: [],
                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                detailVisible: false,
                isAjaxing: false,
                detailInfo: {},
                systemCodeName: '',
                contractDeptName: '',
                weeks: '',
            };
        },
        methods: {
            searchTableInfo() {
                // console.log("table");
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = {
                    pageSize: pageSize,
                    currentPage: 1,

                    systemCode: this.systemCode,
                    contractDept: this.opDeptCode,
                    contractYear: this.times,
                };
                this.searchPageInfo();
            },
            searchPageInfo() {
                // console.log("page");
                this.tableData = [];
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/ContractInfo/Other/pageContractOther`, this.queryConditions, { token: this.token })
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
                let method = "/export/exportGDCX";
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
            conchange(item, type) {
                this.detailVisible = true;
                this.$nextTick(() => {
                    this.detailInfo = JSON.parse(JSON.stringify(item));
                    this.contractTypeName = item.contractTypeName || '';
                    this.contractDeptName = item.contractDeptName || '';
                    if (item.contractBeginTime && item.contractEndTime) {
                        this.weeks = [item.contractBeginTime, item.contractEndTime];
                    } else {
                        this.weeks = '';
                    }
                });
            },
            saveItem() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (!this.detailInfo.systemCode) {
                    Common.ejMessage("warning", "所属系统必填");
                    return;
                }
                if (!this.detailInfo.contractDept) {
                    Common.ejMessage("warning", "中标单位必填");
                    return;
                }
                if (!this.detailInfo.contractYear) {
                    Common.ejMessage("warning", "标段年份必填");
                    return;
                }
                if (!(this.weeks && this.weeks.length > 1)) {
                    Common.ejMessage("warning", "标段周期必填");
                    return;
                }
                this.detailInfo.systemCodeName = this.systemCodeName;
                this.detailInfo.contractDeptName = this.contractDeptName;
                this.detailInfo.contractBeginTime = this.weeks ? this.weeks[0] : '';
                this.detailInfo.contractEndTime = this.weeks ? this.weeks[1] : '';
                let murl = '';
                if (this.detailInfo.contractId) {
                    murl = '/ContractInfo/Other/updateContractOther';
                } else {
                    murl = '/ContractInfo/Other/insertContractOther';
                }
                this.isAjaxing = true;
                this.$api.post(`${this.$config.efoms_HOST}${murl}`, this.detailInfo, { token: this.token }).then(res => {
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
            condelete(item) {
                this.$confirm('确认删除该条标段吗？', '操作提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$api.delete(`${this.$config.efoms_HOST}/ContractInfo/Other/deleteContractOther`, { contractId: item.contractId }, { token: this.token })
                        .then(res => {
                            if (res.appCode == 0) {
                                Common.ejMessage("success", "数据删除成功！");
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
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: this.token, data: JSON.stringify(obj) }, {}
                );
            },
            // 数据接口
            getDataInfo(url, obj) {
                return this.$api.get(
                    url, obj, { token: this.token }
                );
            },
            // 页面初始化
            initPage() {
                this.searchTableInfo();
                //所属系统
                this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { parentCode: "SYSTEMOTHERWOR" }).then(res => {
                    this.systemList = res.resultList || [];
                });
                //维护单位
                this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptTreeRoot.htm`, { deptTypeCode: 'OPSDEPTTYPE01,OPSDEPTTYPE03' }).then(res => {
                    this.opDeptList = res.resultList || [];
                });
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
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