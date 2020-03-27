<template>
    <div class="ej-main">
        <wkLayout ref="layout" :title="'合同管理'" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
            <template slot="pageBtn">
                <div class="ej-content-goto" @click="gotoCreate">
                    <p>创建合同</p>
                </div>
            </template>

            <template slot="condFirst">
                <el-col :span="7">
                    <label>合同编号</label>
                    <el-input v-model="contractId" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>合同名称</label>
                    <el-input v-model="contractName" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>时间范围</label>
                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
            </template>

            <template slot="condSecond">
                <el-col :span="7">
                    <label style="white-space: nowrap;">责任人编号</label>
                    <el-input v-model="resPerson" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label style="white-space: nowrap;">责任人名称</label>
                    <el-input v-model="resPersonName" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
            </template>

            <!-- <template slot="tableBtn">
                <div class="operation export" @click="exportExcel">
                    <p>导出</p>
                </div>
            </template> -->

            <template slot="table">
                <el-table :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column prop="contractId" label="合同编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contractName" label="合同名称" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="contractMoney" label="合同金额" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="aaaaa" label="设施类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="aaaaa" label="区域" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="deptName" label="所属大队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contractDeptName" label="中标部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="resPerson" label="责任人编号" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column prop="resPersonName" label="责任人名称" show-overflow-tooltip min-width="100"></el-table-column>
                    <el-table-column prop="contractBeginTime" label="合同开始时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="contractEndTime" label="合同结束时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="contractEndTime" label="操作" show-overflow-tooltip min-width="120">
                        <template slot-scope="scope">
                            <div class="tab-operation" @click="conchange(scope.row)">查看</div>
                            <div class="tab-operation" @click="conchange(scope.row,'edit')">修改</div>
                            <div class="tab-operation" @click="condelete(scope.row,'edit')">删除</div>
                        </template>
                    </el-table-column>
                </el-table>
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
                contractId: '',
                contractName: '',
                resPerson: '',
                resPersonName: '',
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
                    contractId: this.contractId,
                    contractName: this.contractName,
                    resPerson: this.resPerson,
                    resPersonName: this.resPersonName,
                    contractBeginTime: this.times ? `${this.times[0]} 00:00:00` : '',
                    contractEndTime: this.times ? `${this.times[1]} 23:59:59` : '',
                };
                this.searchPageInfo();
            },
            searchPageInfo() {
                // console.log("page");
                this.tableData = [];
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/ContractInfo/getContractInfoPage`, this.queryConditions, { token: this.token })
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
            gotoCreate() {
                sessionStorage.setItem('relaodPage', '1');
                this.$router.push({
                    path: "/detcontract",
                    query: { isread: 'add' }
                });
            },
            conchange(item, type) {
                if (type == 'edit') {
                    sessionStorage.setItem('relaodPage', '1');
                }
                this.$router.push({
                    path: "/detcontract",
                    query: { id: item.contractId, isread: type }
                });
            },
            condelete(item) {
                this.$confirm('确认删除该条合同吗？', '操作提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$api.delete(`${this.$config.efoms_HOST}/ContractInfo/deleteWorkordersInfo`, { contractId: item.contractId }, { token: this.token })
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
            // 页面初始化
            initPage() {
                this.searchTableInfo();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.initPage();
        },
        activated() {
            if (!this.$route.meta.isUseCache) {
                console.log('新');
                sessionStorage.setItem('relaodPage', '0');
                this.initPage();
            } else {
                console.log('旧');

                // 回到列表，如果回到的不是同一个列表则需要刷新
                // 根据是否点击菜单判断
                if (sessionStorage.getItem('menuSeclect') === '1') {
                    sessionStorage.setItem('menuSeclect', '0');
                    this.initPage();
                }

                // 点击编辑去的详情回来列表要刷新
                else if (sessionStorage.getItem('relaodPage') == '1') {
                    sessionStorage.setItem('relaodPage', '0');
                    this.searchPageInfo();
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.name == 'detcontract') {
                from.meta.isUseCache = true;
                sessionStorage.setItem('menuSeclect', '0');
            } else {
                from.meta.isUseCache = false;
            }
            next();
        },
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