<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="title" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" :typeTableData="typeTableData" :multipleSelection.sync="multipleSelection" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
            <template slot="pageBtn" v-if="$route.query.type=='0'">
                <div class="ej-content-goto" @click="gotoEqpm">
                    <p>创建工单</p>
                </div>
            </template>
            <template slot="pageBtn" v-if="$route.query.hasBack=='1'">
                <div class="ej-content-black" @click="()=>{$router.go(-1)}">
                    <p>返回</p>
                </div>
            </template>


            <template slot="condFirst">
                <!-- <el-col :span="7">
                    <label>模糊查询</label>
                    <el-input v-model="key" placeholder="设备名称/设备编号" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col> -->
                <el-col :span="7">
                    <label>申报时间</label>
                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
                <el-col :span="7">
                    <label>工单编号</label>
                    <el-input v-model="declareId" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <!-- <el-col :span="7" v-show="title!='工单查询'&&title!='维修申报'">
                    <label>查询类型</label>
                    <mInput :list="typeList" :code.sync="typeCode" :name.sync="typeName" :clearable="false" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7" v-show="title=='工单查询'||title=='维修申报'">
                    <label>当前状态</label>
                    <mSelectMult :list="stateList" :code.sync="stateCode" :name.sync="stateName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col> -->
                <el-col :span="7" v-show="title!='维修申报'">
                    <label>申报部门</label>
                    <mSelectMult class="spc-height" :list="departList" :code.sync="departCode" :name.sync="departName" showAttr="deptName" getAttr="deptId" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7" v-show="title=='维修申报'">
                    <label>所属系统</label>
                    <mSelectMult :list="systemList" :code.sync="systemCode" :name.sync="systemName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
            </template>

            <template slot="condSecond">
                <el-col :span="7" v-show="title!='维修申报'">
                    <label>所属系统</label>
                    <mSelectMult :list="systemList" :code.sync="systemCode" :name.sync="systemName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>紧急程度</label>
                    <mSelectMult :list="urgentList" :code.sync="urgentCode" :name.sync="urgentName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>所属平台</label>
                    <mSelectMult :list="platformList" :code.sync="platformCode" :name.sync="platformName" @keyup.enter.native="searchTableInfo"></mSelectMult>
                </el-col>
                <el-col :span="7">
                    <label>催办</label>
                    <mInput :list="pressList" :code.sync="pressCode" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
            </template>

            <template slot="tableBtn">
                <div v-if="listUrl.download" class="operation export" @click="exportExcel">
                    <p>导出</p>
                </div>
            </template>

            <template slot="table">
                <el-table v-show="tableShowType==1" :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="workSystemId" label="工单编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workSystemId||scope.row.repairsId}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="repDeptName" label="申报部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="systemName" label="所属系统" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="levelName" label="紧急程度" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="platformName" label="所属平台" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="failureDescrible" label="情况描述" show-overflow-tooltip min-width="120"></el-table-column>
                    <!-- <el-table-column prop="oppmDeptName" label="维护单位" show-overflow-tooltip></el-table-column> -->
                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <!-- <el-table-column prop="repPersonName" label="期限完成时间" show-overflow-tooltip min-width="120"></el-table-column> -->
                    <el-table-column prop="workStatusName" label="当前状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workStatusName||scope.row.repStatusName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pressTimes" label="催办次数" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" min-width="100">
                        <!-- 操作4个表格都一样 -->
                        <template slot-scope="scope">
                            <TableOpertion :title="title" :scope="scope" :queryConditions="queryConditions"></TableOpertion>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </WkLayout>
    </div>
</template>
<script>
    import WkLayout from "components/common/wklayout";
    import mInput from "components/common/selectDrop";
    import Common from "@/assets/js/common.js";
    import TableOpertion from "./sheetOperation/tableOpertion.vue";
    import mSelectMult from "@/components/common/selectMult";
    export default {
        components: {
            WkLayout,
            mInput,
            TableOpertion,
            mSelectMult
        },
        watch: {
            $route(newVal, oldVal) {
                if (newVal.path === '/sheetxt') {
                    if (newVal.path === oldVal.path) {
                        this.initPage();
                    }
                    if (newVal.path != oldVal.path && newVal.query.type != sessionStorage.getItem('sheetxtPageType')) {
                        this.initPage();
                    }
                    // if (newVal.path != oldVal.path && newVal.query.devId) {
                    //     this.initPage();
                    // }
                    sessionStorage.setItem('sheetxtPageType', newVal.query.type);
                }
            }
        },
        data() {
            return {
                title: '',
                token: "",
                listUrl: {},
                key: "",
                times: "",
                person: "",
                declareId: "",
                departCode: [],
                departName: [],
                departList: [],
                systemCode: [],
                systemName: [],
                systemList: [],
                urgentCode: [],
                urgentName: [],
                urgentList: [],
                platformCode: [],
                platformName: [],
                platformList: [],
                stateCode: [],
                stateName: [],
                stateList: [],
                typeCode: '',
                typeName: '',
                typeList: [],
                pressCode: '',
                pressList: [],

                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                tableShowType: 0, // 0 基础，1大众，2延期查询，3维修处置，4确认+评价
                typeTableData: [],
                // typeTableData: [{ "name": "管理辖区" }, { "name": "维修类型" }],
                multipleSelection: [], // 选中需显示的内容
                detailInfo: {},
                isAjaxing: false,
                source: null
            };
        },
        methods: {
            searchTableInfo() {
                console.log("table");
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = {
                    pageSize: pageSize,
                    currentPage: 1,
                };
                let obj = {
                    key: this.key,
                    repStartDate: this.times ? `${this.times[0]} 00:00:00` : "",
                    repEndDate: this.times ? `${this.times[1]} 23:59:59` : "",
                    workordersIdKey: this.declareId,
                    systemCodes: this.systemCode.join(","),
                    platformCodes: this.platformCode.join(","),
                    levelCodes: this.urgentCode.join(","),
                    press: this.pressCode,
                    repDept: this.departCode.join(","),
                };
                this.queryConditions = { ...this.queryConditions, ...obj }
                this.searchPageInfo();
            },
            searchPageInfo() {
                console.log("page");
                // this.tableData = [];
                this.source = this.$api.CancelToken.source(); // 这里初始化source对象
                this.isTableLoading = true;
                this.$api.get(this.listUrl.table, this.queryConditions, { token: this.token }, this.source.token)
                    .then(res => {
                        setTimeout(load => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.result || [];
                            this.totalPage = res.resultList.totalPage;
                            this.totalCount = res.resultList.totalCount;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        if (err && err.message && err.message == '主动取消') {
                            console.log(err.message);
                        } else {
                            this.isTableLoading = false;
                            Common.printErrorLog(err);
                        }
                    });
            },
            gotoEqpm() {
                sessionStorage.setItem('detrepxtSave', '0'); // 详情页数据清空
                this.$router.push({
                    path: "/detrepxt",
                    query: {}
                });
            },
            exportExcel() {
                let method = this.listUrl.download;
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api.get(method, obj, { token: this.token })
                    .then(res => {
                        window.open(res.path + '&token=' + this.token);
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            currentSelect(e) {
                this.detailInfo = e || {};
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
                this.systemCode = [];
                this.systemName = [];
                this.urgentCode = [];
                this.urgentName = [];
                this.platformCode = [];
                this.platformName = [];
                this.stateCode = [];
                this.stateName = [];
                this.pressCode = '';
                this.queryConditions = {};
                this.multipleSelection = [];
                this.tableData = [];
                this.detailInfo = {};
                this.$refs.layout.conditionVisible = false;
                this.token = Common.getQueryString("token");
                this.typeCode = '';
                this.typeName = '';
                this.typeList = [];
                this.tableShowType = 0;

                this.listUrl.download = '';
                let pageType = this.$route.query.type;
                switch (pageType) {
                    case '0':
                        this.tableShowType = 1;
                        this.title = '维修申报';
                        this.listUrl.table = `${this.$config.efoms_HOST}/workorderssystem/page/mine`;
                        // this.listUrl.download = `${this.$config.efoms_HOST}/export/exportWXSB`;
                        break;
                    case '7':
                        this.tableShowType = 1;
                        this.title = '工单查询';
                        this.listUrl.table = `${this.$config.efoms_HOST}/workorderssystem/page/info`;
                        // this.listUrl.download = `${this.$config.efoms_HOST}/export/exportGDSSCX`;
                        if (this.$route.query.devId) {
                            this.key = this.$route.query.devId;
                        }
                        break;
                    case '11':
                        this.tableShowType = 1;
                        this.title = '维修处置';
                        this.listUrl.table = `${this.$config.efoms_HOST}/workorderssystem/page/info`;
                        this.typeList = [{ dicCode: '0', dicName: '新工单' }, { dicCode: '1', dicName: '待处理' }, { dicCode: '2', dicName: '已催办' }, { dicCode: '3', dicName: '超时' }, { dicCode: '4', dicName: '已修复' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    case '12':
                        this.tableShowType = 1;
                        this.title = '工单确认';
                        this.listUrl.table = `${this.$config.efoms_HOST}/workorderssystem/page/info`;
                        this.typeList = [{ dicCode: '0', dicName: '待确认' }, { dicCode: '1', dicName: '已确认' }];
                        this.typeCode = this.typeList[0].dicCode;
                        this.typeName = this.typeList[0].dicName;
                        break;
                    default:
                        break;
                }

                if (this.source) {
                    this.source.cancel('主动取消'); //这里你可以输出一些信息，可以在catch中拿到
                }

                this.searchTableInfo();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            //申报部门(交警部门+维护单位)
            let a1 = this.getDicInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfo.htm`, {});
            let a2 = this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptInfoV2.htm`, {});
            Promise.all([a1, a2]).then(res => {
                let arr0 = res[0].resultList || [];
                let arr1 = res[1].resultList || [];
                arr1.map(item => {
                    item.deptId = item.opsDeptId;
                    item.deptName = item.opsDeptName;
                });
                this.departList = [...arr0, ...arr1];
                this.oppmDeptList = arr1;
            });
            //当前状态
            // this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
            //     parentCode: "ORDERSSTATUS"
            // }).then(res => {
            //     this.stateList = res.resultList || [];
            // });
            //所属系统
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "SYSTEMAPPLYWORK"
            }).then(res => {
                this.systemList = res.resultList || [];
            }).catch(err => {
                Common.printErrorLog(err);
            });
            // 紧急程度
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "WORKORDERLEVEL"
            }).then(res => {
                this.urgentList = res.resultList || [];
            }).catch(err => {
                Common.printErrorLog(err);
            });
            // 所属平台
            this.platformList = [{ dicCode: '2', dicName: '移动端' }, { dicCode: '3', dicName: 'PC端' }, { dicCode: '1', dicName: '全部' }];
            // 催办
            this.pressList = [{ dicCode: '', dicName: '所有' }, { dicCode: '1', dicName: '已催办' }];
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
            if (to.name == 'detsheetxt' || to.name == 'detrepxt') {
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