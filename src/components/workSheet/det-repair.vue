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
                        <div class="title">
                            <h3>基本信息</h3>
                        </div>
                        <div class="content">
                            <el-row class="content-row-select">
                                <el-col :span="9">
                                    <label>申报人</label>
                                    <span>{{repairsInfo.repPersonName || userInfo.personName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>申报单位</label>
                                    <span>{{repairsInfo.repDeptName || userInfo.orgName}}</span>
                                </el-col>

                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>所属系统</label>
                                    <mInput :list="devTypeList" :code.sync="devTypeCode" :name.sync="devTypeName" :disabled="isOnlyRead||isCanChangeDevtype">
                                    </mInput>
                                </el-col>
                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>维修类型</label>
                                    <mInput :list="tainList" :code.sync="tainCode" :name.sync="tainName" :disabled="isOnlyRead" :clearable="false"></mInput>
                                </el-col>

                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>路口点位</label>
                                    <mInput :list="devList" :code.sync="devCode" :name.sync="devName" showAttr="devName" getAttr="devId" @netSearch="getDevInfo" :isSearch="true" :isShowCode="true" :disabled="isOnlyRead"></mInput>
                                    <div class="Warning" v-show="isWarning"><span>维修中</span></div>
                                </el-col>
                                <!-- <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>所属辖区</label>
                                    <mInput :list="areaList" :code.sync="areaCode" :name.sync="areaName" showAttr="regionName" getAttr="regionId" :disabled="isOnlyRead"></mInput>
                                </el-col> -->

                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>申报来源</label>
                                    <mInput :list="sourceList" :code.sync="sourceCode" :name.sync="sourceName" :disabled="isOnlyRead">
                                    </mInput>
                                </el-col>
                                <el-col :span="9">
                                    <label>详细地址</label>
                                    <el-input v-model="address" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead">
                                        <i class="el-icon-location-outline el-input__icon" slot="suffix" @click="handleIconClick" style="font-size:16px;">
                                        </i>
                                    </el-input>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="base-info" v-show="devCode">
                        <div class="title">
                            <h3>点位信息</h3>
                        </div>
                        <div class="content">
                            <el-row class="content-row-select lager-label">
                                <el-col :span="9">
                                    <label>点位名称</label>
                                    <span>{{devInfo.devName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>唯一识别码</label>
                                    <span>{{devInfo.manageId}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>IP地址</label>
                                    <span>{{devInfo.devIp}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属辖区</label>
                                    <span>{{areaName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>维护单位</label>
                                    <span>{{devInfo.oppmDeptName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>现管理单位</label>
                                    <span>{{devInfo.devDeptName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>支队责任民警</label>
                                    <span>{{devInfo.detaPoliceName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>大队责任民警</label>
                                    <span>{{devInfo.briPoliceName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属监理</label>
                                    <span>{{devInfo.supervisonName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>项目属性</label>
                                    <span>{{devInfo.oppmTypeName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属项目</label>
                                    <span>{{devInfo.projectName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>点位状态</label>
                                    <span>{{devInfo.deviceStatusName}}</span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="depiction-info">
                        <div class="title">
                            <h3>故障描述</h3>
                        </div>
                        <div class="content" style="padding-bottom:20px;">
                            <el-row class="content-row-explain content-row-first">
                                <el-col :span="24" class="content-row-img">
                                    <label>上传照片</label>
                                    <template v-for="(item,index) in imgSceneUrl">
                                        <div class="img-preview" :key="index">
                                            <el-image style="width: 100%; height: 100%" :src="item" :preview-src-list="imgSceneUrl">
                                            </el-image>
                                            <div class="img-del" @click="delImg(index,'imgScene')">
                                                <p>删除</p>
                                            </div>
                                        </div>
                                    </template>
                                    <div class="img-add" @click="$refs.imgFile.click()" v-if="!isOnlyRead">
                                        <img src="../../assets/images/icon-upload.png" width="24" height="24" alt="">
                                        <input type="file" id="imgFile1" name="" style="display:none" ref="imgFile" @change="upload('imgFile1','img','imgScene')" multiple="multiple">
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row class="content-row-select">
                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label class="content-label">故障描述</label>
                                    <el-input type="textarea" :rows="3" placeholder="" class="content-textarea" v-model="gzdesc" resize='none' :disabled="isOnlyRead">
                                    </el-input>
                                </el-col>
                            </el-row>
                            <el-row class="content-row-select" v-if="title=='优化申报'">
                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label class="content-label">优化方案</label>
                                    <el-input type="textarea" :rows="3" placeholder="" class="content-textarea" v-model="yhdesc" resize='none' :disabled="isOnlyRead">
                                    </el-input>
                                </el-col>
                            </el-row>
                            <!-- 优化照片和现场照片合为上传照片 -->
                            <!-- <el-row class="content-row-explain" v-if="title=='优化申报'" style="margin-top: 15px;margin-bottom:0;">
                                <el-col :span="24" class="content-row-img">
                                    <label>优化照片</label>
                                    <template v-for="(item,index) in imgOptUrl">
                                        <div class="img-preview" :key="index">
                                            <el-image style="width: 100%; height: 100%" :src="item" :preview-src-list="imgOptUrl">
                                            </el-image>
                                            <div class="img-del" @click="delImg(index,'imgOpt')">
                                                <p>删除</p>
                                            </div>
                                        </div>
                                    </template>
                                    <div class="img-add" @click="$refs.imgFileY.click()" v-if="!isOnlyRead">
                                        <img src="../../assets/images/icon-upload.png" width="24" height="24" alt="">
                                        <input type="file" id="imgFile2" name="" style="display:none" ref="imgFileY" @change="upload('imgFile2','img')" multiple="multiple">
                                    </div>
                                </el-col>
                            </el-row> -->
                        </div>
                    </div>
                    <!-- 科室/处室审核时填写，处室审核时查看 -->
                    <div class="depiction-info" v-if="(repairsInfo.repStatusCode == 'REPAIRSTATUS05')||(repairsInfo.repStatusCode == 'REPAIRSTATUS06') || (repairsInfo.workordersRecordMap.checkList&&repairsInfo.workordersRecordMap.checkList.length>0)">
                        <div class="title">
                            <h3>审核</h3>
                        </div>
                        <div class="content" style="padding-bottom:20px;">
                            <el-row class="content-row-select audit-list" v-if="repairsInfo.workordersRecordMap.checkList&&repairsInfo.workordersRecordMap.checkList.length>0">
                                <el-col :span="24">
                                    <div class="atitle">审核记录</div>
                                    <div v-for="(item,index) in repairsInfo.workordersRecordMap.checkList" :key="index" class="adetail">
                                        <span>审核类型：{{item.operTypeName}}</span>
                                        <span>审核人员：{{item.operPerson}}</span>
                                        <span>审核结果：{{item.operResult}}</span>
                                        <span class="explain">审核意见：{{item.operExplain}}</span>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row class="content-row-select" v-if="(prePage=='科室审核'&&(operatCode.indexOf('REPOPERTYPE05')>-1 ||operatCode.indexOf('REPOPERTYPE06')>-1))||(prePage=='处室审核'&&(operatCode.indexOf('REPOPERTYPE09')>-1 ||operatCode.indexOf('REPOPERTYPE10')>-1))">
                                <el-col :span="9">
                                    <label class="content-label">审核意见</label>
                                    <el-input type="textarea" :rows="3" placeholder="" class="content-textarea" v-model="auditOpinion" resize='none' :disabled="!($route.query.isread=='edit')">
                                    </el-input>
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
                <div class="reset" @click="resetRepair">
                    <p>重置</p>
                </div>
            </div>
            <!-- 科室待审核 + 处室待审核 -->
            <div class="ej-content-operation" v-if="(prePage=='科室审核'&&(operatCode.indexOf('REPOPERTYPE05')>-1 ||operatCode.indexOf('REPOPERTYPE06')>-1))||(prePage=='处室审核'&&(operatCode.indexOf('REPOPERTYPE09')>-1 ||operatCode.indexOf('REPOPERTYPE10')>-1))">
                <div class="submit" @click="auditMRepairs('1')">
                    <p>通过</p>
                </div>
                <div class="reset" @click="auditMRepairs('0')">
                    <p>拒绝</p>
                </div>
            </div>

            <el-dialog title="定位" :visible.sync="dialogMapVisible" width='560px' class="dialog-urge">
                <div class="dialog-main">
                    <div class="revoke-reason">
                        <el-input v-model="loactName" placeholder="" size='mini' class="content-select" style="width: 450px;" clearable=""></el-input>
                        <el-button @click="searchLocat" size='mini' class="submit">搜索</el-button>
                    </div>
                    <div>
                        <div class="mapBox" id="mapContainer" style="width:100%;height:300px;"></div>
                        <div id="searchResults"></div>
                    </div>
                    <div style="margin-top: 10px;">
                        <label class="dialog-label">选中地址</label>
                        <el-input v-model="selectLocat" placeholder="" size='mini' class="content-select" style="width: 450px;" clearable=""></el-input>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="()=>{address = selectLocat;dialogMapVisible = false;}" size='mini' class="submit">提 交</el-button>
                    <el-button @click="dialogMapVisible = false" size='mini' class="cancel">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    // import BaseInfo from "components/rpProcess/eqpm/baseInfo";
    // import Depiction from "components/rpProcess/eqpm/depiction";
    import mInput from "components/common/selectDrop";

    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    var MAPCONTAIN; // 地图实例
    export default {
        components: {
            mInput
        },
        data() {
            return {
                title: "",
                token: "",
                devTypeCode: '',
                devTypeName: '',
                devTypeList: [],
                tainCode: '',
                tainName: '',
                tainList: [],
                devCode: '',
                devName: '',
                devList: [],
                areaCode: '',
                areaName: '',
                areaList: [],
                sourceCode: '',
                sourceName: '',
                sourceList: [],
                address: '',
                imgSceneUrl: [], //图片地址集合,用于显示
                imgSceneList: [], //图片文件属性集合,用于上传
                imgSceneHide: [], //图片文件属性集合,存储上传成功返回值
                gzdesc: '',
                imgOptUrl: [], //图片地址集合,用于显示
                imgOptList: [], //图片文件属性集合,用于上传
                imgOptHide: [], //图片文件属性集合,存储上传成功返回值
                yhdesc: '',
                isWarning: false,

                isOnlyRead: false,
                repairsInfo: { workordersRecordMap: { checkList: [] } },
                auditOpinion: '', //审核意见

                operatCode: '',
                userInfo: {},
                prePage: '',
                isAjaxing: false, //是否在请求中
                devInfo: {}, // 当前选中的点位信息

                dialogMapVisible: false,
                allMarkers: [], // 地图上当前所有的点
                loactName: '',
                selectLocat: '', //地图弹窗选中的地址
                isCanChangeDevtype: false, // 所属系统是否可修改
            };
        },
        watch: {
            devTypeCode(val) {
                this.devCode = '';
                this.devName = '';
                if (val == '') {
                    this.devList = [];
                    return;
                }
                //路口点位
                this.getDataInfo(`${this.$config.efoms_HOST}/deviceDetail/selectDeviceDetailInfoPage`, {
                    pageSize: 30,
                    currentPage: 1,
                    devTypeCode: val,
                    isUse: '1'
                }).then(res => {
                    this.devList = res.resultList.result || [];
                });
                this.devRepeatCheck();
            },
            devCode(val) {
                if (this.devTypeCode != '' && val == '') {
                    // 路口点位
                    this.getDataInfo(`${this.$config.efoms_HOST}/deviceDetail/selectDeviceDetailInfoPage`, {
                        pageSize: 30,
                        currentPage: 1,
                        devTypeCode: this.devTypeCode,
                        key: val,
                        isUse: '1'
                    }).then(res => {
                        this.devList = res.resultList.result || [];
                    });
                }
                let arr = this.devList.filter(res => res.devId == val);
                if (arr.length > 0) {
                    this.devInfo = arr[0];
                    this.areaCode = arr[0].devAreaCode;
                    this.areaName = arr[0].devAreaName;
                    this.address = '';
                } else {
                    this.devInfo = {};
                    this.areaCode = '';
                    this.areaName = '';
                    this.address = '';
                }
                this.devRepeatCheck();
            }
        },
        mounted() {
            this.pageMounted();
            this.token = Common.getQueryString("token");
            this.getRepairInfo();
            this.prePage = this.$route.query.pre;
            this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

            //所属系统
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPDEVCATEGORY01"
            }).then(res => {
                this.devTypeList = res.resultList || [];

                if (this.$route.query.transferId) {
                    // 转单只能选网络链路
                    this.isCanChangeDevtype = true;
                    this.devTypeCode = 'REPDEVTYPE15';
                    this.devList.map(res => {
                        if (res.dicCode == this.devTypeCode) {
                            this.devTypeName = res.dicName;
                        }
                    });
                }
            });
            //维修类型
            if (this.$route.query.type == 'optimize') {
                this.tainList = [{ dicCode: 'REPAIRTYPE03', dicName: '优化' }];
            } else {
                this.tainList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' }];
            }
            this.tainCode = this.tainList[0].dicCode;
            this.tainName = this.tainList[0].dicName;
            //所属辖区
            this.getDicInfo(`${this.$config.ubms_HOST}/RegionInfo/getRegionInfo.htm`, {}).then(res => {
                this.areaList = res.resultList || [];
            });
            //申报来源
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "REPAIRSOURCE"
            }).then(res => {
                this.sourceList = res.resultList || [];
            });
        },
        methods: {
            submitForm() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.devTypeCode == "" || this.tainCode == "" || this.devCode == "" || this.sourceCode == "") {
                    Common.ejMessage("warning", "请选择设备基本信息");
                    return;
                }
                if (this.isWarning) {
                    Common.ejMessage("warning", "该设备已经报修过了，请勿重复提交");
                    return;
                }
                if (this.gzdesc == "") {
                    Common.ejMessage("warning", "填写故障描述");
                    return;
                }
                if (this.$route.query.type === 'optimize' && this.yhdesc == "") {
                    Common.ejMessage("warning", "填写优化方案");
                    return;
                }

                let obj = {
                    devCategoryCode: 'REPDEVCATEGORY01',
                    devCategoryName: '外场智能设备',
                    devTypeCode: this.devTypeCode,
                    devTypeName: this.devTypeName,
                    typeCode: this.tainCode,
                    typeName: this.tainName,
                    devId: this.devCode,
                    devName: this.devName,
                    devAreaCode: this.areaCode,
                    devAreaName: this.areaName,
                    repSourceCode: this.sourceCode,
                    repSourceName: this.sourceName,
                    detailAddr: this.address,
                    failureDescrible: this.gzdesc,
                    fileInfoList: this.imgSceneList,

                    optimeScheme: this.yhdesc,
                    transferId: this.$route.query.transferId // 转单：原先的工单编号
                };

                let murl = '/workorders/createWorkordersInfo';
                if (this.$route.query.type === 'optimize') {
                    murl = '/repairs/createRepairsInfo';
                }
                if (this.$route.query.transferId) {
                    murl = '/workorders/opr/transferApply';
                }

                this.isAjaxing = true;
                this.$api.post(`${this.$config.efoms_HOST}${murl}`, obj, { token: this.token }).then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            sessionStorage.setItem('relaodPage', '1'); // 新增后回到列表需刷新
                            this.$confirm('申报成功，是否继续添加维修单?', '操作成功', {
                                confirmButtonText: '确认',
                                cancelButtonText: '继续',
                                type: 'success'
                            }).then(() => {
                                window.history.back();
                            }).catch(() => {
                                this.resetRepair();
                            });
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        // Common.ejMessage("warning");
                        Common.printErrorLog(err);
                    });
            },
            resetRepair() {
                this.devTypeCode = '';
                this.devTypeName = '';
                this.tainCode = this.tainList[0].dicCode;
                this.tainName = this.tainList[0].dicName;
                this.devCode = '';
                this.devName = '';
                this.areaCode = '';
                this.areaName = '';
                this.sourceCode = '';
                this.sourceName = '';
                this.address = '';
                this.gzdesc = '';
                this.yhdesc = '';
            },
            auditMRepairs(isPass) {
                this.$api.putByQs(`${this.$config.efoms_HOST}/repairs/auditRepairsInfo`, {
                        repairsId: this.repairsInfo.repairsId,
                        isPass: isPass,
                        operExplain: this.auditOpinion
                    }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.getRepairInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            devRepeatCheck() {
                if (!this.devCode || !this.devTypeCode || this.isOnlyRead) {
                    this.isWarning = false;
                    return;
                }

                let murl = '/workorders/devCheckWorkorders'; // 维修校验重复
                if (this.$route.query.type === 'optimize') {
                    murl = '/repairs/devCheckRepairs'; // 优化校验重复
                }
                this.$api.get(`${this.$config.efoms_HOST}${murl}`, {
                        devId: this.devCode,
                        devTypeCode: this.devTypeCode
                    }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 2103) {
                            this.isWarning = true;
                        } else {
                            this.isWarning = false;
                        }
                    })
                    .catch(err => {
                        this.isWarning = false;
                        Common.printErrorLog(err);
                    });
            },
            delImg(index, arrNamePre) {
                // console.log(index)
                // console.log(`${arrNamePre}Hide`)
                // console.log(this[`${arrNamePre}Hide`])
                this.delFiles(this[`${arrNamePre}Hide`][index]);
                this[`${arrNamePre}Url`].splice(index, 1);
                this[`${arrNamePre}List`].splice(index, 1);
                this[`${arrNamePre}Hide`].splice(index, 1);
            },
            delFiles(e) {
                this.$api.delete(`${this.$config.efoms_HOST}/file/deleteFile`, {
                        token: this.token,
                        secondDir: e.secondDir,
                        fileName: e.fileName
                    }, { "Content-Type": "application/x-www-form-urlencoded" })
                    .then(res => {
                        if (res.appCode == 0) {} else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            upload(fileId, type, arrNamePre) {
                var flag = false;
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json;charset=UTF-8",
                    token: this.token
                };
                var formData = new FormData();
                var file = document.getElementById(fileId).files[0];
                formData.append("file", file);

                switch (type) {
                    case "img":
                        if (/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(file.name)) {
                            flag = true;
                        } else {
                            Common.ejMessage("warning", "图片限于png,gif,jpeg,jpg格式");
                        }
                        break;
                        // case "otherFile":
                        //     flag = true;
                        //     break;
                    default:
                        break;
                }
                if (!flag) return;

                this.$api.post(`${this.$config.efoms_HOST}/file/uploadFile`, formData, header).then(res => {
                        if (res.appCode == 0) {
                            switch (type) {
                                case "img":
                                    this[`${arrNamePre}Url`].push(res.resultList.downloadPath);
                                    this[`${arrNamePre}Hide`].push(res.resultList);
                                    this[`${arrNamePre}List`].push({
                                        fileName: file.name,
                                        fileURL: res.resultList.downloadPath,
                                        fileMode: file.name
                                            .slice(file.name.lastIndexOf(".") + 1)
                                            .toLowerCase()
                                    });
                                    break;
                                    // case "otherFile":
                                    //     this.otherFiles.push(res.resultList);
                                    //     this.otherFileList.push({
                                    //         fileName: file.name,
                                    //         fileURL: res.resultList.downloadPath,
                                    //         fileMode: file.name
                                    //             .slice(file.name.lastIndexOf(".") + 1)
                                    //             .toLowerCase()
                                    //     });
                                    //     break;
                                default:
                                    break;
                            }
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
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
            pageMounted() {
                if (this.$route.query.type == 'optimize') {
                    this.title = '优化申报';
                } else {
                    this.title = '维修申报';
                }
            },
            getDevInfo(val) {
                //路口点位,在设备类别已有的情况下
                this.getDataInfo(`${this.$config.efoms_HOST}/deviceDetail/selectDeviceDetailInfoPage`, {
                    pageSize: 50,
                    currentPage: 1,
                    devTypeCode: this.devTypeCode,
                    key: val,
                    isUse: '1'
                }).then(res => {
                    this.devList = res.resultList.result || [];
                });
            },
            getRepairInfo() {
                this.isOnlyRead = false;
                if (this.$route.query.type === 'optimize' && this.$route.query.id) {
                    this.isOnlyRead = true;
                    this.$api.get(`${this.$config.efoms_HOST}/repairs/getRepairsInfoById`, { repairsId: this.$route.query.id }, { token: this.token })
                        .then(res => {
                            if (res.appCode == 0) {
                                this.repairsInfo = res.resultList || {};
                                this.devTypeCode = this.repairsInfo.devTypeCode;
                                this.tainCode = this.repairsInfo.typeName;
                                this.areaCode = this.repairsInfo.devAreaCode;
                                this.areaName = this.repairsInfo.devAreaName;
                                this.sourceCode = this.repairsInfo.repSourceCode;
                                this.address = this.repairsInfo.siteDescrible || this.repairsInfo.detailAddr;
                                this.gzdesc = this.repairsInfo.failureDescrible;
                                this.yhdesc = this.repairsInfo.optimeScheme;

                                setTimeout(() => {
                                    this.devCode = this.repairsInfo.devId;
                                    this.devName = this.repairsInfo.devName;
                                }, 500);

                                this.getNextStep();
                                // imgSceneUrl
                                // imgOptUrl
                            } else {
                                Common.printErrorLog(res);
                            }
                        })
                        .catch(err => {
                            Common.printErrorLog(err);
                        });
                }
            },
            getNextStep() {
                if (this.$route.query.isread != 'edit') {
                    return;
                }
                this.$api.putByQs(`${this.$config.efoms_HOST}/workordersRecord/getNextProcess`, {
                        workordersId: this.$route.query.id
                    }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            this.operatCode = res.resultList || '';
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
        }

        .lager-label {
            label {
                width: 72px;
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
        float: left;
        position: relative;
        width: 0;
        left: -8px;
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