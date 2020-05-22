<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="title" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
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
                <el-col :span="7">
                    <label>工单编号</label>
                    <el-input v-model="declareId" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>申报人员</label>
                    <el-input v-model="person" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>申报部门</label>
                    <mSelectMult class="spc-height" :list="departList" :code.sync="departCode" :name.sync="departName" showAttr="deptName" getAttr="deptId" @keyup.enter.native="searchTableInfo"></mSelectMult>
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
                <el-col :span="7">
                    <label>维修类型</label>
                    <mInput :list="reptypeList" :code.sync="reptypeCode" :name.sync="reptypeName"></mInput>
                </el-col>
                <el-col :span="7">
                    <label>维护单位</label>
                    <mInput :list="oppmDeptList" :code.sync="oppmDeptId" showAttr="opsDeptName" getAttr="opsDeptId" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
            </template>

            <template slot="table">
                <el-table :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="workordersId" label="工单编号" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersId||scope.row.repairsId}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="devName" label="设备名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devAreaName" label="所属区域" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="所属系统" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDate" label="申报时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="repSourceName" label="申报来源" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repDeptName" label="申报部门" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repPersonName" label="申报人员" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="oppmDeptName" label="维护单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="workordersStatusName" label="当前状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.workordersStatusName||scope.row.repStatusName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="aaaaa" label="打印状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.isPrintDetail?'已打印':'未打印'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" show-overflow-tooltip min-width="100">
                        <template slot-scope="scope">
                            <div class="tab-operation" @click="printing(scope.row,scope)">打印</div>
                            <div class="tab-operation" @click="dataDetail(scope.row)">详情</div>
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
    import mTree from "components/common/inputTree";
    export default {
        components: {
            WkLayout,
            mInput,
            TableOpertion,
            mSelectMult,
            mTree
        },
        watch: {
            $route(newVal, oldVal) {
                if (newVal.path === '/contact') {
                    if (newVal.path === oldVal.path) {
                        this.initPage();
                    }
                    if (newVal.path != oldVal.path && newVal.query.type != sessionStorage.getItem('contactPageType')) {
                        this.initPage();
                    }

                    sessionStorage.setItem('contactPageType', newVal.query.type);
                }
            },
        },
        data() {
            return {
                title: '',
                token: "",
                listUrl: {},
                key: "",
                times: "",
                stateCode: [],
                stateName: [],
                stateList: [],
                declareId: '',
                person: "",
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
                oppmDeptId: '',
                oppmDeptList: [],

                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                detailInfo: {},
                isAjaxing: false,
                source: null,
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
                    workordersStatusCode: this.stateCode.join(","),
                    repPersonName: this.person,
                    workordersIdKey: this.declareId,
                    // devDeptId: this.departCode.join(","),
                    repDeptIds: this.departCode.join(","),
                    repSourceCode: this.sourceCode.join(","),
                    devAreaCode: this.regionCode.join(","),
                    devTypeCode: this.systemCode.join(","),
                    oppmDeptId: this.oppmDeptId,
                    typeCode: this.reptypeCode,
                    contactStatus: '1'
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
            currentSelect(e) {
                this.detailInfo = e || {};
            },
            dataDetail(item, type) {
                this.$router.push({
                    path: "/detsheet",
                    query: { pre: this.title, id: item.workordersId, isread: type }
                });
            },
            printing(item, data) {
                this.$api.putByQs(`${this.$config.efoms_HOST}/workorders/updateContactPrint`, { workordersId: item.workordersId, contactStatus: '1', isPrint: '1' }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.tableData[data.$index].isPrintDetail = true;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
                window.open(`./lxds.html?id=${item.workordersId}&token=${this.token}`);
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
                this.key = "";
                this.times = "";
                this.stateCode = [];
                this.stateName = [];
                this.declareId = "";
                this.person = "";
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
                this.oppmDeptId = "";
                this.queryConditions = {};
                this.tableData = [];
                this.detailInfo = {};
                this.$refs.layout.conditionVisible = false;
                this.token = Common.getQueryString("token");

                this.listUrl.table = `${this.$config.efoms_HOST}/workorders/pageWorkordersInfoContact`;
                let pageType = this.$route.query.type;
                switch (pageType) {
                    case '1':
                        this.title = '已确认联系单';
                        break;
                    case '2':
                        this.title = '已修复联系单';
                        break;
                    case '3':
                        this.title = '已验收联系单';
                        break;
                    default:
                        this.title = '已确认联系单';
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

            //维修类型
            this.reptypeList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' }, { dicCode: 'REPAIRTYPE03', dicName: '优化' }];
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
            //当前状态
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "ORDERSSTATUS"
            }).then(res => {
                let arr = res.resultList || [];
                this.stateList = arr.filter(e => (e.dicCode == 'ORDERSSTATUS06' || e.dicCode == 'ORDERSSTATUS07'));
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
            if (to.name == 'detsheet') {
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

    .fx-ul {
        height: 200px;

        li {
            display: flex;
            align-content: center;

            &+li {
                margin-top: 10px;
            }

            .load {
                flex: 1;
                line-height: 40px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }

    .dia-height {
        /deep/ .el-scrollbar__wrap {
            margin-bottom: 0 !important;
        }
    }

    .img-preview {
        display: block;
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background: #FFFFFF;
        border: 1px solid #E1E7ED;
        position: relative;
        text-align: center;

        .icon-file {
            width: 100%;
            height: 100%;

            &.file-doc {
                background: url("../../assets/images/file-word.png") no-repeat center/100%;
            }

            &.file-xls {
                background: url("../../assets/images/file-execl.png") no-repeat center/100%;
            }

            &.file-other {
                background: url("../../assets/images/file-file.png") no-repeat center/100%;
            }
        }
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