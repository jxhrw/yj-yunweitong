<template>
    <div class="ej-main">
        <wkLayout ref="layout" :title="'材料管理'" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" :searchMore="0" @searchTable="searchTableInfo" @searchPage="searchPageInfo">

            <template slot="condFirst">
                <el-col :span="7">
                    <label>所属标段</label>
                    <mInput :list="contractList" :code.sync="contractId" getAttr="contractId" showAttr="contractName" @keyup.enter.native="searchTableInfo"></mInput>
                </el-col>
                <el-col :span="7">
                    <label>标段年份</label>
                    <el-date-picker v-model="times" type="year" value-format="yyyy" placeholder="选择年" size='mini' class="content-date content-year" @keyup.enter.native="searchTableInfo">
                    </el-date-picker>
                </el-col>
                <el-col :span="7">
                    <label>材料名称</label>
                    <el-input v-model="materialName" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                </el-col>
            </template>

            <template slot="tableBtn">
                <div class="operation export" @click="conchange({})">
                    <p>添加</p>
                </div>
                <div class="operation export" @click="exportExcel">
                    <p>导出</p>
                </div>
                <div class="operation export" @click="$refs.templateImp.click()">
                    <p>导入</p>
                    <input type="file" name="" id="templateImp" style="display:none" ref="templateImp" @change="importExcel">
                </div>
                <div class="operation export" @click="downloadTemplate" style="width:60px;">
                    <p>下载模板</p>
                </div>
            </template>

            <template slot="table">
                <el-table :highlight-current-row="true" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table-column prop="contractName" label="标段" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contractYear" label="年份" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="materialName" label="材料名称" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="materialSpecification" label="规格" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="materialUnit" label="单位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="materialUnitPrice" label="单价" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contractBeginTime" label="启用时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column prop="contractEndTime" label="停用时间" show-overflow-tooltip min-width="120"></el-table-column>
                    <el-table-column label="操作" show-overflow-tooltip min-width="115">
                        <template slot-scope="scope">
                            <div class="tab-operation" @click="conchange(scope.row,'edit')">修改</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="添加/修改" :visible.sync="detailVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                    <div class="dialog-main">
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>所属标段</label>
                            <mInput :list="contractList" :code.sync="detailInfo.contractId" :name.sync="contractName" getAttr="contractId" showAttr="contractName" class="dialog-select"></mInput>
                        </div>
                        <!-- <div class="revoke-reason">
                            <label class="dialog-label">年份</label>
                            <el-date-picker v-model="detailInfo.contractYear" type="year" value-format="yyyy" placeholder="选择年" size='mini' class="dialog-select">
                            </el-date-picker>
                        </div> -->
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>材料名称</label>
                            <el-input v-model="detailInfo.materialName" size='mini' class="dialog-select"></el-input>
                        </div>
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>规格</label>
                            <el-input v-model="detailInfo.materialSpecification" size='mini' class="dialog-select"></el-input>
                        </div>
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>单位</label>
                            <el-input v-model="detailInfo.materialUnit" size='mini' class="dialog-select"></el-input>
                        </div>
                        <div class="revoke-reason">
                            <label class="dialog-label"><span>*</span>单价</label>
                            <el-input v-model="detailInfo.materialUnitPrice" size='mini' class="dialog-select" placeholder="单位（元）"></el-input>
                        </div>
                        <!-- <div class="revoke-reason">
                            <label class="dialog-label">使用时间</label>
                            <el-date-picker v-model="weeks" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" size='mini' class="dialog-select">
                            </el-date-picker>
                        </div> -->
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
        data() {
            return {
                title: '',
                token: "",
                key: "",
                times: "",
                materialName: '',
                contractId: '',
                contractList: [],
                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                detailVisible: false,
                isAjaxing: false,
                detailInfo: {},
                contractName: '',
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
                    contractId: this.contractId,
                    contractYear: this.times,
                    materialName: this.materialName,
                };
                this.searchPageInfo();
            },
            searchPageInfo() {
                // console.log("page");
                this.tableData = [];
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/MaterialInfo/getAssentFileInfoPage`, this.queryConditions, { token: this.token })
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
                        this.isTableLoading = false;
                        Common.printErrorLog(err);
                    });
            },
            exportExcel() {
                let host = this.$config.efoms_HOST;
                let method = "/MaterialInfo/export";
                let obj = JSON.parse(JSON.stringify(this.queryConditions));
                this.$api
                    .getMethod(host, method, obj, this.token)
                    .then(res => {
                        window.open(res.resultList.path);
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            importExcel() {
                var formData = new FormData();
                var file = document.getElementById('templateImp').files[0];
                formData.append("file", file);
                document.getElementById('templateImp').value = '';
                this.$api.postMethod(
                        this.$config.efoms_HOST,
                        "/MaterialInfo/import",
                        formData,
                        this.token
                    )
                    .then(res => {
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.searchTableInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            downloadTemplate() {
                window.open(`./static/材料导入模板.xlsx`);
            },
            currentSelect(e) {},
            conchange(item, type) {
                this.detailVisible = true;
                this.$nextTick(() => {
                    this.detailInfo = JSON.parse(JSON.stringify(item));
                    this.contractName = item.contractName || '';
                    // if (item.contractBeginTime && item.contractEndTime) {
                    //     this.weeks = [item.contractBeginTime, item.contractEndTime];
                    // } else if (item.contractBeginTime) {
                    //     this.weeks = [item.contractBeginTime, ''];
                    // } else if (item.contractEndTime) {
                    //     this.weeks = ['', item.contractEndTime];
                    // } else {
                    //     this.weeks = '';
                    // }
                });
            },
            saveItem() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (!this.detailInfo.contractId) {
                    Common.ejMessage("warning", "所属标段必填");
                    return;
                }
                if (!this.detailInfo.materialName) {
                    Common.ejMessage("warning", "材料名称必填");
                    return;
                }
                if (!this.detailInfo.materialSpecification) {
                    Common.ejMessage("warning", "规格必填");
                    return;
                }
                if (!this.detailInfo.materialUnit) {
                    Common.ejMessage("warning", "单位必填");
                    return;
                }
                if (!this.detailInfo.materialUnitPrice) {
                    Common.ejMessage("warning", "单价必填");
                    return;
                }
                if (!(/^\d+(\.\d{1,2})?$/.test(this.detailInfo.materialUnitPrice))) {
                    Common.ejMessage("warning", "单价最多2位小数");
                    return;
                }
                // if (!(this.weeks && this.weeks.length > 1)) {
                //     Common.ejMessage("warning", "标段周期必填");
                //     return;
                // }
                this.detailInfo.contractName = this.contractName;
                // this.detailInfo.contractBeginTime = this.weeks ? this.weeks[0] : '';
                // this.detailInfo.contractEndTime = this.weeks ? this.weeks[1] : '';
                let murl = '';
                if (this.detailInfo.materialId) {
                    murl = '/MaterialInfo/updateMaterialInfo';
                } else {
                    murl = '/MaterialInfo/insertMaterialInfo';
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
                this.$confirm('确认删除该条合同吗？', '操作提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$api.delete(`${this.$config.efoms_HOST}/MaterialInfo/deleteMaterialInfoById`, { materialId: item.materialId }, { token: this.token })
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

                this.$api.get(`${this.$config.efoms_HOST}/ContractInfo/getContractInfoList`, {}, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.contractList = res.resultList || [];
                        } else {
                            Common.printErrorLog(res);
                        }
                    });
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.initPage();
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