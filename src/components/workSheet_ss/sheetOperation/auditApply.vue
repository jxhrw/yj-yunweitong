<template>
    <!-- 流程审核 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>审核操作</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content">
                <div class="complete-content">
                    <el-row v-if="isShowMaterial" class="content-row-select">
                        <el-col :span="18" class="col-flex">
                            <label class="mlgb" style="line-height: 28px;padding-right: 15px;margin-right: 0;">材料列表</label>
                            <span v-show="materialDtoList.length==0" style="line-height: 28px;">当前没有材料</span>
                            <div v-show="materialDtoList.length>0" class="col-table">
                                <div class="col-line">
                                    <span class="cl1">名称</span>
                                    <span class="cl2">规格</span>
                                    <span class="cl3">单位</span>
                                    <span class="cl4">单价</span>
                                    <span class="cl4">数量</span>
                                    <span class="cl4">金额</span>
                                    <span class="cl6">备注</span>
                                </div>
                                <el-scrollbar class="col-scroll">
                                    <div class="col-line" v-for="(item,index) in materialDtoList" :key="index">
                                        <span class="cl1">{{item.materialName}}</span>
                                        <span class="cl2">{{item.materialInfo|detail('materialSpecification')}}</span>
                                        <span class="cl3">{{item.materialUnit}}</span>
                                        <span class="cl4">{{item.materialInfo|detail('materialUnitPrice')}}</span>
                                        <span class="cl4">{{item.materialNum}}</span>
                                        <span class="cl4">{{item|money}}</span>
                                        <span class="cl6">{{item.memo}}</span>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <p style="text-align:right;">总金额： {{allMoney}}元</p>
                        </el-col>
                    </el-row>
                    <el-row v-if="title=='监理审核'" class="content-row-explain content-row-first">
                        <el-col :span="24" class="content-row-img">
                            <label>审核照片</label>
                            <template v-for="(item,index) in imgSceneUrl">
                                <div class="img-preview" :key="index">
                                    <el-image style="width: 100%; height: 100%" :src="item" :preview-src-list="imgSceneUrl.slice(index).concat(imgSceneUrl.slice(0,index))">
                                    </el-image>
                                    <div class="img-del" @click="delImg(index,'imgScene')">
                                        <p>删除</p>
                                    </div>
                                    <div class="img-del-x el-icon-close" @click="delImg(index,'imgScene')"></div>
                                </div>
                            </template>
                            <div class="img-add" @click="$refs.imgFile.click()">
                                <img src="../../../assets/images/icon-upload.png" width="24" height="24" alt="">
                                <input type="file" id="imgFile1" name="" style="display:none" ref="imgFile" @change="upload('imgFile1','img','imgScene')" multiple="multiple">
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <label style="float: left;margin-right: 17px;">审核意见</label>
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea-fix" v-model="operExplain "></el-input>
                        </el-col>
                    </el-row>
                    <div class="ej-content-operation">
                        <div class="submit" @click="auditMRepairs('1')">
                            <p>同意</p>
                        </div>
                        <div v-if="title!='经理审核'" class="cancel" @click="auditMRepairs('0')">
                            <p>拒绝</p>
                        </div>
                        <div v-if="title=='经理审核'" class="cancel" @click="auditMRepairs('01')">
                            <p>工程量驳回</p>
                        </div>
                        <div v-if="title=='经理审核'" class="cancel" @click="auditMRepairs('02')">
                            <p>维修驳回</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="operation-btn" @click="isShow = true" v-show="!isShow">
            <span>审核</span>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    export default {
        props: ['data', 'title'],
        data() {
            return {
                token: "",
                isShow: false,
                workordersInfo: {},
                operExplain: '',
                isAjaxing: false,
                isShowMaterial: false,
                materialDtoList: [],
                allMoney: '',

                imgSceneUrl: [], //图片地址集合,用于显示
                imgSceneList: [], //图片文件属性集合,用于上传
                imgSceneHide: [], //图片文件属性集合,存储上传成功返回值
            };
        },
        filters: {
            detail(val, key) {
                let obj = val.length > 0 ? val[0] : {};
                return obj[key];
            },
            money(val) {
                let list = val.materialInfo || [];
                let danj = list.length > 0 ? (list[0].materialUnitPrice || 0) : 0;
                let num = val.materialNum || 0;
                return Math.round(danj * num * 100) / 100;
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data || {};
            this.isShowMaterial = this.title == '经理审核' || this.title == '监理审核' || this.title == '中队验收' || this.title == '大队验收' || this.title == '民警验收' || this.title == '干部验收';
            if (this.isShowMaterial) {
                this.materialDtoList = this.workordersInfo.listMaterialRlt || [];
                let lst = this.workordersInfo.workordersRecordList || [];
                // FACILITYOPERTYPE15 工程量提报
                let result = lst.filter(item => item.operTypeCode == 'FACILITYOPERTYPE15');
                this.allMoney = result.length > 0 ? (result[result.length - 1].operResult || 0) : 0;
            }
        },
        methods: {
            // 审核接口
            auditMRepairs(isPass) {
                if (isPass == 0 && this.operExplain == '') {
                    Common.ejMessage("warning", "拒绝请填写审核意见");
                    return;
                }
                if ((isPass == '01' || isPass == '02') && this.operExplain == '') {
                    Common.ejMessage("warning", "驳回请填写审核意见");
                    return;
                }
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }

                this.isAjaxing = true;
                let murl = '';
                let apType;
                if (this.title == '大队道管审核') {
                    murl = '/signsWorkordersRecord/checkWorkordersByRoad';
                } else if (this.title == '大队领导审核') {
                    murl = '/signsWorkordersRecord/checkWorkordersByLeader';
                } else if (this.title == '设施科审核') {
                    murl = '/signsWorkordersRecord/checkWorkordersBySigns';
                } else if (this.title == '秩序处审核') {
                    murl = '/signsWorkordersRecord/checkWorkordersByOrder';
                } else if (this.title == '经理审核') {
                    murl = '/signsWorkordersRecord/checkWorkordersByManager';
                } else if (this.title == '监理审核') {
                    // murl = '/signsWorkordersRecord/checkWorkordersBySuper';
                    murl = '/signsWorkordersRecord/checkWorkordersBySuperNew';
                } else if (this.title == '中队验收') {
                    murl = '/signsWorkordersRecord/acceptWorkorders';
                    apType = '1';
                } else if (this.title == '大队验收') {
                    murl = '/signsWorkordersRecord/acceptWorkorders';
                    apType = '2';
                } else if (this.title == '民警验收') {
                    murl = '/signsWorkordersRecord/acceptWorkorders';
                    apType = '3';
                } else if (this.title == '干部验收') {
                    murl = '/signsWorkordersRecord/acceptWorkorders';
                    apType = '4';
                } else {
                    return;
                }

                let ajaxHandle;
                if (this.title == '监理审核') {
                    ajaxHandle = this.$api.post(`${this.$config.efoms_HOST}${murl}?signsWorkordersId=${this.workordersInfo.signsWorkordersId}&isPass=${isPass}&typeCode=${this.workordersInfo.typeCode}&type=${apType}&operExplain=${this.operExplain}`, this.imgSceneList, { token: this.token });
                } else {
                    ajaxHandle = this.$api.putByQs(`${this.$config.efoms_HOST}${murl}`, {
                        signsWorkordersId: this.workordersInfo.signsWorkordersId,
                        isPass: isPass,
                        typeCode: this.workordersInfo.typeCode,
                        type: apType,
                        operExplain: this.operExplain
                    }, { token: this.token });
                }
                ajaxHandle.then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.close();
                            this.$emit('callback');
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            close() {
                this.isShow = false;
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
                    case "otherFile":
                        flag = true;
                        break;
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
                                        fileMode: 0
                                    });
                                    break;
                                case "otherFile":
                                    let a = /\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(res.resultList.fileName);
                                    if (a) {
                                        if (this.$config.baseimgs) {
                                            this[`${arrNamePre}Url`].push(`${this.$config.baseimgs}?path=${res.resultList.downloadPath}&token=${this.token}`);
                                        } else {
                                            this[`${arrNamePre}Url`].push(res.resultList.downloadPath);
                                        }
                                    }

                                    this[`${arrNamePre}Hide`].push(res.resultList);
                                    this[`${arrNamePre}List`].push({
                                        fileName: file.name,
                                        fileURL: res.resultList.downloadPath,
                                        fileMode: 3
                                    });
                                    break;
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
        }
    };
</script>
<style lang="less" scoped>
    @import "../../../assets/less/operation.less";

    .operation-info .operation-main .operation-content {
        border-top: none;
        height: auto;
        padding-bottom: 20px;

        .complete-content {
            .content-textarea-fix {
                width: 400px;
                margin-left: 0;

                /deep/ .el-textarea__inner {
                    resize: none;
                }
            }

            .content-row-select {
                margin-top: 10px;
                margin-bottom: 15px;

                ul {
                    width: 100px;
                    height: 16px;
                    display: inline-block;

                    &:hover {
                        li {
                            background-image: url("../../../assets/images/icon-star-ful.png");
                        }
                    }

                    li {
                        float: left;
                        width: 20px;
                        height: 20px;
                        list-style: none;
                        background-image: url("../../../assets/images/icon-star.png");
                        cursor: pointer;

                        &.active {
                            float: left;
                            width: 20px;
                            height: 20px;
                            list-style: none;
                            background-image: url("../../../assets/images/icon-star-ful.png");
                        }
                    }
                }
            }
        }
    }

    .col-flex {
        display: flex;

        .mlgb {
            font-size: 12px;
            color: #737e84;
        }

        .col-table {
            margin-left: 5px;
            flex: 1;
            overflow: hidden;

            .col-line {
                display: flex;
                text-align: center;
                line-height: 28px;

                span {
                    .mlgb;
                }

                .cl1 {
                    flex: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding: 0 5px;
                }

                .cl2 {
                    width: 15%;
                    padding: 0 5px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .cl3 {
                    width: 10%;
                    padding: 0 5px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .cl4 {
                    width: 10%;
                    padding: 0 5px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .cl5 {
                    width: 10%;
                    padding: 0 5px;
                }

                .cl6 {
                    width: 15%;
                    padding: 0 5px;
                }

                .cl7 {
                    width: 50px;

                    i {
                        font-size: 18px;
                        cursor: pointer;
                    }
                }

                .cl8 {
                    width: 80px;

                    /deep/ .el-upload {
                        width: 48px;
                        height: 28px;
                        line-height: 32px;
                        border-style: solid;
                        background-color: #fff;
                        border-radius: 0;

                        .el-icon-plus {
                            font-size: 20px;
                        }
                    }

                    .ms-files {
                        display: inline-block;
                        overflow: hidden;
                        width: 48px;
                        height: 28px;
                        box-sizing: border-box;
                        border: 1px solid #d8d9da;
                        position: relative;
                        margin-right: 8px;

                        &:hover {
                            .ms-actions {
                                display: flex;
                            }
                        }

                        .el-image {
                            width: 48px;
                            height: 28px;

                            .el-image__error {
                                font-size: 12px;
                            }
                        }

                        .ms-actions {
                            position: absolute;
                            width: 100%;
                            height: 16px;
                            bottom: 0;
                            background: rgba(0, 0, 0, 0.3);
                            display: none;

                            .ms-delete {
                                color: #fff;
                                font-size: 12px;
                                line-height: 16px;
                                transform: scale(0.8);
                                white-space: nowrap;
                                cursor: pointer;
                            }
                        }

                        .icon-file {
                            width: 48px;
                            height: 28px;

                            &.file-doc {
                                background: url("../../../assets/images/file-word.png") no-repeat center/20px;
                            }

                            &.file-xls {
                                background: url("../../../assets/images/file-execl.png") no-repeat center/20px;
                            }

                            &.file-other {
                                background: url("../../../assets/images/file-file.png") no-repeat center/20px;
                            }
                        }
                    }
                }

                /deep/ .el-input__inner {
                    height: 28px;
                    width: 100%;
                }
            }

            .col-scroll {
                .col-line {
                    padding: 4px 0;
                    border-top: 1px solid #e4ebe9;
                }
            }
        }

        .col-scroll {

            /deep/ .el-scrollbar__wrap {
                overflow-x: hidden;
                max-height: 150px;
                margin-bottom: 0 !important;
            }
        }
    }

    .ej-content-operation::after {
        content: '';
        display: block;
        width: 100%;
        height: 0;
        clear: both;
    }
</style>