<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="'点位校准'" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="1" @searchTable="searchTableInfo" @searchPage="searchPageInfo">
            <template slot="condFirst">
                <el-col :span="7">
                    <label>设备编号</label>
                    <el-input v-model="key" placeholder="设备编号" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
                <el-col :span="7">
                    <label>时间</label>
                    <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size='mini' class="content-date" value-format="yyyy-MM-dd" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
                <el-col :span="7">
                    <label>处理结果</label>
                    <mInput :list="typeList" :code.sync="typeCode" :name.sync="typeName" :clearable="true" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
            </template>

            <template slot="condSecond">
                <el-col :span="7">
                    <label>所属系统</label>
                    <mInput :list="systemList" :code.sync="systemCode" :name.sync="systemName" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
            </template>

            <!-- <template slot="tableBtn">
                <div class="operation export" @click="exportExcel">
                    <p>导出</p>
                </div>
            </template> -->

            <template slot="table">
                <el-table :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="deviceId" label="设备编号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip></el-table-column>
                    <el-table-column label="处理结果" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.dealResult == '1'?'已处理':'未处理'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="deviceTypeName" label="所属系统" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <div v-if="scope.row.dealResult != '1'" class="tab-operation" @click="dataDetail(scope.row)">审核</div>
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
                if (newVal.path === oldVal.path && newVal.path === '/calibration') {
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
                systemCode: "",
                systemName: "",
                systemList: [],
                typeCode: '',
                typeName: '',
                typeList: [],
                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                detailInfo: {},
            };
        },
        methods: {
            searchTableInfo() {
                console.log("table");
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = {
                    pageSize: pageSize,
                    currentPage: 1,
                    deviceId: this.key,
                    startTime: this.times ? this.times[0] : "",
                    endTime: this.times ? this.times[1] : "",
                    deviceTypeCode: this.systemCode,
                    dealResult: this.typeCode
                };
                this.searchPageInfo();
            },
            searchPageInfo() {
                console.log("page");
                this.tableData = [];
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/deviceConfirm/pageDeviceConfirm`, this.queryConditions, { token: this.token })
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
                let method = "/export/exportWorkorders";
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
            currentSelect(e) {
                console.log(e);
                this.detailInfo = e || {};
            },
            dataDetail(item) {
                sessionStorage.setItem('relaodPage', '1'); // 返回需要刷新当前页数据
                this.$router.push({
                    path: "/detCab",
                    query: { id: item.deviceId, type: item.deviceTypeCode }
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
                this.systemCode = "";
                this.systemName = "";
                this.typeCode = "";
                this.typeName = "";
                this.queryConditions = {};
                this.detailInfo = {};
                this.$refs.layout.conditionVisible = false;
                this.token = Common.getQueryString("token");
                this.typeList = [{ dicCode: '0', dicName: '未处理' }, { dicCode: '1', dicName: '已处理' }];
                this.typeCode = this.typeList[0].dicCode;
                this.typeName = this.typeList[0].dicName;

                this.searchTableInfo();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            //所属系统
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPDEVCATEGORY01"
            }).then(res => {
                this.systemList = res.resultList || [];
            });
            // this.typeList = [{ dicCode: '0', dicName: '未处理' }, { dicCode: '1', dicName: '已处理' }];
            // this.$nextTick(() => {
            //     this.typeCode = this.typeList[0].dicCode;
            //     this.typeName = this.typeList[0].dicName;
            // });
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
            if (to.name == 'detCab') {
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