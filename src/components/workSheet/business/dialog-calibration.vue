<template>
    <el-dialog title="选择点位" :visible.sync="mDialogVisible" width='560px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
        <div class="dialog-main">
            <div class="revoke-reason">
                关键字 <el-input v-model="key" placeholder="ID/名称/IP/唯一识别码" size='mini' class="dialog-select" clearable @keyup.enter.native="searchTable"></el-input>
                所属系统 <mInput :list="devTypeList" :code.sync="devTypeCode" :name.sync="devTypeName" class="dialog-select" @keyup.enter.native="searchTable"></mInput>
                <el-button @click="searchTable" size='mini' class="submit">搜索</el-button>
            </div>
            <div>
                <div style="height:340px;">
                    <el-table :data="tableData" class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                        <el-table-column prop="devName" label="路口名称" show-overflow-tooltip align="center" min-width="180"></el-table-column>
                        <el-table-column prop="devAreaName" label="所属区域" show-overflow-tooltip align="center" width="80"></el-table-column>
                        <el-table-column prop="manageId" label="唯一识别码" show-overflow-tooltip align="center" min-width="120"></el-table-column>
                        <el-table-column label="操作" align="center" width="80">
                            <template slot-scope="scope">
                                <span @click="selectSingle(scope.row)" class="opt-btn">选择</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="page-box">
                    <div>共{{totalCount}}条</div>
                    <el-pagination layout="prev, pager, next" :total="totalCount" :pager-count="5" small @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    import mInput from "components/common/selectDrop";
    import Common from "@/assets/js/common.js";
    export default {
        components: {
            mInput,
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            cabCode: {
                type: String,
                default: ''
            },
            cabName: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                openNum: 0, //弹窗打开次数
                mDialogVisible: false,
                key: '',
                devTypeCode: '',
                devTypeName: '',
                devTypeList: [],
                tableData: [],
                isTableLoading: false,
                totalCount: 0,
                totalPage: 0,
                queryConditions: { pageSize: 10, currentPage: 1 }
            }
        },
        watch: {
            dialogVisible(val) {
                this.mDialogVisible = val;
            },
            mDialogVisible(val) {
                if (val) {
                    this.openNum++;
                    this.$nextTick(() => {
                        this.devTypeCode = this.cabCode;
                        this.devTypeName = this.cabName;
                        this.searchTable();
                    });
                }
                this.$emit('update:dialogVisible', val);
            },
            openNum(val) {
                if (val == 1) {
                    //所属系统
                    this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { parentCode: "REPDEVCATEGORY01" }).then(res => {
                        this.devTypeList = res.resultList || [];
                    });
                }
            },
        },
        methods: {
            selectSingle(item) {
                this.mDialogVisible = false;
                this.$emit('callback', item);
            },
            handleCurrentChange(val) {
                this.queryConditions.currentPage = val;
                this.searchPage();
            },
            searchTable() {
                let obj = {
                    key: this.key,
                    devTypeCode: this.devTypeCode,
                };
                this.queryConditions = { ...this.queryConditions, ...obj }
                this.searchPage();
            },
            searchPage() {
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/deviceDetail/selectDeviceDetailInfoPage`, this.queryConditions, { token: Common.getQueryString("token") })
                    .then(res => {
                        this.isTableLoading = false;
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.result || [];
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
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: Common.getQueryString("token"), data: JSON.stringify(obj) }, {}
                );
            },
        },
        mounted() {}
    }
</script>
<style lang="less" scoped>
    @import "../../../assets/less/dialog.less";

    .dialog-urge {
        .dialog-main {
            padding-bottom: 0;

            .dialog-select {
                width: 160px;
                margin-left: 5px;
            }
        }

        .opt-btn {
            color: #00c187;
            cursor: pointer;
        }

        .page-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
    }

    .dialog-urge {

        /deep/ .el-dialog__body {
            padding-bottom: 15px;
        }

        /deep/ .el-table td,
        /deep/ .el-table th {
            padding: 3px 0 !important;
            font-size: 12px;
        }

        .content-table /deep/ .el-icon-loading,
        .content-table /deep/ .el-loading-spinner .el-loading-text {
            color: #00C187;
        }
    }
</style>