<template>
    <div class="ej-main">
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>点位详情</h2>
                <div class="ej-content-black" @click="goBack">
                    <p>返回</p>
                </div>
            </div>
            <div class="ej-content-main">
                <el-scrollbar class="ej-content-scrollbar">
                    <div class="base-info">
                        <div class="title">
                            <h3>基础属性</h3>
                        </div>
                        <div class="content">
                            <el-row class="content-row-select lager-label">
                                <el-col :span="10">
                                    <label>点位名称</label>
                                    <span>{{pointInfo.deviceName}}</span>
                                </el-col>
                                <el-col :span="10">
                                    <label>点位编号</label>
                                    <span>{{pointInfo.deviceId}}</span>
                                </el-col>
                                <el-col :span="10">
                                    <label><i class="redStar">*</i>校准点位名称</label>
                                    <el-input v-model="devName" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="true"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <label>校准点位编号</label>
                                    <el-input v-model="devCode" placeholder="" size='mini' class="content-select" :disabled="true"></el-input>
                                </el-col>

                                <el-col :span="10">
                                    <label>唯一识别码</label>
                                    <el-input v-model="onlyId" placeholder="" size='mini' class="content-select" :clearable="true"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <label><i class="redStar">*</i>所属系统</label>
                                    <mInput :list="devTypeList" :code.sync="devTypeCode" :name.sync="devTypeName" :disabled="isOnlyRead">
                                    </mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label><i class="redStar">*</i>所属辖区</label>
                                    <mInput :list="areaList" :code.sync="areaCode" :name.sync="areaName" showAttr="regionName" getAttr="regionId" :disabled="isOnlyRead"></mInput>
                                </el-col>

                                <el-col :span="10">
                                    <label><i class="redStar">*</i>维护单位</label>
                                    <mInput :list="opDeptList" :code.sync="opDeptCode" :name.sync="opDeptName" showAttr="opsDeptName" getAttr="opsDeptId" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>IP地址</label>
                                    <el-input v-model="devIp" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="true"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <label>详细地址</label>
                                    <el-input v-model="address" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead">
                                        <i class="el-icon-location-outline el-input__icon" slot="suffix" @click="handleIconClick" style="font-size:16px;">
                                        </i>
                                    </el-input>
                                </el-col>

                                <el-col :span="10">
                                    <label>现管理单位</label>
                                    <mInput :list="manDeptList" :code.sync="manDeptCode" :name.sync="manDeptName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <!-- 外建单位库里没有code，根据name存值 -->
                                <el-col :span="10">
                                    <label>外建单位</label>
                                    <mInput :list="outUnitList" :code.sync="outUnitCode" :name.sync="outUnitName" showAttr="opsDeptName" getAttr="opsDeptName" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>建设单位</label>
                                    <mInput :list="conUnitList" :code.sync="conUnitCode" :name.sync="conUnitName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <!-- 施工单位库里没有code，根据name存值 -->
                                <el-col :span="10">
                                    <label>施工单位</label>
                                    <mInput :list="stuUnitList" :code.sync="stuUnitCode" :name.sync="stuUnitName" showAttr="opsDeptName" getAttr="opsDeptName" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>支队责任民警</label>
                                    <mInput :list="detPoliceList" :code.sync="detPoliceCode" :name.sync="detPoliceName" showAttr="personName" getAttr="personId" showOther="deptName" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>大队责任民警</label>
                                    <mInput :list="resPoliceList" :code.sync="resPoliceCode" :name.sync="resPoliceName" showAttr="personName" getAttr="personId" showOther="deptName" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>

                                <el-col :span="10">
                                    <label>优化审核人</label>
                                    <mInput :list="reviewersList" :code.sync="reviewersCode" :name.sync="reviewersName" showAttr="personName" getAttr="personId" showOther="deptName" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>所属监理</label>
                                    <mInput :list="supervisorList" :code.sync="supervisorCode" :name.sync="supervisorName" showAttr="opsDeptName" getAttr="opsDeptId" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>所属中队</label>
                                    <mInput :list="squadronList" :code.sync="squadronCode" :name.sync="squadronName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>建设时间</label>
                                    <el-date-picker v-model="buildTime" type="date" size='mini' class="content-date" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-col>
                                <el-col :span="10">
                                    <label>验收时间</label>
                                    <el-date-picker v-model="acceptanceTime" type="date" size='mini' class="content-date" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-col>
                                <el-col :span="10">
                                    <label>移交时间</label>
                                    <el-date-picker v-model="transferTime" type="date" size='mini' class="content-date" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-col>
                                <el-col :span="10">
                                    <label>使用年限</label>
                                    <el-input v-model="useAge" placeholder="" size='mini' class="content-select" :clearable="true"></el-input>
                                </el-col>
                                <el-col :span="10">
                                    <label>质保到期时间</label>
                                    <el-date-picker v-model="shelfLiefTime" type="date" size='mini' class="content-date" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-col>
                                <el-col :span="10">
                                    <label>项目属性</label>
                                    <mInput :list="attributeList" :code.sync="attributeCode" :name.sync="attributeName" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>所属项目</label>
                                    <mInput :list="underList" :code.sync="underCode" :name.sync="underName" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="10">
                                    <label>点位状态</label>
                                    <mInput :list="statusList" :code.sync="statusCode" :name.sync="statusName" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>

                            </el-row>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <div class="ej-content-operation" v-if="!isOnlyRead && pointInfo.dealResult != '1'">
                <div class="submit" @click="dialogCalibrationVisible = true">
                    <p>校准点位</p>
                </div>
                <div class="submit" @click="submitForm">
                    <p>提交</p>
                </div>
                <div class="reset" @click="resetRepair">
                    <p>关闭</p>
                </div>
            </div>

            <el-dialog title="定位" :visible.sync="dialogMapVisible" width='560px' class="dialog-urge">
                <div class="dialog-main">
                    <div class="revoke-reason">
                        <el-input v-model="loactName" placeholder="" size='mini' class="content-select" style="width: 450px;" :clearable="true" @keyup.enter.native="searchLocat"></el-input>
                        <el-button @click="searchLocat" size='mini' class="submit">搜索</el-button>
                    </div>
                    <div>
                        <div class="mapBox" id="mapContainer" style="width:100%;height:300px;"></div>
                        <div id="searchResults"></div>
                    </div>
                    <div style="margin-top: 10px;">
                        <label class="dialog-label">选中地址</label>
                        <el-input v-model="selectLocat" placeholder="" size='mini' class="content-select" style="width: 450px;" :clearable="true"></el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="()=>{address = selectLocat; coordinate.x = selectLnglat.x; coordinate.y = selectLnglat.y; dialogMapVisible = false;}" size='mini' class="submit">提 交</el-button>
                    <el-button @click="dialogMapVisible = false" size='mini' class="cancel">取 消</el-button>
                </div>
            </el-dialog>

            <DialogCalibration :dialogVisible.sync="dialogCalibrationVisible" :cabCode="devTypeCode" :cabName="devTypeName" @callback="resetInfo"></DialogCalibration>
        </div>
    </div>
</template>
<script>
    import mInput from "components/common/selectDrop";
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    import DialogCalibration from "./business/dialog-calibration";
    var MAPCONTAIN; // 地图实例
    export default {
        components: {
            mInput,
            DialogCalibration
        },
        data() {
            return {
                title: "",
                token: "",
                coordinate: {}, //坐标
                devName: '',
                devCode: '',
                devTypeCode: '',
                devTypeName: '',
                devTypeList: [],
                areaCode: '',
                areaName: '',
                areaList: [],
                devIp: '',
                address: '',
                opDeptCode: '',
                opDeptName: '',
                opDeptList: [],
                manDeptCode: '',
                manDeptName: '',
                manDeptList: [],
                outUnitCode: '',
                outUnitName: '',
                outUnitList: [],
                conUnitCode: '',
                conUnitName: '',
                conUnitList: [],
                stuUnitCode: '',
                stuUnitName: '',
                stuUnitList: [],
                detPoliceCode: '',
                detPoliceName: '',
                detPoliceList: [],
                resPoliceCode: '',
                resPoliceName: '',
                resPoliceList: [],
                reviewersCode: '',
                reviewersName: '',
                reviewersList: [],
                supervisorCode: '',
                supervisorName: '',
                supervisorList: [],
                squadronCode: '',
                squadronName: '',
                squadronList: [],
                buildTime: '',
                acceptanceTime: '',
                transferTime: '',
                attributeCode: '',
                attributeName: '',
                attributeList: [],
                underCode: '',
                underName: '',
                underList: [],
                statusCode: '',
                statusName: '',
                statusList: [],
                onlyId: '',
                shelfLiefTime: '',
                useAge: '',

                pointInfo: { dealResult: '1' }, // 点位信息
                isWarning: false,
                isOnlyRead: false,
                isAjaxing: false, //是否在请求中
                dialogMapVisible: false,
                allMarkers: [], // 地图上当前所有的点
                loactName: '',
                selectLocat: '', //地图弹窗选中的地址
                selectLnglat: {}, // 地图弹窗选中的坐标
                dialogCalibrationVisible: false,
            };
        },
        watch: {
            onlyId(val) {
                // this.onlyId = val.replace(/[^\d]/g, '');
            },
            useAge(val) {
                this.useAge = val ? val.replace(/[^\d|.]/g, '') : val;
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.getPointInfo();

            //所属系统
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { parentCode: "REPDEVCATEGORY01" }).then(res => {
                this.devTypeList = res.resultList || [];
            });
            //所属辖区
            this.getDicInfo(`${this.$config.ubms_HOST}/RegionInfo/getRegionInfo.htm`, {}).then(res => {
                this.areaList = res.resultList || [];
            });
            //维护单位，外建单位，施工单位
            this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptTreeRoot.htm`, {}).then(res => {
                this.opDeptList = res.resultList || [];
                this.outUnitList = res.resultList || [];
                this.stuUnitList = res.resultList || [];
            });
            //管理单位，建设单位，所属中队
            this.getDicInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfo.htm`, {}).then(res => {
                this.manDeptList = res.resultList || [];
                this.conUnitList = res.resultList || [];
                this.squadronList = res.resultList || [];
            });
            // 所属项目
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { parentCode: "DEVICEPROJECT" }).then(res => {
                this.underList = res.resultList || [];
            });
            // 点位状态
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { parentCode: "DEVICESTATUS" }).then(res => {
                this.statusList = res.resultList || [];
            });

            // 监理单位
            this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptInfo.htm`, { "deptTypeCode": 'OPSDEPTTYPE04' }).then(res => {
                this.supervisorList = res.resultList || [];
            });

            //项目属性
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { parentCode: "DEVICEOPPMTYPE" }).then(res => {
                this.attributeList = res.resultList || [];
            });

            // 支队责任民警,优化审核人
            this.getDicInfo(`${this.$config.ubms_HOST}/Person/getPersonInfo.htm`, { deptRank: 'DEPTRANK03' }).then(res => {
                this.detPoliceList = res.resultList || [];
                this.reviewersList = res.resultList || [];

                console.log(res.resultList.length)
            });

            // 大队责任民警
            this.getDicInfo(`${this.$config.ubms_HOST}/Person/getPersonInfo.htm`, { deptRank: 'DEPTRANK04' }).then(res => {
                this.resPoliceList = res.resultList || [];

                console.log(res.resultList.length)
            });

        },
        methods: {
            submitForm() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (!this.devName || this.devName == "") {
                    Common.ejMessage("warning", "点位名称必填");
                    return;
                }
                // if (this.onlyId == "") {
                //     Common.ejMessage("warning", "唯一识别码必填");
                //     return;
                // }
                if (!this.devTypeCode || this.devTypeCode == "") {
                    Common.ejMessage("warning", "所属系统必填");
                    return;
                }
                if (!this.areaCode || this.areaCode == "") {
                    Common.ejMessage("warning", "所属辖区必填");
                    return;
                }
                if (!this.opDeptCode || this.opDeptCode == "") {
                    Common.ejMessage("warning", "维护单位必填");
                    return;
                }

                let obj = {
                    deviceId: this.devCode,
                    devName: this.devName, //设备名称；
                    manageId: this.onlyId,
                    devTypeCode: this.devTypeCode,
                    areaId: this.areaCode,
                    areaName: this.areaName,
                    ip: this.devIp,
                    x: this.coordinate.x ? (this.coordinate.x + '') : undefined,
                    y: this.coordinate.y ? (this.coordinate.y + '') : undefined,
                    siteDescrible: this.address,
                    oppmDept: this.opDeptCode,
                    manageDept: this.manDeptCode,
                    outsideCompany: this.outUnitCode,
                    company: this.conUnitCode,
                    constructionCompany: this.stuUnitCode,
                    detaResPolice: this.detPoliceCode,
                    briResPolice: this.resPoliceCode,
                    optimizeReviewer: this.reviewersCode,
                    supervison: this.supervisorCode,
                    squadron: this.squadronCode,
                    buildDate: this.buildTime ? (this.buildTime + ' 00:00:00') : '',
                    checkDate: this.acceptanceTime ? (this.acceptanceTime + ' 00:00:00') : '',
                    overTime: this.transferTime ? (this.transferTime + ' 00:00:00') : '',
                    useAge: this.useAge,
                    shelfLief: this.shelfLiefTime ? (this.shelfLiefTime + ' 00:00:00') : '',
                    oppmType: this.attributeCode,
                    project: this.underCode,
                    deviceStatusCode: this.statusCode,

                    // 相关code值从维修申报中参考
                    workOrder: {
                        typeCode: "REPAIRTYPE01",
                        typeName: "维修",
                        repSourceCode: "REPAIRSSOURCE06",
                        repSourceName: "其他来源",
                        failureDescrible: "点位校准生成"
                    }
                };

                let murl = `${this.$config.efoms_HOST}/UbmsAddInfo/addUbmsInfo`;
                if (this.pointInfo.deviceId != this.devCode) {
                    murl = `${this.$config.efoms_HOST}/UbmsAddInfo/updateUbmsDev`;
                }

                this.isAjaxing = true;
                this.$api.get(murl, { token: this.token, mapBean: obj }, { token: this.token }).then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            this.$confirm('点位校准成功，已生成维修单?', '操作成功', {
                                confirmButtonText: '返回',
                                cancelButtonText: '关闭',
                                type: 'success'
                            }).then(() => {
                                window.history.back();
                            }).catch(() => {
                                this.$set(this.pointInfo, 'dealResult', '1');
                            });
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            resetRepair() {
                this.$confirm('确认关闭当前待处理点位吗？', '操作提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {

                    if (this.isAjaxing) {
                        alert('数据请求中，请稍等！');
                        return;
                    }

                    this.isAjaxing = true;
                    this.$api.get(`${this.$config.efoms_HOST}/deviceConfirm/dealDeviceConfirm`, { deviceId: this.pointInfo.deviceId }, { token: this.token }).then(res => {
                            this.isAjaxing = false;
                            if (res.appCode == 0) {
                                this.$confirm('当前点位已关闭', '操作成功', {
                                    confirmButtonText: '返回',
                                    cancelButtonText: '关闭',
                                    type: 'success'
                                }).then(() => {
                                    window.history.back();
                                }).catch(() => {
                                    this.$set(this.pointInfo, 'dealResult', '1');
                                });
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
            resetInfo(item) {
                console.log(item);
                this.devCode = item.devId || undefined;
                this.devName = item.devName || undefined;
                // this.onlyId = item.manageId || undefined;
                this.devTypeCode = item.devTypeCode || undefined;
                this.devTypeName = item.devTypeName || undefined;
                this.areaCode = item.devAreaCode || undefined;
                this.areaName = item.devAreaName || undefined;
                this.opDeptCode = item.oppmDept || undefined;
                this.opDeptName = item.oppmDeptName || undefined;
                this.devIp = item.devIp || undefined;
                this.address = item.siteDescrible || undefined;
                this.coordinate.x = item.longitude || undefined;
                this.coordinate.y = item.latitude || undefined;
                this.manDeptCode = item.devDeptId || undefined;
                this.outUnitCode = item.outsideCompanyName || undefined;
                this.conUnitCode = item.company || undefined;
                this.stuUnitCode = item.constructionCompanyName || undefined;
                this.detPoliceCode = item.detaResPolice || undefined;
                this.resPoliceCode = item.briResPolice || undefined;
                this.reviewersCode = item.optimizeReicewer || undefined;
                this.supervisorCode = item.supervison || undefined;
                this.squadronCode = item.squadron || undefined;
                this.buildTime = item.devBuildDate || undefined;
                this.acceptanceTime = item.checkDate || undefined;
                this.transferTime = item.overTime || undefined;
                this.useAge = item.useAge || undefined;
                this.shelfLiefTime = item.shelfLief || undefined;
                this.attributeCode = item.oppmType || undefined;
                this.underCode = item.project || undefined;
                this.statusCode = item.deviceStatus || undefined;
            },
            searchLocat() {
                let _this = this;
                this.$api.get(`${this.$config.Gaode_Map_Get}?keywords=${this.loactName}&output=json&offset=10&page=1&key=${this.$config.Gaode_Map_Key}&extensions=all`).then(res => {
                    console.log(res);
                    if (res.pois && res.pois.length > 0) {
                        MAPCONTAIN.remove(this.allMarkers); // 移除所有点
                        MAPCONTAIN.setCenter(res.pois[0].location.split(',')); // 已第一个地位居中
                        res.pois.map(item => {
                            let arr = item.location.split(',');
                            let marker = new AMap.Marker({
                                position: arr,
                                title: item.address,
                                clickable: true
                            });
                            marker.address = item.address;
                            this.allMarkers.push(marker);
                            //点标注的点击事件
                            marker.on('click', function(e) {
                                _this.selectLocat = e.target.address;
                                _this.selectLnglat = { x: e.lnglat.lng, y: e.lnglat.lat };
                            });
                            MAPCONTAIN.add(marker);
                        });
                    }
                })
            },
            handleIconClick() {
                this.dialogMapVisible = true;

                this.$nextTick(() => {
                    MAPCONTAIN = new AMap.Map('mapContainer', {
                        zoom: 10
                    });

                })
            },
            goBack() {
                window.history.back();
            },
            getPointInfo() {
                this.$api.get(`${this.$config.efoms_HOST}/deviceConfirm/pageDeviceConfirm`, { pageSize: 10, currentPage: 1, deviceId: this.$route.query.id }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.pointInfo = res.resultList.result[0] || {};
                            this.devName = this.pointInfo.deviceName;
                            this.devCode = this.pointInfo.deviceId;
                            this.onlyId = this.pointInfo.deviceId;
                            this.devTypeCode = this.pointInfo.deviceTypeCode;
                            this.devTypeName = this.pointInfo.deviceTypeName;
                            // console.log(this.devTypeCode)
                            this.automatic();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            // 自动校准
            automatic() {
                this.$api.get(`${this.$config.efoms_HOST}/deviceDetail/selectDeviceDetailInfoById`, { manageId: this.pointInfo.deviceId }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            if (res.resultList) {
                                this.resetInfo(res.resultList);
                            }
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