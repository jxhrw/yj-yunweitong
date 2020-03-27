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
                                    <label>所属大队</label>
                                    <mInput :list="battalionList" :code.sync="battalionCode" :name.sync="battalionName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead||isCanChangeDevtype">
                                    </mInput>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属中队</label>
                                    <mInput :list="squadronList" :code.sync="squadronCode" :name.sync="squadronName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead"></mInput>
                                </el-col>

                                <!-- <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>维修类型</label>
                                    <mInput :list="tainList" :code.sync="tainCode" :name.sync="tainName" :disabled="isOnlyRead" :clearable="false"></mInput>
                                </el-col> -->
                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>详细地址</label>
                                    <el-input v-model="address" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead">
                                        <i class="el-icon-location-outline el-input__icon" slot="suffix" @click="handleIconClick" style="font-size:16px;">
                                        </i>
                                    </el-input>
                                </el-col>
                                <el-col :span="18" class="col-alone">
                                    <i class="redStar">*</i>
                                    <label>设施类别</label>
                                    <div>
                                        <el-tag v-for="item in facTypeList" :key="item.dicCode" type="info" effect="light" :class="['a-tag',canChoosefacType.indexOf(item.dicCode)==-1?'disabled':'',facTypeCode.indexOf(item.dicCode)>-1?'active':'']" @click="selectTypeCode(item.dicCode)">
                                            {{ item.dicName }}
                                        </el-tag>
                                    </div>
                                </el-col>
                                <el-col :span="24" class="col-notlone">
                                    <i class="redStar">*</i>
                                    <label>道路信息</label>
                                    <div class="button" @click="addRoadInfo('block')">添加路段</div>
                                    <!-- <div class="button" @click="addRoadInfo('cross')">添加路口</div> -->
                                    <!-- <div class="button" @click="addRoadInfo('fac')">添加设施</div> -->
                                    <ul>
                                        <template v-for="(item,index) in roadInfoList">
                                            <li v-if="item.isUse" :key="index">
                                                <template v-if="item.type=='block'">
                                                    <i class="redStar">*</i>
                                                    <label>所属路段</label>
                                                    <mInput :list="item.blockList" :code.sync="item.blockId" :name.sync="item.blockName" showAttr="blockName" getAttr="blockId" @netSearch="getBlockInfo" :isSearch="true" :isShowCode="true" :disabled="isOnlyRead" @visibleChange="getRoadIndex(index)"></mInput>
                                                </template>
                                                <template v-if="item.type=='cross'">
                                                    <i class="redStar">*</i>
                                                    <label>所属路口</label>
                                                    <mInput :list="item.crossList" :code.sync="item.crossId" :name.sync="item.crossName" showAttr="crossName" getAttr="crossId" @netSearch="getCrossInfo" :isSearch="true" :isShowCode="true" :disabled="isOnlyRead" @visibleChange="getRoadIndex(index)"></mInput>
                                                </template>
                                                <template v-if="item.type=='fac'">
                                                    <i class="redStar">*</i>
                                                    <label>关联设施</label>
                                                    <mInput :list="item.facList" :code.sync="item.facId" :name.sync="item.facName" showAttr="blockName" getAttr="blockId" @netSearch="getFacInfo" :isSearch="true" :disabled="isOnlyRead" @visibleChange="getRoadIndex(index)"></mInput>
                                                </template>
                                                <div class="button" @click="item.isUse=false">删除</div>
                                            </li>
                                        </template>
                                    </ul>

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
                                    <i class="redStar" style="margin-top: 5px;">*</i>
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
                            <el-row class="content-row-select" v-if="this.tainCode === 'REPAIRTYPE03'">
                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label class="content-label">优化方案</label>
                                    <el-input type="textarea" :rows="3" placeholder="" class="content-textarea" v-model="yhdesc" resize='none' :disabled="isOnlyRead">
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

            <DialogGDMap :dialogVisible.sync="dialogMapVisible" @callback="setLocatInfo"></DialogGDMap>
        </div>
    </div>
</template>
<script>
    import mInput from "components/common/selectDrop";
    import DialogGDMap from "../workSheet/business/dialog-gaodeMap";

    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    var MAPCONTAIN; // 地图实例
    export default {
        components: {
            mInput,
            DialogGDMap
        },
        data() {
            return {
                title: "维修申报",
                token: "",
                battalionCode: '',
                battalionName: '',
                battalionList: [],
                squadronCode: '',
                squadronName: '',
                squadronList: [],
                tainCode: '',
                tainName: '',
                tainList: [],
                opDeptCode: '',
                opDeptName: '',
                opDeptList: [],
                regionCode: '',
                regionName: '',
                regionList: [],
                sourceCode: '',
                sourceName: '',
                sourceList: [],
                canChoosefacType: [],
                facTypeCode: [],
                facTypeList: [],
                blockOldList: [], // 原始的路段信息
                crossOldList: [], // 原始的路口信息
                facOldList: [], // 原始的设施信息
                roadIndex: 0, // 当前修改的道路的索引
                roadInfoList: [], // 道路的所有相关信息
                facCode: '',
                facName: '',
                facList: [],
                address: '',
                imgSceneUrl: [], //图片地址集合,用于显示
                imgSceneList: [], //图片文件属性集合,用于上传
                imgSceneHide: [], //图片文件属性集合,存储上传成功返回值
                // gzCode: '',
                // gzName: '',
                // gzList: [],
                gzdesc: '',
                imgOptUrl: [], //图片地址集合,用于显示
                imgOptList: [], //图片文件属性集合,用于上传
                imgOptHide: [], //图片文件属性集合,存储上传成功返回值
                yhdesc: '',
                isWarning: false,

                isOnlyRead: false,
                repairsInfo: { workordersRecordMap: { checkList: [] } },

                operatCode: '',
                userInfo: {},
                prePage: '',
                isAjaxing: false, //是否在请求中
                facInfo: {}, // 当前选中的点位信息
                mtimes: 0, // 维护次数

                dialogMapVisible: false,
                isCanChangeDevtype: false, // 所属系统是否可修改
                relationId: '', // 当前点位已报修关联的工单编号
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
            tainCode(val) {
                this.facTypeCode = [];
            },
            facTypeCode(val) {
                // 数字城管REPAIRTYPE04下，电子类REPDEVTYPE24和非电子类互斥
                // if (this.tainCode == 'REPAIRTYPE04') {
                let arr = [];
                this.facTypeList.map(item => {
                    arr.push(item.dicCode);
                });
                // if (val.length == 0) {
                //     this.canChoosefacType = arr;
                // } else if (val.indexOf('REPDEVTYPE24') == -1) {
                //     this.canChoosefacType = arr.filter(res => res != 'REPDEVTYPE24');
                // } else {
                //     this.canChoosefacType = ['REPDEVTYPE24'];
                // }
            }
        },
        activated() {
            // this.pageMounted();
            //维修类型
            this.tainList = [{ dicCode: 'REPAIRTYPE01', dicName: '维修' }, { dicCode: 'REPAIRTYPE02', dicName: '抢修' }, { dicCode: 'REPAIRTYPE03', dicName: '优化' }, { dicCode: 'REPAIRTYPE04', dicName: '数字城管' }];
            this.tainCode = this.tainList[0].dicCode;
            this.tainName = this.tainList[0].dicName;

            if (sessionStorage.getItem('detrepssSave') == '0') {
                this.resetRepair();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.prePage = this.$route.query.pre;
            this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

            //所属大队
            this.getDataInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfoV2.htm`, { deptRank: 'DEPTRANK04' }).then(res => {
                this.battalionList = res.resultList || [];
            });
            // 设施类别
            this.facTypeList = [{ dicCode: 'REPDEVTYPE24', dicName: '电子设施' }, { dicCode: 'REPDEVTYPE21', dicName: '交通标线' }, { dicCode: 'REPDEVTYPE22', dicName: '交通护栏' }, { dicCode: 'REPDEVTYPE23', dicName: '交通标志' }, { dicCode: 'REPDEVTYPE25', dicName: '临时设施' }, { dicCode: 'REPDEVTYPE26', dicName: '其他设施' }];
            let arr = [];
            this.facTypeList.map(item => {
                arr.push(item.dicCode);
            });
            this.canChoosefacType = arr;

            //所属辖区
            // this.getDicInfo(`${this.$config.ubms_HOST}/RegionInfo/getRegionInfo.htm`, {}).then(res => {
            //     this.regionList = res.resultList || [];
            // });
            //申报来源
            // this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, {
            //     parentCode: "REPAIRSSOURCE"
            // }).then(res => {
            //     this.sourceList = res.resultList || [];
            // });
            //维护单位
            // this.getDicInfo(`${this.$config.ubms_HOST}/OpsDeptInfo/getOpsDeptTreeRoot.htm`, {}).then(res => {
            //     this.opDeptList = res.resultList || [];
            // });
        },
        methods: {
            submitForm() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.battalionCode == "") {
                    Common.ejMessage("warning", "请选择所属大队");
                    return;
                }
                if (this.address == "") {
                    Common.ejMessage("warning", "详细地址必填");
                    return;
                }
                if (this.facTypeList.length <= 0) {
                    Common.ejMessage("warning", "请选择设施类别");
                }
                let isChooseRoal = true;
                let arrs = this.roadInfoList.filter(res => res.isUse);
                let listSignsWorkordersRoad = [];
                arrs.map(item => {
                    switch (item.type) {
                        case "block":
                            isChooseRoal = isChooseRoal && item.blockId != '';
                            break;
                        case "cross":
                            isChooseRoal = isChooseRoal && item.crossId != '';
                            break;
                        case "fac":
                            isChooseRoal = isChooseRoal && item.facId != '';
                            break;
                        default:
                            break;
                    }
                    listSignsWorkordersRoad.push({
                        roadId: "",
                        roadName: "",
                        blockId: item.blockId,
                        blockName: item.blockName,
                        crossId: item.crossId,
                        crossName: item.crossName,
                        devId: item.facId,
                        devName: item.facName,
                    });
                });
                if (arrs.length == 0 || !isChooseRoal) {
                    Common.ejMessage("warning", "道路信息必填");
                    return;
                }
                // if (this.isWarning) {
                //     Common.ejMessage("warning", "该设备已经报修过了，请勿重复提交");
                //     return;
                // }
                // if (this.gzList.length > 0 && this.gzCode == "") {
                //     Common.ejMessage("warning", "填写故障类型");
                //     return;
                // }
                if (this.imgSceneList.length < 1) {
                    Common.ejMessage("warning", "请上传图片");
                    return;
                }
                if (this.gzdesc == "") {
                    Common.ejMessage("warning", "填写故障描述");
                    return;
                }
                if (this.tainCode === 'REPAIRTYPE03' && this.yhdesc == "") {
                    Common.ejMessage("warning", "填写优化方案");
                    return;
                }

                let facTypeName = [];
                this.facTypeCode.map(item => {
                    let arr = this.facTypeList.filter(res => res.dicCode == item);
                    if (arr.length > 0) facTypeName.push(arr[0].dicName);
                });

                let obj = {
                    devCategoryCode: 'REPDEVCATEGORY02',
                    devCategoryName: '外场交通设施',
                    devDeptId: this.battalionCode,
                    devDeptName: this.battalionName,
                    squadron: this.squadronCode,
                    squadronName: this.squadronName,
                    devAreaCode: this.regionCode,
                    devAreaName: this.regionName,
                    repSourceCode: this.sourceCode,
                    repSourceName: this.sourceName,
                    typeCode: this.tainCode,
                    typeName: this.tainName,
                    oppmDeptId: this.opDeptCode,
                    oppmDeptName: this.opDeptName,
                    detailAddr: this.address,
                    devTypeCode: this.facTypeCode.join(','),
                    devTypeName: facTypeName.join(','),
                    listSignsWorkordersRoad: listSignsWorkordersRoad,
                    failureDescrible: this.gzdesc,
                    fileInfoList: this.imgSceneList,
                    optimeScheme: this.yhdesc,
                    transferId: this.$route.query.transferId // 转单：原先的工单编号
                };

                let murl = '/SignsWorkordersInfo/insertSignsWorkordersInfo';
                // if (this.$route.query.transferId) {
                //     murl = '/workorders/opr/transferApply';
                // }

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
                this.battalionCode = '';
                this.battalionName = '';
                this.squadronCode = '';
                this.squadronName = '';
                this.opDeptCode = '';
                this.opDeptName = '';
                this.regionCode = '';
                this.regionName = '';
                this.sourceCode = '';
                this.sourceName = '';
                this.tainCode = this.tainList[0].dicCode;
                this.tainName = this.tainList[0].dicName;
                this.address = '';
                this.facTypeCode = [];
                this.roadInfoList = [];
                this.roadIndex = 0;
                // this.addRoadInfo();
                this.gzdesc = '';
                this.yhdesc = '';

                this.imgSceneUrl = [];
                this.imgSceneList = [];
                this.imgSceneHide = [];
            },
            selectTypeCode(code) {
                let index = this.facTypeCode.indexOf(code);
                if (index == -1) {
                    this.facTypeCode.push(code);
                } else {
                    this.facTypeCode.splice(index, 1);
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
            // 关联道路
            getBlockInfo(val) {
                let _this = this;
                return new Promise(function(resolve, reject) {
                    //路口点位,在设备类别已有的情况下
                    _this.getDicInfo(`${_this.$config.ubms_HOST}/BlockInfo/getPageBlockInfo.htm`, {
                        pageSize: 50,
                        currentPage: 1,
                        blockName: val || ''
                    }).then(res => {
                        if (_this.blockOldList.length == 0) {
                            _this.blockOldList = res.resultList.rows || [];
                        } else {
                            _this.roadInfoList[_this.roadIndex].blockList = res.resultList.rows || [];
                        }
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            // 关联路口
            getCrossInfo(val) {
                let _this = this;
                return new Promise(function(resolve, reject) {
                    //路口点位,在设备类别已有的情况下
                    _this.getDicInfo(`${_this.$config.ubms_HOST}/CrossInfo/getPageCrossInfo.htm`, {
                        pageSize: 50,
                        currentPage: 1,
                        crossName: val || ''
                    }).then(res => {
                        if (_this.crossOldList.length == 0) {
                            _this.crossOldList = res.resultList.rows || [];
                        } else {
                            _this.roadInfoList[_this.roadIndex].crossList = res.resultList.rows || [];
                        }
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
                });
            },
            // 关联设施
            getFacInfo(val) {
                let _this = this;
                return new Promise(function(resolve, reject) {
                    //路口点位,在设备类别已有的情况下
                    // _this.getDicInfo(`${_this.$config.ubms_HOST}/BlockInfo/getPageBlockInfo.htm`, {
                    //     pageSize: 50,
                    //     currentPage: 1,
                    //     blockName: val || ''
                    // }).then(res => {
                    //     if (_this.facOldList.length == 0) {
                    //         _this.facOldList = res.resultList.rows || [];
                    //     } else {
                    //         _this.roadInfoList[_this.roadIndex].facList = res.resultList.rows || [];
                    //     }
                    //     resolve();
                    // }).catch(err => {
                    //     reject(err);
                    // });
                    resolve();
                });
            },
            getRoadIndex(i) {
                this.roadIndex = i;
            },
            async addRoadInfo(type) {
                if (type == 'block' && this.blockOldList.length == 0) {
                    await this.getBlockInfo();
                }
                if (type == 'cross' && this.crossOldList.length == 0) {
                    await this.getCrossInfo();
                }
                if (type == 'fac' && this.facOldList.length == 0) {
                    await this.getFacInfo();
                }
                this.roadInfoList.push({
                    blockId: '',
                    blockName: '',
                    blockList: this.blockOldList || [],
                    crossId: '',
                    crossName: '',
                    crossList: this.crossOldList || [],
                    facId: '',
                    facName: '',
                    facList: this.facOldList || [],
                    type: type,
                    isUse: true, // 当前数据是否有效
                });
            },
            gotoList() {
                if (this.mtimes > 0) {
                    window.open(`./index.html?token=${this.token}&headMenu=hide#/sheet?type=7&facId=${this.facInfo.facId}`);
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
            },
            gotoDetail() {
                sessionStorage.setItem('detrepssSave', '1'); //当前页面数据是否保留
                this.$router.push({
                    path: '/detsheet',
                    query: {
                        type: this.$route.query.type,
                        id: this.relationId
                    }
                });
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
            color: #ff5722;
            text-decoration: underline;
            cursor: pointer;
        }

        .col-alone {
            display: flex;

            label {
                line-height: 32px;
            }

            .a-tag {
                margin: 0 5px;
                cursor: pointer;

                &.disabled {
                    opacity: 0.5;
                    cursor: no-drop;
                    pointer-events: none;
                }

                &.active {
                    background-color: #00c187;
                    color: #fff;
                }
            }
        }

        .col-notlone {
            .button {
                background-color: #00c187;
                display: inline-block;
                margin-right: 14px;
                width: 80px;
                height: 28px;
                border-radius: 1px;
                border: none;
                cursor: pointer;
                color: #ffffff;
                font-size: 14px;
                line-height: 28px;
                text-align: center;
            }

            ul {
                margin-left: 60px;

                li {
                    margin-top: 10px;

                    // /deep/ .d-select {
                    //     width: 160px;
                    // }

                    .redStar {
                        float: none;
                        left: 2px;
                        top: 4px;
                    }

                    .button {
                        position: relative;
                        top: 1px;
                        margin-left: 5px;
                    }
                }
            }
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