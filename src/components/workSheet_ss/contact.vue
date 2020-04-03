<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="title" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
            <template slot="condFirst">
                <el-col :span="7">
                    <label>申报时间</label>
                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
                <el-col :span="7">
                    <label>申报编号</label>
                    <el-input v-model="declareId" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>道路名称</label>
                    <el-input v-model="roadName" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
            </template>

            <template slot="condSecond">
                <el-col :span="7">
                    <label>所属大队</label>
                    <mInput :list="battalionList" :code.sync="battalionCode" showAttr="deptName" getAttr="deptId"></mInput>
                </el-col>
                <el-col :span="7">
                    <label>所属中队</label>
                    <mInput :list="squadronList" :code.sync="squadronCode" showAttr="deptName" getAttr="deptId"></mInput>
                </el-col>
                <el-col :span="7">
                    <label>维修类型</label>
                    <mInput :list="reptypeList" :code.sync="reptypeCode" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7">
                    <label>设施类别</label>
                    <mInput :list="facTypeList" :code.sync="facTypeCode" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
            </template>

            <template slot="tableBtn">
                <div v-if="listUrl.download" class="operation export" @click="exportExcel">
                    <p>导出</p>
                </div>
            </template>

            <template slot="table">
                <el-table :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="signsWorkordersId" label="申报编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devDeptName" label="所属大队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="squadronName" label="所属中队" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="道路信息" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.listSignsWorkordersRoad|roadShow}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="typeName" label="维修类型" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="devTypeName" label="设施类别" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="workordersStatusName" label="状态" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="aaaaa" label="打印状态" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" :min-width="$route.query.type=='2'?140:100">
                        <template slot-scope="scope">
                            <div class="tab-operation" @click="printing(scope.row,'edit')">打印</div>
                            <div v-if="$route.query.type!='0'" class="tab-operation" @click="handleAnnex(scope.row)">附件</div>
                            <div class="tab-operation" @click="dataDetail(scope.row)">详情</div>
                            <div v-if="$route.query.type=='2'" class="tab-operation" @click="dataDetail(scope.row,'edit')">归档</div>
                            <div v-if="$route.query.type=='3'" class="tab-operation" @click="dataDetail(scope.row,'edit')">取消归档</div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <template slot="dialog">
                <el-dialog title="附件下载" :visible.sync="dialogAnnexVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                    <div class="dialog-main">
                        <el-scrollbar class="dia-height">
                            <ul class="fx-ul">
                                <li></li>
                            </ul>
                        </el-scrollbar>
                    </div>
                    <!-- <div class="dialog-main">
                        <label class="dialog-label">催办原因</label>
                        <el-input rows="6" style="width:290px;" type="textarea" placeholder="请输入" v-model="operExplain" class="dialog-textarea">
                        </el-input>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="pressWorkorders" size='mini' class="submit">提 交</el-button>
                        <el-button @click="dialogUrgeVisible = false" size='mini' class="cancel">取 消</el-button>
                    </div> -->
                </el-dialog>
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
        filters: {
            roadShow(list) {
                let arr = [];
                list.map(item => {
                    arr.push(`${item.roadName}(${item.beginCrossName}-${item.endCrossName})`);
                });
                return arr.join(',');
            }
        },
        watch: {
            $route(newVal, oldVal) {
                if (newVal.path === '/sheetss') {
                    if (newVal.path === oldVal.path) {
                        this.initPage();
                    }
                    if (newVal.path != oldVal.path && newVal.query.type != sessionStorage.getItem('sheetssPageType')) {
                        this.initPage();
                    }
                    // if (newVal.path != oldVal.path && newVal.query.devId) {
                    //     this.initPage();
                    // }
                    sessionStorage.setItem('sheetssPageType', newVal.query.type);
                }
            },
            battalionCode(val) {
                this.squadronCode = '';
                if (val == '') {
                    this.squadronList = [];
                } else {
                    //所属中队
                    this.getDataInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfoV2.htm`, { parentId: val }).then(res => {
                        this.squadronList = res.resultList || [];
                    });
                }
            },
        },
        data() {
            return {
                title: '',
                token: "",
                listUrl: {},
                times: "",
                declareId: '',
                roadName: '',
                battalionCode: '',
                battalionList: [],
                squadronCode: '',
                squadronList: [],
                reptypeCode: "",
                reptypeList: [],
                facTypeCode: '',
                facTypeList: [],

                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                detailInfo: {},
                dialogAnnexVisible: false, // 附件
                fileList: [],
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
                    repStartDate: this.times ? `${this.times[0]} 00:00:00` : "",
                    repEndDate: this.times ? `${this.times[1]} 23:59:59` : "",
                    repDeptId: this.departCode,
                    type: this.typeCode,
                    signsWorkordersId: this.declareId,
                    repairType: this.reptypeCode, // 维修类型
                    devTypeCode: this.facTypeCode, //设施类别
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
                    path: "/detsheetss",
                    query: { pre: this.title, id: item.signsWorkordersId, isread: type }
                });
            },
            printing(item) {
                window.open(`./lxd.html?id=${item.signsWorkordersId}&token=${this.token}`);
            },
            handleAnnex(item) {
                this.dialogAnnexVisible = true;
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
            handleDownload(e) {
                window.location.href = e.downloadPath || e.fileUrl;
            },
            // 页面初始化
            initPage() {
                this.times = "";
                this.declareId = "";
                this.roadName = '';
                this.battalionCode = '';
                this.squadronCode = '';
                this.reptypeCode = '';
                this.facTypeCode = '';

                this.queryConditions = {};
                this.tableData = [];
                this.detailInfo = {};
                this.$refs.layout.conditionVisible = false;
                this.token = Common.getQueryString("token");

                this.listUrl.download = '';
                this.listUrl.table = `${this.$config.efoms_HOST}/SignsWorkordersInfo/getSignsWorkordersInfoPage`;
                let pageType = this.$route.query.type;
                switch (pageType) {
                    case '0':
                        this.title = '待处理联系单';
                        break;
                    case '1':
                        this.title = '已修复联系单';
                        break;
                    case '2':
                        this.title = '已验收联系单';
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

            //维修类型
            this.reptypeList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' }, { dicCode: 'REPAIRTYPE03', dicName: '优化' }, { dicCode: 'REPAIRTYPE04', dicName: '数字城管' }];
            // 设施类别
            this.facTypeList = [{ dicCode: 'REPDEVTYPE24', dicName: '电子设施' }, { dicCode: 'REPDEVTYPE21', dicName: '交通标线' }, { dicCode: 'REPDEVTYPE22', dicName: '交通护栏' }, { dicCode: 'REPDEVTYPE23', dicName: '交通标志' }, { dicCode: 'REPDEVTYPE25', dicName: '临时设施' }, { dicCode: 'REPDEVTYPE26', dicName: '其他设施' }];
            //所属大队
            this.getDataInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfoV2.htm`, { deptRank: 'DEPTRANK04' }).then(res => {
                this.battalionList = res.resultList || [];
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
            if (to.name == 'detsheetss') {
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