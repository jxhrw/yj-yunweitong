<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="title" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" :typeTableData="typeTableData" :multipleSelection.sync="multipleSelection" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
            <template slot="pageBtn">
                <div class="ej-content-goto" @click="gotoEqpm">
                    <p>申报</p>
                </div>
            </template>

            <template slot="condFirst">
                <el-col :span="7">
                    <label>模糊查询</label>
                    <el-input v-model="key" placeholder="设备名称/设备编号" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>申报时间</label>
                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
                <el-col :span="7">
                    <label>当前状态</label>
                    <mSelectMult :list="stateList" :code.sync="stateCode" :name.sync="stateName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
            </template>

            <template slot="condSecond">
                <!-- <el-col :span="7">
                    <label>申报人员</label>
                    <el-input v-model="person" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col> -->
                <!-- <el-col :span="7">
                    <label>申报编号</label>
                    <el-input v-model="declareId" placeholder="" size='mini' class="content-select" clearable></el-input>
                </el-col> -->
                <el-col :span="7">
                    <label>申报部门</label>
                    <mSelectMult :list="departList" :code.sync="departCode" :name.sync="departName" showAttr="deptName" getAttr="deptId" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>申报来源</label>
                    <mSelectMult :list="sourceList" :code.sync="sourceCode" :name.sync="sourceName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>所属区域</label>
                    <mSelectMult :list="regionList" :code.sync="regionCode" :name.sync="regionName" showAttr="regionName" getAttr="regionId" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>所属系统</label>
                    <mSelectMult :list="systemList" :code.sync="systemCode" :name.sync="systemName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <!-- <el-col :span="7">
                    <label>维修类型</label>
                    <mInput :list="reptypeList" :code.sync="reptypeCode" :name.sync="reptypeName"></mInput>
                </el-col> -->
            </template>

            <template slot="tableBtn">
                <div class="operation export" @click="exportExcel">
                    <p>导出</p>
                </div>
                <!-- <div class="operation revoke" @click="showRevoke">
                    <p>撤销</p>
                </div>
                <div class="operation urge" @click="showUrge">
                    <p>催办</p>
                </div> -->
            </template>

            <template slot="table">
                <el-table :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <!-- <el-table-column prop="repairsId" label="申报编号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.workordersId||scope.row.repairsId}}
            </template>
          </el-table-column> -->
                    <el-table-column prop="devName" label="设备名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devAreaName" label="所属区域" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="所属系统" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repSourceName" label="申报来源" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repPersonName" label="申报人员" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="devAreaName" label="管理辖区" show-overflow-tooltip v-if="JSON.stringify(multipleSelection).indexOf('管理辖区')>-1"></el-table-column> -->
                    <!-- <el-table-column prop="failureDescrible" label="情况描述" show-overflow-tooltip></el-table-column> -->
                    <el-table-column prop="repStatusName" label="当前状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersStatusName||scope.row.repStatusName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <div class="tab-operation" @click="dataDetail(scope.row)">详情</div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template slot="dialog">
                <el-dialog title="报修催办" :visible.sync="dialogUrgeVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                    <div class="dialog-main">
                        <label class="dialog-label">催办原因</label>
                        <el-input rows="6" style="width:290px;" type="textarea" placeholder="请输入" v-model="operExplain" class="dialog-textarea">
                        </el-input>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="pressRepairsInfo" size='mini' class="submit">提 交</el-button>
                        <el-button @click="dialogUrgeVisible = false" size='mini' class="cancel">取 消</el-button>
                    </div>
                </el-dialog>
                <el-dialog title="撤销申请" :visible.sync="dialogRevokeVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                    <div class="dialog-main">
                        <div class="revoke-reason">
                            <label class="dialog-label">撤销原因</label>
                            <el-select v-model="cancelReasonCode" placeholder="请选择" size='mini' class="content-select">
                                <el-option v-for="item in cancelReasonList" :key="item.dicCode" :label="item.dicName" :value="item.dicCode">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label class="dialog-label">备注</label>
                            <el-input rows="6" style="width:290px;" type="textarea" placeholder="请输入" v-model="operExplain4Cancel" class="dialog-textarea">
                            </el-input>
                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="cancelRepairsInfo" size='mini' class="submit">提 交</el-button>
                        <el-button @click="dialogRevokeVisible = false" size='mini' class="cancel">取 消</el-button>
                    </div>
                </el-dialog>
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
        watch: {
            $route(newVal, oldVal) {
                if (newVal.path === oldVal.path && newVal.path === '/repair') {
                    this.initPage();
                }
            }
        },
        data() {
            return {
                title: '',
                token: "",
                key: "",
                times: "",
                person: "",
                declareId: "",

                departCode: [],
                departName: [],
                departList: [],
                sourceCode: [],
                sourceName: [],
                sourceList: [],
                regionCode: [],
                regionName: [],
                regionList: [],
                systemCode: [],
                systemName: [],
                systemList: [],
                reptypeCode: "",
                reptypeName: "",
                reptypeList: [],
                stateCode: [],
                stateName: [],
                stateList: [],
                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                typeTableData: [],
                // typeTableData: [{ "name": "管理辖区" }, { "name": "维修类型" }],
                multipleSelection: [], // 选中需显示的内容
                detailInfo: {},
                dialogUrgeVisible: false, // 催办
                operExplain: [],
                dialogRevokeVisible: false, //撤销
                cancelReasonCode: '',
                cancelReasonList: [],
                operExplain4Cancel: '',
            };
        },
        methods: {
            searchTableInfo() {
                console.log("table");
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = {
                    pageSize: pageSize,
                    currentPage: 1,
                    key: this.key,
                    startTime: this.times ? this.times[0] : "",
                    endTime: this.times ? this.times[1] : "",
                    repStatusCode: this.stateCode.join(','),
                    repairsId: this.declareId,
                    repDeptIds: this.departCode.join(','),
                    repSourceCode: this.sourceCode.join(','),
                    devAreaCode: this.regionCode.join(','),
                    devTypeCode: this.systemCode.join(','),
                };
                this.searchPageInfo();
            },
            searchPageInfo() {
                console.log("page");
                this.tableData = [];
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/repairs/selectMyRepairPage`, this.queryConditions, { token: this.token })
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
            gotoEqpm() {
                sessionStorage.setItem('detrepSave', '0'); // 详情页数据清空
                this.$router.push({
                    path: "/detrep",
                    query: { type: 'optimize' }
                });
            },
            exportExcel() {
                let method = `${this.$config.efoms_HOST}/export/exportYHSB`;
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api.get(method, obj, { token: this.token })
                    .then(res => {
                        window.open(res.path + '&token=' + this.token);
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            showRevoke() {
                if (!this.detailInfo.repairsId) {
                    return this.$message.error("请先选择一条数据");
                }
                if (this.detailInfo.repStatusCode != "REPAIRSTATUS01") {
                    let tips = `该数据${this.detailInfo.repStatusName || "不是待审核"}不能撤销`;
                    return this.$message.error(tips);
                }
                this.dialogRevokeVisible = true;
            },
            showUrge() {
                if (!this.detailInfo.repairsId) {
                    return this.$message.error("请先选择一条数据");
                }
                if (this.detailInfo.repStatusCode != "REPAIRSTATUS01") {
                    let tips = `该数据${this.detailInfo.repStatusName || "不是待审核"}不能催办`;
                    return this.$message.error(tips);
                }
                this.dialogUrgeVisible = true;
            },
            currentSelect(e) {
                console.log(e);
                this.detailInfo = e || {};
            },
            pressRepairsInfo() {
                this.$api.putByQs(`${this.$config.efoms_HOST}/repairs/pressRepairsInfo`, {
                        repairsId: this.detailInfo.repairsId,
                        operExplain: this.operExplain
                    }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            Common.ejMessage("success", "操作成功");
                            this.dialogUrgeVisible = false;
                            this.searchPageInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            cancelRepairsInfo() {
                if (this.cancelReasonCode == "") {
                    return Common.ejMessage("warning", "请选择撤销原因");
                }
                this.$api.putByQs(`${this.$config.efoms_HOST}/repairs/cancelRepairsInfo`, {
                        repairsId: this.detailInfo.repairsId,
                        operExplain: this.operExplain4Cancel,
                        operReasonCode: this.cancelReasonCode
                    }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            Common.ejMessage("success", "操作成功");
                            this.dialogRevokeVisible = false;
                            this.searchPageInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            dataDetail(item) {
                if (item.workordersId) {
                    this.$router.push({
                        path: "/detsheet",
                        query: { id: item.workordersId, pre: '优化申报' }
                    });
                } else {
                    this.$router.push({
                        path: "/detsheet",
                        query: { type: 'optimize', id: item.repairsId, pre: '优化申报' }
                    });
                }
            },
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: this.token, data: JSON.stringify(obj) }, {}
                );
            },
            // 页面初始化
            initPage() {
                this.key = "";
                this.times = "";
                this.person = "";
                this.declareId = "";
                this.departCode = [];
                this.departName = [];
                this.sourceCode = [];
                this.sourceName = [];
                this.regionCode = [];
                this.regionName = [];
                this.systemCode = [];
                this.systemName = [];
                this.reptypeCode = "";
                this.reptypeName = "";
                this.stateCode = [];
                this.stateName = [];
                this.queryConditions = {};
                this.multipleSelection = [];
                this.detailInfo = {};
                this.$refs.layout.conditionVisible = false;
                this.token = Common.getQueryString("token");

                this.title = '优化申报';

                this.searchTableInfo();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            //申报部门
            let a1 = this.getDicInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfo.htm`, {});
            let a2 = this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptTreeRoot.htm`, {});
            Promise.all([a1, a2]).then(res => {
                let arr0 = res[0].resultList || [];
                let arr1 = res[1].resultList || [];
                arr1.map(item => {
                    item.deptId = item.opsDeptId;
                    item.deptName = item.opsDeptName;
                });
                this.departList = [...arr0, ...arr1];
            });
            // this.getDicInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfo.htm`, {}).then(res => {
            //     this.departList = res.resultList || [];
            // });
            //申报来源
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPAIRSSOURCE"
            }).then(res => {
                this.sourceList = res.resultList || [];
            });
            //所属区域
            this.getDicInfo(
                `${this.$config.ubms_HOST}/RegionInfo/getRegionInfo.htm`, {}
            ).then(res => {
                this.regionList = res.resultList || [];
            });
            //所属系统
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPDEVCATEGORY01"
            }).then(res => {
                this.systemList = res.resultList || [];
            });
            //维修类型
            // this.reptypeList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' },{ dicCode: 'REPAIRTYPE03', dicName: '优化' }];
            // this.reptypeList = [{ dicCode: 'REPAIRTYPE03', dicName: '优化' }];
            //当前状态
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPAIRSTATUS"
            }).then(res => {
                this.stateList = res.resultList || [];
            });
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
            if (to.name == 'detsheet' || to.name == 'detrep') {
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