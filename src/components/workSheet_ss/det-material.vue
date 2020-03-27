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
                                    <label><i class="redStar">*</i>材料名称</label>
                                    <el-input v-model="materialName" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <label>材料编号</label>
                                    <span>{{materialInfo.materialId}}</span>
                                </el-col>

                                <el-col :span="10">
                                    <label>数量</label>
                                    <el-input v-model="materialNum" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="true"></el-input>
                                </el-col>

                                <el-col :span="10">
                                    <label>类型</label>
                                    <!-- <mInput :list="materialTypeList" :code.sync="materialType" :name.sync="materialTypeName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead">
                                    </mInput> -->
                                    <el-input v-model="materialTypeName" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="true"></el-input>
                                </el-col>

                                <el-col :span="10">
                                    <label>单位</label>
                                    <el-input v-model="materialUnit" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="true"></el-input>
                                </el-col>

                                <el-col :span="10">
                                    <label>单位价格</label>
                                    <el-input v-model="materialUnitPrice" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="true"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <label>规格</label>
                                    <el-input v-model="materialSpecification" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="true"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <label>所属合同</label>
                                    <mInput :list="contractList" :code.sync="contractId" :name.sync="contractName" showAttr="contractName" getAttr="contractId" :disabled="isOnlyRead">
                                    </mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>所属大队</label>
                                    <mInput :list="battalionList" :code.sync="deptId" :name.sync="deptName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead">
                                    </mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>采购时间</label>
                                    <el-date-picker v-model="procurementTime" type="date" size='mini' class="content-date" value-format="yyyy-MM-dd" :disabled="isOnlyRead"></el-date-picker>
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
    export default {
        components: {
            mInput,
            mTree,
        },
        data() {
            return {
                title: "",
                token: "",
                materialName: '',
                materialNum: '',
                materialType: '',
                materialTypeName: '',
                materialTypeList: [],
                materialUnit: '',
                materialUnitPrice: '',
                materialSpecification: '',
                contractId: '',
                contractName: '',
                contractList: [],
                deptId: '',
                deptName: '',
                battalionList: [],
                procurementTime: '',
                materialInfo: {}, // 材料信息
                isOnlyRead: false,
                isAjaxing: false, //是否在请求中
            };
        },
        watch: {
            'materialInfo.materialId'(val) {
                this.changeTitle();
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
            //所属合同
            let p2 = new Promise((resolve, reject) => {
                this.getDicInfo(`${this.$config.efoms_HOST}/ContractInfo/getContractInfoList`, {}).then(res => {
                    this.contractList = res.resultList || [];
                    resolve(res);
                });
            })
            Promise.all([p1, p2]).then((res) => {
                this.getMaterialInfo();
            }).catch((error) => {
                this.getMaterialInfo();
            });
        },
        methods: {
            submitForm() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (!this.materialName || this.materialName == "") {
                    Common.ejMessage("warning", "材料名称必填");
                    return;
                }
                let obj = {
                    materialId: this.materialInfo.materialId,
                    materialName: this.materialName,
                    materialNum: this.materialNum,
                    materialType: this.materialType,
                    materialTypeName: this.materialTypeName,
                    materialUnit: this.materialUnit,
                    materialUnitPrice: this.materialUnitPrice,
                    materialSpecification: this.materialSpecification,
                    contractId: this.contractId,
                    contractName: this.contractName,
                    deptId: this.deptId,
                    deptName: this.deptName,
                    procurementTime: this.procurementTime,
                };

                let murl = `${this.$config.efoms_HOST}/MaterialInfo/insertMaterialInfo`;
                if (this.materialInfo.materialId) {
                    murl = `${this.$config.efoms_HOST}/MaterialInfo/updateMaterialInfo`;
                }

                this.isAjaxing = true;
                this.$api.post(murl, obj, { token: this.token }).then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.$set(this.materialInfo, 'materialId', res.resultList);
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
                this.materialName = this.materialInfo.materialName || '';
                this.materialNum = this.materialInfo.materialNum || '';
                this.materialType = this.materialInfo.materialType || '';
                this.materialTypeName = this.materialInfo.materialTypeName || '';
                this.materialUnit = this.materialInfo.materialUnit || '';
                this.materialUnitPrice = this.materialInfo.materialUnitPrice || '';
                this.materialSpecification = this.materialInfo.materialSpecification || '';
                this.contractId = this.materialInfo.contractId || '';
                this.contractName = this.materialInfo.contractName || '';
                this.deptId = this.materialInfo.deptId || '';
                this.deptName = this.materialInfo.deptName || '';
                this.procurementTime = this.materialInfo.procurementTime || '';

            },
            changeTitle() {
                if (this.$route.query.isread == 'edit') {
                    this.title = '材料修改';
                } else if (this.$route.query.isread == 'add') {
                    this.title = this.materialInfo.materialId ? '材料修改' : '材料新增';
                } else if (!this.$route.query.isread) {
                    this.title = '材料查看';
                }
            },
            goBack() {
                window.history.back();
            },
            getMaterialInfo() {
                if (!this.$route.query.id) {
                    return;
                }
                this.$api.get(`${this.$config.efoms_HOST}/MaterialInfo/getAssentFileInfoList`, { materialId: this.$route.query.id }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.materialInfo = res.resultList[0] || {};
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