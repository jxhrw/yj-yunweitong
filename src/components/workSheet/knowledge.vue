<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="'知识库'" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
            <template slot="pageBtn">
                <div class="ej-content-goto" @click="dataDetail({},'edit')">
                    <p>添加</p>
                </div>
            </template>
            <template slot="condFirst">
                <el-col :span="7">
                    <label>创建日期</label>
                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>

                <el-col :span="7">
                    <label>标题</label>
                    <el-input v-model="titleName" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>分类</label>
                    <mInput :list="typeList" :code.sync="typeCode" :name.sync="typeName" :clearable="true" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
            </template>

            <template slot="condSecond">
                <el-col :span="7">
                    <label>关键字</label>
                    <el-input v-model="key" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>创建人</label>
                    <el-input v-model="createPerson" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>状态</label>
                    <mInput :list="statusList" :code.sync="statusCode" :name.sync="statusName" @keyup.enter.native="searchTableInfo" :clearable="false"></mInput>
                </el-col>
            </template>

            <template slot="table">
                <el-table :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column prop="knowledgeId" label="编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="typeName" label="分类" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="titleName" label="标题" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="keyWord" label="关键字" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="" label="发布状态" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.isDelete?'已停用':'已发布'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createPersonName" label="创建人" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="updateDate" label="更新时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <!-- <el-table-column prop="" label="浏览数" show-overflow-tooltip></el-table-column> -->
                    <el-table-column label="操作" min-width="120">
                        <template slot-scope="scope">
                            <div class="tab-operation" @click="dataDetail(scope.row,'edit')">修改</div>
                            <div v-if="!scope.row.isDelete" class="tab-operation" @click="updateStatus(scope.row,'1')">停用</div>
                            <div v-else class="tab-operation" @click="updateStatus(scope.row,'0')">启用</div>
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
    export default {
        components: {
            WkLayout,
            mInput
        },
        watch: {
            $route(newVal, oldVal) {
                if (newVal.path === oldVal.path && newVal.path === '/knowledge') {
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
                createPerson: '',
                titleName: '',
                typeCode: '',
                typeName: '',
                typeList: [],
                statusCode: "",
                statusName: "",
                statusList: [],
                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                detailInfo: {},
                isAjaxing: false
            };
        },
        methods: {
            searchTableInfo() {
                console.log("table");
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = {
                    pageSize: pageSize,
                    currentPage: 1,
                    startTime: this.times ? `${this.times[0]} 00:00:00` : "",
                    endTime: this.times ? `${this.times[1]} 23:59:59` : "",
                    titleName: this.titleName,
                    typeCode: this.typeCode,
                    keyWord: this.key,
                    createPersonName: this.createPerson,
                    isDelete: this.statusCode
                };
                this.searchPageInfo();
            },
            searchPageInfo() {
                console.log("page");
                this.tableData = [];
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/Knowledge/getKnowledgeInfoPage`, this.queryConditions, { token: this.token })
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
            currentSelect(e) {
                console.log(e);
                this.detailInfo = e || {};
            },
            dataDetail(item, type) {
                if (type == 'edit') {
                    sessionStorage.setItem('relaodPage', '1'); // 返回需要刷新当前页数据
                }
                this.$router.push({
                    path: "/detKnow",
                    query: { id: item.knowledgeId, isread: type }
                });
            },
            updateStatus(item, type) {
                this.$confirm('确认更改发布状态吗？', '操作提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {

                    if (this.isAjaxing) {
                        alert('数据请求中，请稍等！');
                        return;
                    }
                    let obj = {
                        knowledgeId: item.knowledgeId,
                        isDelete: type == '1'
                    };
                    let murl = `${this.$config.efoms_HOST}/Knowledge/updateKnowledgeInfo?token=${this.token}`;
                    this.isAjaxing = true;
                    this.$api.post(murl, obj, { token: this.token }).then(res => {
                            this.isAjaxing = false;
                            if (res.appCode == 0) {
                                Common.ejMessage('success', `知识更新成功`);
                                this.searchPageInfo();
                            } else {
                                Common.printErrorLog(res);
                            }
                        })
                        .catch(err => {
                            this.isAjaxing = false;
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
                this.key = "";
                this.times = "";
                this.titleName = "";
                this.createPerson = "";
                this.typeCode = "";
                this.statusCode = "";
                this.queryConditions = {};
                this.detailInfo = {};
                this.$refs.layout.conditionVisible = false;
                this.token = Common.getQueryString("token");

                this.searchTableInfo();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            // 分类
            this.typeList = [{ dicCode: '1', dicName: '考核制度' }, { dicCode: '2', dicName: '经验交流' }, { dicCode: '3', dicName: '点位相关' }, { dicCode: '4', dicName: '其他' }];
            // 状态
            this.statusList = [{ dicCode: '', dicName: '全部' }, { dicCode: '0', dicName: '已发布' }, { dicCode: '1', dicName: '已停用' }];
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
            if (to.name == 'detKnow') {
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