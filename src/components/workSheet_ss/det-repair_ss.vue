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
                                    <mInput :list="squadronList" :code.sync="squadronCode" :name.sync="squadronName" showAttr="deptName" getAttr="deptId" :disabled="isOnlyRead" :clearable="false"></mInput>
                                </el-col>

                                <!-- <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>路口点位</label>
                                    <mInput v-if="battalionCode!='REPDEVTYPE17'" :list="facList" :code.sync="facCode" :name.sync="facName" showAttr="facName" getAttr="facId" @netSearch="getDevInfo" :isSearch="true" :isShowCode="true" :disabled="isOnlyRead"></mInput>
                                    <el-input v-else v-model="facName" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead"></el-input>

                                    <div class="Warning" v-show="isWarning" title="该点位已有工单，点击查看" @click="gotoDetail"><span></span></div>
                                </el-col> -->
                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label>维修类型</label>
                                    <mInput :list="tainList" :code.sync="tainCode" :name.sync="tainName" :disabled="isOnlyRead" :clearable="false"></mInput>
                                </el-col>
                                <el-col :span="9">
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
                                        <el-tag v-for="item in facTypeList" :key="item.dicCode" type="info" effect="light" :class="['a-tag','disabled!',facTypeCode.indexOf(item.dicCode)>-1?'active':'']" @click="selectTypeCode(item.dicCode)">
                                            {{ item.dicName }}
                                        </el-tag>
                                    </div>
                                </el-col>
                                <el-col :span="24" class="col-notlone">
                                    <i class="redStar">*</i>
                                    <label>道路信息</label>
                                    <div class="button" @click="addRoadInfo">添加路段</div>
                                    <div class="button" @click="addRoadInfo">添加路口</div>
                                    <div class="button" @click="addRoadInfo">添加设施</div>
                                    <ul>
                                        <template v-for="(item,index) in roadInfoList">
                                            <li v-if="item.isUse" :key="index">
                                                <i class="redStar">*</i>
                                                <label>所属道路</label>
                                                <mInput :list="item.roadList" :code.sync="item.roadId" showAttr="roadName" getAttr="roadId" @netSearch="getDevInfo" :isSearch="true" :isShowCode="true" :disabled="isOnlyRead" @visibleChange="getRoadIndex(index)"></mInput>
                                                <i class="redStar">*</i>
                                                <label>路段起点</label>
                                                <mInput :list="item.roadList" :code.sync="item.aaa" :disabled="isOnlyRead">
                                                </mInput>
                                                <i class="redStar">*</i>
                                                <label>路段终点</label>
                                                <mInput :list="item.roadList" :code.sync="item.aaa" :disabled="isOnlyRead">
                                                </mInput>
                                                <div class="button" @click="item.isUse=false">删除</div>
                                            </li>
                                        </template>
                                    </ul>

                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="base-info" v-show="false">
                        <div class="title">
                            <h3>点位信息</h3>
                        </div>
                        <div class="content">
                            <el-row class="content-row-select lager-label">
                                <el-col :span="9">
                                    <label>点位名称</label>
                                    <span>{{facInfo.facName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>唯一识别码</label>
                                    <span>{{facInfo.manageId}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>IP地址</label>
                                    <span>{{facInfo.facIp}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属辖区</label>
                                    <!-- <span>{{areaName}}</span> -->
                                </el-col>
                                <el-col :span="9">
                                    <label>维护单位</label>
                                    <span>{{facInfo.oppmDeptName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>现管理单位</label>
                                    <span>{{facInfo.facDeptName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>支队责任民警</label>
                                    <span>{{facInfo.detaPoliceName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>大队责任民警</label>
                                    <span>{{facInfo.briPoliceName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属监理</label>
                                    <span>{{facInfo.supervisonName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>项目属性</label>
                                    <span>{{facInfo.oppmTypeName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>所属项目</label>
                                    <span>{{facInfo.projectName}}</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>维护次数</label>
                                    <span :class="{'mclass':mtimes>0}" @click="gotoList">{{mtimes}}次</span>
                                </el-col>
                                <el-col :span="9">
                                    <label>点位状态</label>
                                    <span>{{facInfo.faciceStatusName}}</span>
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
                            <!-- <el-row class="content-row-select" v-if="title=='优化申报'">
                                <el-col :span="9">
                                    <i class="redStar">*</i>
                                    <label class="content-label">优化方案</label>
                                    <el-input type="textarea" :rows="3" placeholder="" class="content-textarea" v-model="yhdesc" resize='none' :disabled="isOnlyRead">
                                    </el-input>
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

            <DialogGDMap :dialogVisible.sync="dialogMapVisible" @callback="setLocatInfo"></DialogGDMap>
        </div>
    </div>
</template>
<script>
    import mInput from "components/common/selectDrop";
    import DialogGDMap from "./business/dialog-gaodeMap";

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
                facTypeCode: [],
                facTypeList: [],
                roadOldList: [], // 原始的道路信息
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
                this.facCode = '';
                this.facName = '';
                if (val == '') {
                    this.squadronList = [];
                } else {
                    //所属中队
                    this.getDicInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfo.htm`, { parentId: val }).then(res => {
                        this.squadronList = res.resultList || [];
                    });
                }
            },
            facCode(val) {
                this.facRepeatCheck();
            },
            tainCode(val) {
                this.facTypeCode = [];
            },
            roadInfoList: {
                handler(newVal, oldVal) {
                    let oldArr = window.roadIds || []; //单纯的全局遍量
                    let newArr = [];
                    newVal.map((item) => {
                        newArr.push(item.roadId);
                    });
                    if (newArr.length == oldArr.length) {
                        newArr.map((item, index) => {
                            if (newArr[index] != oldArr[index]) {
                                console.log(index)
                                if (!newArr[index]) {

                                } else {

                                }
                            }
                        });
                    }
                    window.roadIds = newArr;
                },
                deep: true
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
            this.getDicInfo(`${this.$config.ubms_HOST}/DeptInfo/getDeptInfo.htm`, { deptRankCode: 'DEPTRANK04' }).then(res => {
                this.battalionList = res.resultList || [];
            });
            // 维修类型
            this.facTypeList = [{ dicCode: '1', dicName: '电子标志类' }, { dicCode: '2', dicName: '标志类' }, { dicCode: '3', dicName: '标线类' }, { dicCode: '4', dicName: '隔离设施类' }, { dicCode: '5', dicName: '临时设施类' }, { dicCode: '6', dicName: '其他类' }];
            // 所属道路
            this.addRoadInfo();
            this.getDevInfo('firstLoad');
        },
        methods: {
            submitForm() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                // if (this.battalionCode != 'REPDEVTYPE17') {
                //     if (this.battalionCode == "" || this.tainCode == "" || this.facCode == "" || this.sourceCode == "") {
                //         Common.ejMessage("warning", "请选择设备基本信息");
                //         return;
                //     }
                // } else {
                //     if (this.departCode == "" || this.tainCode == "" || this.facName == "" || this.sourceCode == "") {
                //         Common.ejMessage("warning", "请选择设备基本信息");
                //         return;
                //     }
                // }
                // if (this.isWarning) {
                //     Common.ejMessage("warning", "该设备已经报修过了，请勿重复提交");
                //     return;
                // }
                // if (this.gzList.length > 0 && this.gzCode == "") {
                //     Common.ejMessage("warning", "填写故障类型");
                //     return;
                // }
                if (this.gzdesc == "") {
                    Common.ejMessage("warning", "填写故障描述");
                    return;
                }
                // if (this.$route.query.type === 'optimize' && this.yhdesc == "") {
                //     Common.ejMessage("warning", "填写优化方案");
                //     return;
                // }

                let obj = {
                    facCategoryCode: 'REPDEVCATEGORY01',
                    facCategoryName: '外场智能设备',
                    battalionCode: this.battalionCode,
                    battalionName: this.battalionName,
                    typeCode: this.tainCode,
                    typeName: this.tainName,
                    facId: this.facCode,
                    facName: this.facName,
                    facAreaCode: this.areaCode,
                    facAreaName: this.areaName,
                    facDeptId: this.departCode,
                    facDeptName: this.departName,
                    repSourceCode: this.sourceCode,
                    repSourceName: this.sourceName,
                    detailAddr: this.address,
                    failureDescrible: this.gzdesc,
                    failureTypeCode: this.gzCode,
                    failureTypeName: this.gzName,
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
                this.battalionCode = '';
                this.battalionName = '';
                this.squadronCode = '';
                this.squadronName = '';
                this.tainCode = this.tainList[0].dicCode;
                this.tainName = this.tainList[0].dicName;
                this.address = '';
                this.facTypeCode = [];
                this.roadInfoList = [];
                this.addRoadInfo();
                this.gzdesc = '';

                this.imgSceneUrl = [];
                this.imgSceneList = [];
                this.imgSceneHide = [];
            },
            facRepeatCheck() {
                if (!this.facCode || !this.battalionCode || this.isOnlyRead) {
                    this.isWarning = false;
                    return;
                }

                let murl = '/workorders/facCheckWorkorders'; // 维修校验重复
                if (this.$route.query.type === 'optimize') {
                    murl = '/repairs/facCheckRepairs'; // 优化校验重复
                }
                this.$api.get(`${this.$config.efoms_HOST}${murl}`, {
                        facId: this.facCode,
                        battalionCode: this.battalionCode
                    }, { token: this.token })
                    .then(res => {
                        this.relationId = res.resultList || '';
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
            getDevInfo(val) {
                //路口点位,在设备类别已有的情况下
                this.getDicInfo(`${'http://192.168.91.121:8080/ubms-server' || this.$config.ubms_HOST}/RoadInfo/getPageRoadInfo.htm`, {
                    pageSize: 50,
                    currentPage: 1,
                    roadName: val == 'firstLoad' ? '' : val
                }).then(res => {
                    if (val == 'firstLoad') {
                        this.roadOldList = res.resultList.rows || [];
                        this.roadInfoList[0].roadList = res.resultList.rows || [];;
                    } else {
                        this.roadInfoList[this.roadIndex].roadList = res.resultList.rows || [];
                    }
                });
            },
            getRoadIndex(i) {
                this.roadIndex = i;
            },
            addRoadInfo() {
                this.roadInfoList.push({
                    roadId: '',
                    roadList: this.roadOldList || [],
                    aaa: '1',
                    isUse: true, // 当前数据是否有效
                })
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

                    /deep/ .d-select {
                        width: 160px;
                    }

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