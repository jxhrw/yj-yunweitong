<template>
    <!-- 工程量申报 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>材料提交</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content" style="height: 420px;">
                <div class="complete-content">
                    <el-row class="content-row-select">
                        <el-col :span="18" class="col-flex">
                            <label style="padding-top:3px;">材料列表</label>
                            <div class="col-table">
                                <div class="col-line">
                                    <span class="cl1">名称</span>
                                    <span class="cl2">规格</span>
                                    <span class="cl3">单位</span>
                                    <span class="cl4">单价</span>
                                    <span class="cl5">数量</span>
                                    <span class="cl6">备注</span>
                                    <!-- <span class="cl8">附件</span> -->
                                    <span class="cl7"><i class="el-icon-circle-plus-outline" @click="openDialog"></i></span>
                                </div>
                                <el-scrollbar class="col-scroll">
                                    <div class="col-line" v-for="(item,index) in materialDtoList" :key="index">
                                        <span class="cl1">{{item.materialName}}</span>
                                        <span class="cl2">{{item.materialSpecification}}</span>
                                        <span class="cl3">{{item.materialUnit}}</span>
                                        <span class="cl4">{{item.materialUnitPrice}}</span>
                                        <el-input placeholder="请输入" v-model="item.materialNum" class="in cl5"></el-input>
                                        <el-input placeholder="请输入" v-model="item.memo" class="dialog-textarea cl6">
                                        </el-input>
                                        <!-- <div class="cl8" v-if="item.fileInfoList && item.fileInfoList.length>0">
                                            <template v-for="(res,ix) in item.fileInfoList">
                                                <div class="ms-files" :key="ix">
                                                    <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(res.fileName)" :src="$config.baseimgs?`${$config.baseimgs}?path=${res.fileURL}&token=${token}`:res.fileURL" :preview-src-list="[$config.baseimgs?`${$config.baseimgs}?path=${res.fileURL}&token=${token}`:res.fileURL]" fit="fill"></el-image>
                                                    <div v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(res.fileName)" :title="res.fileName" class="icon-file file-doc"></div>
                                                    <div v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(res.fileName)" :title="res.fileName" class="icon-file file-xls"></div>
                                                    <div v-else :title="res.fileName" class="icon-file file-other"></div>

                                                    <span class="ms-actions">
                                                        <span class="ms-delete" @click="handleDownload(res)">下载</span>
                                                        <span class="ms-delete" @click="handleRemove(res,ix,index)">删除</span>
                                                    </span>
                                                </div>
                                            </template>
                                        </div>
                                        <div class="cl8" v-else>
                                            <el-upload style="display:block;" :action="`${$config.efoms_HOST}/file/uploadFile`" list-type="picture-card" :headers="{token:token}" :on-success="handleSuccessList" :show-file-list="false" @click.native="materialListIndex=index">
                                                <i slot="default" class="el-icon-plus"></i>
                                            </el-upload>
                                        </div> -->
                                        <span class="cl7"><i class="el-icon-remove-outline" @click="removeMaterial(index)"></i></span>
                                    </div>
                                </el-scrollbar>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-select">
                        <el-col :span="18">
                            <label class="content-label" style="white-space: nowrap;width: 60px;margin-left: -12px;">工程量备注</label>
                            <el-input type="textarea" :rows="1" placeholder="请输入内容" class="content-textarea" style="width: calc(100% - 60px);" v-model="failureReason" resize="none"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <p style="text-align:right;">总金额： {{money}}元</p>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-explain content-row-first">
                        <el-col :span="24" class="content-row-img">
                            <label>维修照片</label>
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
                    <el-row class="content-row-explain content-row-first">
                        <el-col :span="24" class="content-row-img">
                            <label>材料附件</label>
                            <template v-for="(item,index) in imgOptList">
                                <div class="img-preview" :key="index">
                                    <el-image v-if="/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item.fileName)" style="width: 100%; height: 100%" :src="item.fileURL" :preview-src-list="[item.fileURL]"></el-image>
                                    <a v-else-if="/\.(doc|docx|DOC|DOCX)$/.test(item.fileName)" :title="item.fileName" class="icon-file file-doc" :href="item.fileURL"></a>
                                    <a v-else-if="/\.(xls|xlsx|XLS|XLSX)$/.test(item.fileName)" :title="item.fileName" class="icon-file file-xls" :href="item.fileURL"></a>
                                    <a v-else :title="item.fileName" class="icon-file file-other" :href="item.fileURL"></a>

                                    <div class="img-del" @click="delImg(index,'imgOpt')">
                                        <p>删除</p>
                                    </div>
                                </div>
                            </template>
                            <div class="img-add" @click="$refs.imgFileY.click()">
                                <img src="../../../assets/images/icon-upload.png" width="24" height="24" alt="">
                                <input type="file" id="imgFile2" name="" style="display:none" ref="imgFileY" @change="upload('imgFile2','otherFile','imgOpt')" multiple="multiple">
                            </div>
                        </el-col>
                    </el-row>
                    <div class="ej-content-operation" style="margin-top:18px;">
                        <div class="submit" @click="submitMaterial">
                            <p>提交</p>
                        </div>
                        <div class="cancel" @click="close">
                            <p>取消</p>
                        </div>
                    </div>

                    <el-dialog title="添加材料" :visible.sync="dialogMrVisible" width='800px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
                        <div class="dialog-main">
                            <div class="revoke-reason">
                                <div class="sb-search">
                                    <label>名称</label>
                                    <el-input v-model="name" placeholder="" size='mini' class="content-select" clearable @keyup.enter.native="searchTableInfo"></el-input>
                                    <!-- <label>设施类别</label>
                                    <mInput :list="departList" :code.sync="departCode" showAttr="deptName" getAttr="deptId" @keyup.enter.native="searchTableInfo"></mInput> -->
                                    <button @click="searchTableInfo">查询</button>
                                </div>

                                <el-table :highlight-current-row="false" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)" @select="handleSelect" @select-all="handleSelectAll" ref="multipleTable">
                                    <!-- <el-table-column type="index" label="序号" min-width="60"></el-table-column> -->
                                    <el-table-column type="selection" width="55"></el-table-column>
                                    <el-table-column prop="materialTypeName" label="设施类别" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="materialId" label="编码" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="materialName" label="名称" show-overflow-tooltip min-width="120"></el-table-column>
                                    <el-table-column prop="materialSpecification" label="规格" show-overflow-tooltip min-width="150"></el-table-column>
                                    <el-table-column prop="materialUnit" label="单位" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="materialUnitPrice" label="价格" show-overflow-tooltip></el-table-column>
                                    <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                      <i @click="addMarterial(scope.row)">选择</i>
                    </template>
                  </el-table-column> -->
                                </el-table>
                            </div>
                            <div>
                                <Paging ref="tableList" id="managePage" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" @pageAsk="searchPage"></Paging>
                            </div>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="subSelectToList" size='mini' class="submit">确 认</el-button>
                            <el-button @click="cancleSelect" size='mini' class="cancel">取 消</el-button>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </div>
        <div class="operation-btn" @click="showFeedback" v-show="!isShow">
            <span>材料提交</span>
        </div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    import mInput from "@/components/common/selectDrop";
    import Paging from "@/components/common/paging_new";
    var _THIS;
    export default {
        props: ['data'],
        components: {
            mInput,
            Paging
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

                imgOptUrl: [], //图片地址集合,用于显示
                imgOptList: [], //图片文件属性集合,用于上传
                imgOptHide: [], //图片文件属性集合,存储上传成功返回值
                isShow: false,
                isAjaxing: false,
                dialogMrVisible: false,

                isTableLoading: false,
                tableData: [],
                totalCount: 0,
                totalPage: 1,
                queryConditions: {},
                name: '',
                materialDtoList: [],
                materialListIndex: -1, // 当前处理材料列表的索引（关联附件）
                multipleSelection: [], // 弹窗选中的数据
                money: 0
            };
        },
        watch: {
            tableData(list) {
                this.$nextTick(() => {
                    this.multipleSelection.map((res) => {
                        let index = list.findIndex(item => item.materialId == res.materialId);
                        if (index > -1) {
                            this.$refs.multipleTable.toggleRowSelection(this.tableData[index], true);
                        }
                    });
                });
            },
            materialDtoList: {
                handler: (val) => {
                    let arr = val || [];
                    let num = 0;
                    arr.map(item => {
                        num += item.materialUnitPrice * (item.materialNum || 0)
                    });
                    _THIS.money = num;
                },
                deep: true
            }
        },
        mounted() {
            _THIS = this;
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data || {};
        },
        methods: {
            // 提交材料接口
            submitMaterial() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                // if (this.materialDtoList.length == 0) {
                //     Common.ejMessage("warning", "材料最少选择1条");
                //     return;
                // }

                this.isAjaxing = true;
                this.$api.post(`${this.$config.efoms_HOST}/signsWorkordersRecord/signsWorkordersMaterialNew?signsWorkordersId=${this.workordersInfo.signsWorkordersId}&operExplain=${this.failureReason}`,
                        // this.materialDtoList,
                        {
                            listMaterialRlt: this.materialDtoList,
                            fileInfoList: [...this.imgSceneList, ...this.imgOptList]
                        }, { token: this.token })
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
            currentSelect() {

            },
            subSelectToList() {
                this.dialogMrVisible = false;
                let abc = [];
                this.multipleSelection.map(item => {
                    let a = this.materialDtoList.some(res => res.materialId == item.materialId);
                    if (a) {
                        abc.push(item.materialName);
                    } else {
                        this.addMarterial(item);
                    }
                });
                if (abc.length > 0) Common.ejMessage("warning", `${abc.join(',')}已存在`);
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
            },
            cancleSelect() {
                this.dialogMrVisible = false;
                this.multipleSelection = [];
                this.$refs.multipleTable.clearSelection();
            },
            handleSelect(selection, row) {
                // console.log(selection);
                // console.log(row);
                let has = selection.some(res => res.materialId == row.materialId);
                if (has) {
                    this.multipleSelection.push(row);
                } else {
                    let i = -1;
                    this.multipleSelection.map((item, index) => {
                        if (item.materialId == row.materialId) {
                            i = index;
                        }
                    });
                    if (i > -1) this.multipleSelection = this.multipleSelection.splice(i, 1);
                }
                console.log('我是：', this.multipleSelection)
            },
            handleSelectAll(selection) {
                // console.log(selection);
                // 长度>0全选，=0全不选
                if (selection.length > 0) {
                    this.tableData.map(res => {
                        let exs = this.multipleSelection.some(item => item.materialId == res.materialId);
                        if (!exs) {
                            this.multipleSelection.push(res);
                        }
                    });
                } else {
                    this.tableData.map(res => {
                        let i = this.multipleSelection.findIndex(item => item.materialId == res.materialId);
                        if (i > -1) {
                            this.multipleSelection.splice(i, 1);
                        }
                    });
                }
                console.log('我是：', this.multipleSelection)
            },
            // 材料申请 - 处理
            handleSuccessList(response, file, fileList) {
                console.log(response);
                if (response.appCode == '0') {
                    let res = response.resultList || {};
                    this.materialDtoList[this.materialListIndex].fileInfoList.push({
                        secondDir: res.secondDir,
                        fileName: res.fileName,
                        fileOldName: res.fileOldName,
                        fileURL: res.downloadPath,
                        fileMode: res.fileOldName
                            .slice(res.fileOldName.lastIndexOf(".") + 1)
                            .toLowerCase()
                    });
                }
            },
            handleRemove(e, index, parentIndex) {
                if (parseInt(parentIndex) == parentIndex) {
                    this.materialDtoList[parentIndex].fileInfoList.splice(index, 1);
                }

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
            handleDownload(e) {
                window.location.href = e.fileURL;
            },
            addMarterial(data) {
                // Common.ejMessage("success", `已选择${data.materialName}`);
                this.materialDtoList.push({
                    workRecordId: this.workordersInfo.signsWorkordersId,
                    materialId: data.materialId,
                    materialCode: data.materialCode,
                    materialName: data.materialName,
                    materialSpecification: data.materialSpecification,
                    materialUnit: data.materialUnit,
                    materialUnitPrice: data.materialUnitPrice,
                    materialNum: 1,
                    memo: '',
                    fileInfoList: []
                });
            },
            removeMaterial(index) {
                this.materialDtoList.splice(index, 1);
            },
            // 材料申请处理结束
            searchTableInfo() {
                this.queryConditions = {
                    pageSize: 10,
                    currentPage: 1,
                    materialName: this.name
                };
                this.searchPage();
            },
            searchPage() {
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
                        if (err && err.message && err.message == '主动取消') {
                            console.log(err.message);
                        } else {
                            this.isTableLoading = false;
                            Common.printErrorLog(err);
                        }
                    });
            },
            openDialog() {
                this.dialogMrVisible = true;
                if (this.tableData.length == 0) {
                    this.searchTableInfo();
                }
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
            async showFeedback() {
                if (!(await this.$parent.stopOpertion())) return;
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
    @import "../../../assets/less/dialog.less";
    @import "../../../assets/less/operation.less";

    .operation-info .operation-main .operation-content {
        border-top: none;
        height: 350px;

        /deep/.d-select {
            width: 300px;
        }
    }

    .col-flex {
        display: flex;

        .col-table {
            margin-left: 5px;
            flex: 1;
            overflow: hidden;

            .col-line {
                display: flex;
                text-align: center;
                line-height: 28px;

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
            height: 150px;

            /deep/ .el-scrollbar__wrap {
                overflow-x: hidden;
            }
        }
    }

    .sb-search {
        margin-bottom: 10px;

        /deep/ .d-select,
        .content-select {
            width: 200px !important;
        }

        button {
            background: #00c187;
            border-radius: 1px;
            width: 60px;
            height: 28px;
            text-align: center;
            line-height: 28px;
            cursor: pointer;
            font-size: 12px;
            color: #ffffff;
            border: none;
            float: right;
        }
    }

    .content-table {
        /deep/ table {
            thead tr th {
                background: #f9fafc;
                text-align: center;
                line-height: 16px;

                &>.cell {
                    color: #737e84;
                    font-size: 12px;
                    line-height: 16px;
                }

                td {
                    font-size: 12px;
                }
            }

            tbody {
                tr {
                    &>td {
                        font-size: 12px;
                        color: #4f5a64;
                        text-align: center;
                    }

                    &:hover>td {
                        background: rgba(0, 243, 170, 0.1);
                    }

                    td {
                        font-size: 12px;
                        line-height: 16px;

                        &>.cell {
                            line-height: 16px;

                            i {
                                color: #00c187;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }

    .dialog-main {
        /deep/ .page-size {
            display: none !important;
        }

        /deep/ .my-el-page {
            position: relative;
            top: -2px;
        }
    }

    .dialog-footer {
        margin-top: -30px;
    }

    .content-table /deep/ .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
    .content-table /deep/ .el-table__body tr.current-row>td,
    .content-table /deep/ .el-table__body tr.hover-row.current-row>td,
    .content-table /deep/ .el-table__body tr.hover-row.el-table__row--striped.current-row>td,
    .content-table /deep/ .el-table__body tr.hover-row.el-table__row--striped>td,
    .content-table /deep/ .el-table__body tr.hover-row>td {
        background: #00c187;
        color: #ffffff;
    }

    .content-table /deep/ .el-table--striped .el-table__body tr.el-table__row--striped.current-row td .tab-operation,
    .content-table /deep/ .el-table__body tr.current-row>td .tab-operation,
    .content-table /deep/ .el-table__body tr.hover-row.current-row>td .tab-operation,
    .content-table /deep/ .el-table__body tr.hover-row.el-table__row--striped.current-row>td .tab-operation,
    .content-table /deep/ .el-table__body tr.hover-row.el-table__row--striped>td .tab-operation,
    .content-table /deep/ .el-table__body tr.hover-row>td .tab-operation {
        color: #ffffff;
    }
</style>
<style lang="less">
    @import "../../../assets/css/tableHeight.css";
</style>