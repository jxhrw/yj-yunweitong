<template>
    <div class="ej-main">
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>{{title}}</h2>
                <div class="ej-content-black" @click="goBack">
                    <p>返回</p>
                </div>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div class="base-info">
                        <!-- <div class="title">
                            <h3>基础属性</h3>
                        </div> -->
                        <div class="content">
                            <el-row class="content-row-select lager-label">
                                <el-col :span="10">
                                    <label><i class="redStar">*</i>合同名称</label>
                                    <el-input v-model="contractName" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <label>合同编号</label>
                                    <span>{{contractInfo.contractId||'--'}}</span>
                                </el-col>
                                <el-col :span="10">
                                    <label>合同开始时间</label>
                                    <el-date-picker v-model="contractBeginTime" type="date" size='mini' class="content-date" value-format="yyyy-MM-dd 00:00:00" :disabled="isOnlyRead"></el-date-picker>
                                </el-col>
                                <el-col :span="10">
                                    <label>合同接收时间</label>
                                    <el-date-picker v-model="contractEndTime" type="date" size='mini' class="content-date" value-format="yyyy-MM-dd 23:59:59" :disabled="isOnlyRead"></el-date-picker>
                                </el-col>
                                <el-col :span="10">
                                    <label>合同金额</label>
                                    <el-input v-model="contractMoney" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="true"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <label>设施类型</label>
                                    <mInput :list="facTypeList" :code.sync="facTypeCode" :name.sync="facTypeName" :disabled="isOnlyRead" :clearable="true">
                                    </mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>区域</label>
                                    <mSelectMult :list="areaList" :code.sync="areaCode" :name.sync="areaName" showAttr="regionName" getAttr="regionId" :showAll="false"></mSelectMult>
                                </el-col>
                                <el-col :span="10">
                                    <label>所属大队</label>
                                    <mInput :list="battalionList" :code.sync="deptId" :name.sync="deptName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead">
                                    </mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>中标部门</label>
                                    <mInput :list="contractDeptList" :code.sync="contractDept" :name.sync="contractDeptName" showAttr="opsDeptName" getAttr="opsDeptId" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>责任人</label>
                                    <mInput :list="resPersonList" :code.sync="resPerson" :name.sync="resPersonName" showAttr="opsPersonName" getAttr="opsPersonId" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="ej-content-operation" v-if="!isOnlyRead">
                <div class="submit" @click="submitForm">
                    <p>提交</p>
                </div>
                <div class="reset" @click="resetInfo">
                    <p>重置</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import mInput from "components/common/selectDrop";
    import mTree from "components/common/inputTree";
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    import mSelectMult from "@/components/common/selectMult";
    export default {
        components: {
            mInput,
            mTree,
            mSelectMult
        },
        data() {
            return {
                title: "",
                token: "",
                contractName: '',
                deptId: '',
                deptName: '',
                battalionList: [],
                resPerson: '',
                resPersonName: '',
                resPersonList: [],
                contractDept: '',
                contractDeptName: '',
                contractDeptList: [],
                contractBeginTime: '',
                contractEndTime: '',
                contractMoney: '',
                facTypeCode: '',
                facTypeName: '',
                facTypeList: [],
                areaCode: [],
                areaName: [],
                areaList: [],

                contractInfo: {}, // 合同信息
                isOnlyRead: false,
                isAjaxing: false, //是否在请求中
            };
        },
        watch: {
            'contractInfo.contractId'(val) {
                this.changeTitle();
            },
            contractDept(val) {
                let hasCode = true;
                if (!val) {
                    this.resPersonList = [];
                    // 以下无匹配时责任人清空
                    hasCode = this.resPersonList.some(res => res.opsPersonId == this.resPerson);
                    if (!hasCode) {
                        this.resPerson = '';
                        this.resPersonName = '';
                    }
                    return;
                }
                //责任人
                this.getDicInfo(`${this.$config.ubms_HOST}/OpsPerson/getOpsPersonInfo.htm`, { opsDeptId: val }).then(res => {
                    this.resPersonList = res.resultList || [];
                    // 以下无匹配时责任人清空
                    hasCode = this.resPersonList.some(res => res.opsPersonId == this.resPerson);
                    if (!hasCode) {
                        this.resPerson = '';
                        this.resPersonName = '';
                    }
                });
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.isOnlyRead = !this.$route.query.isread;
            this.changeTitle();

            //所属大队
            let p1 = new Promise((resolve, reject) => {
                this.getDataInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfoV2.htm`, { deptRank: 'DEPTRANK04' }).then(res => {
                    this.battalionList = res.resultList || [];
                    resolve(res);
                });;
            })
            //维护单位
            let p2 = new Promise((resolve, reject) => {
                this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptTreeRoot.htm`, { deptTypeCode: 'OPSDEPTTYPE01,OPSDEPTTYPE03' }).then(res => {
                    this.contractDeptList = res.resultList || [];
                    resolve(res);
                });
            })
            //区域
            let p3 = new Promise((resolve, reject) => {
                this.getDicInfo(`${this.$config.ubms_HOST}/RegionInfo/getRegionInfo.htm`, {}).then(res => {
                    this.areaList = res.resultList || [];
                });
            })
            // 设施类型
            this.facTypeList = [];
            Promise.all([p1, p2, p3]).then((res) => {
                this.getContractInfo();
            }).catch((error) => {
                this.getContractInfo();
            });
        },
        methods: {
            submitForm() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (!this.contractName || this.contractName == "") {
                    Common.ejMessage("warning", "合同名称必填");
                    return;
                }
                let obj = {
                    contractId: this.contractInfo.contractId,
                    contractName: this.contractName,
                    deptId: this.deptId,
                    deptName: this.deptName,
                    contractBeginTime: this.contractBeginTime,
                    contractEndTime: this.contractEndTime,
                    resPerson: this.resPerson,
                    resPersonName: this.resPersonName,
                    contractDept: this.contractDept,
                    contractDeptName: this.contractDeptName,
                    contractMoney: this.contractMoney,
                    aaaa: this.facTypeCode,
                    aaab: this.facTypeName,
                    bbba: this.areaCode.join(','),
                    bbbb: this.areaName.join(',')
                };

                let murl = `${this.$config.efoms_HOST}/ContractInfo/insertContractInfo`;
                if (this.contractInfo.contractId) {
                    murl = `${this.$config.efoms_HOST}/ContractInfo/updateContractInfo`;
                }

                this.isAjaxing = true;
                this.$api.post(murl, obj, { token: this.token }).then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.$set(this.contractInfo, 'contractId', res.resultList);
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            resetInfo() {
                this.contractName = this.contractInfo.contractName || '';
                this.deptId = this.contractInfo.deptId || '';
                this.deptName = this.contractInfo.deptName || '';
                this.contractBeginTime = this.contractInfo.contractBeginTime || '';
                this.contractEndTime = this.contractInfo.contractEndTime || '';
                this.resPerson = this.contractInfo.resPerson || '';
                this.resPersonName = this.contractInfo.resPersonName || '';
                this.contractDept = this.contractInfo.contractDept || '';
                this.contractDeptName = this.contractInfo.contractDeptName || '';
                this.contractMoney = this.contractInfo.contractMoney || '';

                this.facTypeCode = this.contractInfo.ccca || '';
                this.facTypeName = this.contractInfo.cccb || '';
                let code = this.contractInfo.ddda || '';
                let name = this.contractInfo.dddb || '';
                this.areaCode = code ? code.split(',') : [];
                this.areaName = name ? name.split(',') : [];
            },
            changeTitle() {
                if (this.$route.query.isread == 'edit') {
                    this.title = '合同修改';
                } else if (this.$route.query.isread == 'add') {
                    this.title = this.contractInfo.contractId ? '合同修改' : '合同新增';
                } else if (!this.$route.query.isread) {
                    this.title = '合同查看';
                }
            },
            goBack() {
                window.history.back();
            },
            getContractInfo() {
                if (!this.$route.query.id) {
                    return;
                }
                this.$api.get(`${this.$config.efoms_HOST}/ContractInfo/getContractInfo`, { contractId: this.$route.query.id }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.contractInfo = res.resultList || {};
                            this.resetInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
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
        }
    };
</script>


<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/less/baseInfo.less";
    @import "../../assets/less/depiction.less";
    @import "../../assets/less/dialog.less";

    .base-info .content {
        .content-row-select {
            /deep/ .el-col {
                margin-bottom: 15px;
            }

            /deep/ .d-select {
                width: 300px;
            }

            span {
                line-height: 28px;
            }

            .content-date {
                width: 300px;
                border: 0;

                /deep/ .el-input__inner {
                    border-radius: 0;
                    background: #F9FAFC;
                    border: 1px solid #E1E7ED;
                }
            }
        }

        .lager-label {
            label {
                width: 80px;
            }
        }

        /deep/ .el-input.is-disabled .el-input__inner {
            color: #737e84;
        }

        .el-icon-location-outline {
            cursor: pointer;
        }
    }

    .depiction-info .content {
        .content-row-img {
            /deep/ .el-image__error {
                font-size: 12px;
            }
        }

        /deep/ .el-textarea.is-disabled .el-textarea__inner {
            color: #737e84;
        }

        .audit-list {
            font-size: 12px;
            color: #4f5a64;

            .adetail {
                display: flex;

                span {
                    width: 200px;

                    &.explain {
                        flex: 1;
                    }
                }
            }
        }
    }

    .redStar {
        color: red;
        padding-top: 6px;
        // float: left;
        position: relative;
        width: 0;
        left: -4px;
    }
</style>

<style lang="less">
    @import "../../assets/less/tBaseInfo.less";
    @import "../../assets/less/tDepiction.less";
    @import "../../assets/less/tAll.less";

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>