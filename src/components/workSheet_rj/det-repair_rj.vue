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
                                    <label>所属处室</label>
                                    <mInput :list="battalionList" :code.sync="battalionCode" :name.sync="battalionName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead||isCanChangeDevtype">
                                    </mInput>
                                </el-col>
                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>所属部门</label>
                                    <mInput :list="squadronList" :code.sync="squadronCode" :name.sync="squadronName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead"></mInput>
                                </el-col>
                                <!-- <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>紧急程度</label>
                                    <mInput :list="urgentList" :code.sync="urgentCode" :name.sync="urgentName" :disabled="isOnlyRead" :clearable="false"></mInput>
                                </el-col> -->
                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>详细地址</label>
                                    <el-input v-model="address" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead">
                                        <i class="el-icon-location-outline el-input__icon" slot="suffix" @click="handleIconClick" style="font-size:16px;">
                                        </i>
                                    </el-input>
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
                                    <!-- <i class="redStar" style="margin-top: 5px;">*</i> -->
                                    <label>上传照片</label>
                                    <template v-for="(item,index) in imgSceneUrl">
                                        <div class="img-preview" :key="index">
                                            <el-image style="width: 100%; height: 100%" :src="item" :preview-src-list="imgSceneUrl.slice(index).concat(imgSceneUrl.slice(0,index))">
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

            <DialogGDMap :dialogVisible.sync="dialogMapVisible" @callback="setLocatInfo" v-if="isWatching"></DialogGDMap>
        </div>
    </div>
</template>
<script>
    // import BaseInfo from "components/rpProcess/eqpm/baseInfo";
    // import Depiction from "components/rpProcess/eqpm/depiction";
    import mInput from "components/common/selectDrop";
    import aInput from "components/common/inputDrop";
    import DialogGDMap from "../workSheet/business/dialog-gaodeMap";

    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    var MAPCONTAIN; // 地图实例
    export default {
        components: {
            mInput,
            aInput,
            DialogGDMap
        },
        data() {
            return {
                title: "",
                token: "",
                devTypeCode: '',
                devTypeName: '',
                devTypeList: [],
                battalionCode: '',
                battalionName: '',
                battalionList: [],
                squadronCode: '',
                squadronName: '',
                squadronList: [],
                tainCode: '',
                tainName: '',
                tainList: [],
                urgentCode: '',
                urgentName: '',
                urgentList: [],
                address: '',
                imgSceneUrl: [], //图片地址集合,用于显示
                imgSceneList: [], //图片文件属性集合,用于上传
                imgSceneHide: [], //图片文件属性集合,存储上传成功返回值
                gzList: [],
                gzdesc: '',
                imgOptUrl: [], //图片地址集合,用于显示
                imgOptList: [], //图片文件属性集合,用于上传
                imgOptHide: [], //图片文件属性集合,存储上传成功返回值
                yhdesc: '',

                isOnlyRead: false,
                repairsInfo: { workordersRecordMap: { checkList: [] } },
                userInfo: {},
                isAjaxing: false, //是否在请求中
                dialogMapVisible: false,
                isCanChangeDevtype: false, // 所属系统是否可修改
                isWatching: false, // 是否在当前页面
            };
        },
        watch: {
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
        deactivated() {
            this.isWatching = false;
        },
        activated() {
            this.isWatching = true;
            this.pageMounted();
            //维修类型
            if (this.$route.query.type == 'optimize') {
                this.tainList = [{ dicCode: 'REPAIRTYPE03', dicName: '优化' }];
            } else {
                this.tainList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' }];
            }
            this.tainCode = this.tainList[0].dicCode;
            this.tainName = this.tainList[0].dicName;

            if (sessionStorage.getItem('detreprjSave') == '0') {
                this.resetRepair();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

            //所属系统
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
                parentCode: "SYSTEMOTHERWOR"
            }).then(res => {
                this.devTypeList = res.resultList || [];
            }).catch(err => {
                Common.printErrorLog(err);
            });
            //所属大队
            this.getDataInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfoV2.htm`, { deptRank: 'DEPTRANK04' }).then(res => {
                this.battalionList = res.resultList || [];
            });
            // 紧急程度
            // this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
            //     parentCode: "WORKORDERLEVEL"
            // }).then(res => {
            //     this.urgentList = res.resultList || [];
            // }).catch(err => {
            //     Common.printErrorLog(err);
            // });
        },
        methods: {
            submitForm() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.devTypeCode == "" || this.tainCode == "" || this.battalionCode == "" || this.squadronCode == "" || this.address == "") {
                    Common.ejMessage("warning", "请选择设备基本信息");
                    return;
                }
                // if (this.imgSceneList.length < 1) {
                //     Common.ejMessage("warning", "请上传图片");
                //     return;
                // }
                if (this.gzdesc == "") {
                    Common.ejMessage("warning", "填写故障描述");
                    return;
                }
                if (this.$route.query.type === 'optimize' && this.yhdesc == "") {
                    Common.ejMessage("warning", "填写优化方案");
                    return;
                }

                let obj = {
                    systemCode: this.devTypeCode,
                    systemName: this.devTypeName,
                    typeCode: this.tainCode,
                    typeName: this.tainName,
                    devSpaceId: this.battalionCode,
                    devSpaceName: this.battalionName,
                    devDeptId: this.squadronCode,
                    devDeptName: this.squadronName,
                    // levelCode: this.urgentCode,
                    // levelName: this.urgentName,
                    detailAddr: this.address,
                    failureDescrible: this.gzdesc,
                    fileInfoList: this.imgSceneList,
                    optimeScheme: this.$route.query.type === 'optimize' ? this.yhdesc : undefined,
                };

                let murl = '/workordersOther/insertWorkordersOther';
                if (this.$route.query.type === 'optimize') {
                    // murl = '/repairs/createRepairsInfo';
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
            resetRepair(type) {
                this.battalionCode = '';
                this.battalionName = '';
                this.squadronCode = '';
                this.squadronName = '';
                this.urgentCode = '';
                this.urgentName = '';
                this.address = '';
                this.gzdesc = '';
                this.yhdesc = '';

                this.imgSceneUrl = [];
                this.imgSceneList = [];
                this.imgSceneHide = [];
                if (type == '1') {
                    // 维修类型不变
                } else {
                    this.devTypeCode = '';
                    this.devTypeName = '';
                    this.tainCode = this.tainList[0].dicCode;
                    this.tainName = this.tainList[0].dicName;
                }
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
                            // Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        // Common.printErrorLog(err);
                    });
            },
            upload(fileId, type, arrNamePre) {
                var fileList = document.getElementById(fileId).files;
                for (let i = 0; i < fileList.length; i++) {
                    setTimeout(() => {
                        this.uploadLoop(fileList[i], type, arrNamePre);
                        if (i == fileList.length - 1) document.getElementById(fileId).value = '';
                    }, i * 300);
                }
            },
            uploadLoop(file, type, arrNamePre) {
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json;charset=UTF-8",
                    token: this.token
                };
                var flag = false;
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

                var formData = new FormData();
                formData.append("file", file);
                this.$api.post(`${this.$config.efoms_HOST}/file/uploadFile`, formData, header).then(res => {
                        if (res.appCode == 0) {
                            switch (type) {
                                case "img":
                                    if (this.$config.baseimgs) {
                                        this[`${arrNamePre}Url`].push(`${this.$config.baseimgs}?path=${res.resultList.downloadPath}&token=${this.token}`);
                                    } else {
                                        this[`${arrNamePre}Url`].push(res.resultList.downloadPath);
                                    }
                                    console.log(`${this.$config.baseimgs}?path=${res.resultList.downloadPath}&token=${this.token}`)

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
            handleIconClick() {
                this.dialogMapVisible = true;
            },
            setLocatInfo(res) {
                this.address = res.address;
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
            }
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

        .mclass {
            color: #FF5722;
            text-decoration: underline;
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