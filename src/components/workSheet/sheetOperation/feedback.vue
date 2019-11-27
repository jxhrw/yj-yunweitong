<template>
    <!-- 反馈 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>反馈操作</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content">
                <div class="complete-content">
                    <el-row class="content-row-select">
                        <el-col :span="9">
                            <label><span>*</span>故障类型</label>
                            <mInput :list="failureTypeList" :code.sync="failureTypeCode" :name.sync="failureTypeName"></mInput>

                        </el-col>
                        <el-col :span="9">
                            <label><span>*</span>维修结果</label>
                            <mInput :list="devStatusList" :code.sync="devStatusCode" :name.sync="devStatusName"></mInput>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-select">
                        <el-col :span="9">
                            <label class="content-label"><span>*</span>故障描述</label>
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea" v-model="failureReason" resize="none"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <label class="content-label"><span>*</span>结果反馈</label>
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea" v-model="operExplain" resize="none"></el-input>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-explain content-row-first">
                        <el-col :span="24" class="content-row-img">
                            <label>图片上传</label>
                            <template v-for="(item,index) in imgSceneUrl">
                                <div class="img-preview" :key="index">
                                    <el-image style="width: 100%; height: 100%" :src="item" :preview-src-list="imgSceneUrl">
                                    </el-image>
                                    <div class="img-del" @click="delImg(index,'imgScene')">
                                        <p>删除</p>
                                    </div>
                                </div>
                            </template>
                            <div class="img-add" @click="$refs.imgFile.click()">
                                <img src="../../../assets/images/icon-upload.png" width="24" height="24" alt="">
                                <input type="file" id="imgFile1" name="" style="display:none" ref="imgFile" @change="upload('imgFile1','img','imgScene')" multiple="multiple">
                            </div>
                        </el-col>
                    </el-row>
                    <div class="ej-content-operation">
                        <div class="submit" @click="fackbackWorkorders">
                            <p>提交</p>
                        </div>
                        <div class="cancel" @click="close">
                            <p>取消</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="operation-btn" @click="showFeedback" v-show="!isShow">
            <span>反馈操作</span>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import mInput from "@/components/common/selectDrop";
    export default {
        props: ['data'],
        components: {
            mInput
        },
        data() {
            return {
                token: "",
                workordersInfo: {},
                failureTypeCode: '',
                failureTypeName: '',
                failureTypeList: [],
                devStatusName: '',
                devStatusCode: '',
                devStatusList: [],
                failureReason: "",
                operExplain: "",
                imgSceneUrl: [], //图片地址集合,用于显示
                imgSceneList: [], //图片文件属性集合,用于上传
                imgSceneHide: [], //图片文件属性集合,存储上传成功返回值
                isShow: false,
                isAjaxing: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data || {};

            //故障类型
            this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { parentCode: this.workordersInfo.devTypeCode }).then(res => {
                this.failureTypeList = res.resultList || [];
            });
            //设备状态
            this.devStatusList = [{ dicCode: '1', dicName: '已修复' }, { dicCode: '0', dicName: '未修复' }];
            // this.getDicInfo(`${this.$config.ubms_HOST}/DeviceDic/getDeviceDic.htm`, { parentCode: "DEVICEALLSTATUS" }).then(res => {
            //     this.devStatusList = res.resultList || [];
            // });
        },
        watch: {},
        methods: {
            // 反馈接口
            fackbackWorkorders() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.failureTypeCode == '') {
                    Common.ejMessage("warning", "故障类型必填");
                    return;
                }
                if (this.devStatusCode == '') {
                    Common.ejMessage("warning", "维修结果必填");
                    return;
                }
                if (this.failureReason == '') {
                    Common.ejMessage("warning", "故障描述必填");
                    return;
                }
                if (this.operExplain == '') {
                    Common.ejMessage("warning", "结果反馈必填");
                    return;
                }
                var url = `${this.$config.efoms_HOST}/workordersRecord/fackbackWorkorders`;
                url = url + '?workordersId=' + this.workordersInfo.workordersId +
                    '&failureTypeCode=' + this.failureTypeCode +
                    '&failureTypeName=' + this.failureTypeName +
                    '&failureReason=' + this.failureReason +
                    '&operExplain=' + this.operExplain +
                    '&isOver=' + (this.devStatusCode == '1' ? '1' : '0');

                this.isAjaxing = true;
                this.$api.post(url, this.imgSceneList, { token: this.token })
                    .then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success", "操作成功");
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
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: this.token, data: JSON.stringify(obj) }, {}
                );
            },
            close() {
                this.isShow = false;
            },
            showFeedback() {
                if (!this.$parent.stopOpertion()) return;
                this.isShow = true;
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
        }
    };
</script>
<style lang="less" scoped>
    @import '../../../assets/less/operation.less';

    .operation-info .operation-main .operation-content {
        border-top: none;

        /deep/.d-select {
            width: 300px;
        }
    }
</style>