<template>
    <div class="ej-main">
        <WkLayout ref="layout" :title="'app版本管理'" :queryConditions="queryConditions" :totalPage="totalPage" :totalCount="totalCount" @searchTable="searchTableInfo" @searchPage="searchPageInfo" tableTitle="历史记录" class="search-hide">

            <template slot="tableBtn">
                <div class="operation export" @click="openDetail">
                    <p>添加</p>
                </div>
            </template>

            <template slot="table">
                <el-table :highlight-current-row="false" :data="tableData" border @current-change='currentSelect' class="content-table" v-loading="isTableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <!-- <el-table-column type="index" label="序号"></el-table-column> -->
                    <el-table-column prop="versionId" label="主键ID" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="versionCode" label="版本值" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="versionName" label="版本编号" show-overflow-tooltip></el-table-column>
                    <el-table-column label="强制更新" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i v-if="scope.row.versionInstall == '1'" class="el-icon-circle-check m-icon green"></i>
                            <i v-else class="el-icon-circle-close m-icon red"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="downloadUrl" label="下载地址" show-overflow-tooltip min-width="200"></el-table-column>
                    <el-table-column prop="versionSize" label="APK大小" show-overflow-tooltip>
                        <!-- <template slot-scope="scope">
                            {{scope.row.versionSize>0?`${scope.row.versionSize}MB`:''}}
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="description" label="更新文案" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip min-width="120">
                        <template slot-scope="scope">
                            {{scope.row.createTime|timeStamp}}
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </WkLayout>

        <el-dialog title="添加" :visible.sync="detailVisible" width='400px' class="dialog-urge" :modal="$store.getters.getIsHeadMenuVisible">
            <div class="dialog-main">
                <div class="revoke-reason">
                    <label class="dialog-label"><span style="left:5px;">*</span>版本值</label>
                    <el-input v-model="addInfo.versionCode" size='mini' class="dialog-select" clearable></el-input>
                </div>
                <div class="revoke-reason">
                    <label class="dialog-label"><span>*</span>版本编号</label>
                    <el-input v-model="addInfo.versionName" size='mini' class="dialog-select" clearable></el-input>
                </div>
                <div class="revoke-reason" style="line-height:28px;">
                    <label class="dialog-label"><span>*</span>强制更新</label>
                    <el-radio v-model="addInfo.versionInstall" label="1">是</el-radio>
                    <el-radio v-model="addInfo.versionInstall" label="0">否</el-radio>
                </div>
                <div class="revoke-reason">
                    <label class="dialog-label"><span>*</span>apk上传</label>
                    <div class="ds-flex">
                        <div v-if="addInfo.downloadUrl" class="img-preview">
                            <i class="el-icon-goods"></i>
                            <div class="img-del" @click="delImg()">
                                <p>删除</p>
                            </div>
                        </div>
                        <div v-else class="img-add" @click="$refs.imgFile.click()">
                            <img src="../../assets/images/icon-upload.png" width="24" height="24" alt="">
                            <input type="file" id="apkFile" name="" style="display:none" ref="imgFile" @change="upload()" multiple="multiple">
                        </div>
                    </div>

                </div>
                <div class="revoke-reason">
                    <label class="dialog-label">更新文案</label>
                    <el-input rows="6" type="textarea" placeholder="请输入" v-model="addInfo.description" class="dialog-textarea height100" style="width:280px;">
                    </el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveItem" size='mini' class="submit">提 交</el-button>
                <el-button @click="detailVisible = false" size='mini' class="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import WkLayout from "components/common/wklayout";
    import mInput from "components/common/selectDrop";
    import Common from "@/assets/js/common.js";
    export default {
        components: {
            WkLayout,
            mInput
        },
        filters: {
            timeStamp(val) {
                if (val == parseInt(val)) {
                    return Common.dateFormat('yyyy-MM-dd hh:mm:ss', new Date(parseInt(val)));
                }
            }
        },
        watch: {
            $route(newVal, oldVal) {
                if (newVal.path === oldVal.path && newVal.path === '/app') {
                    this.initPage();
                }
            }
        },
        data() {
            return {
                title: '',
                token: "",
                isTableLoading: false,
                tableData: [],
                totalCount: 10,
                totalPage: 1,
                queryConditions: {},
                detailInfo: {},

                isAjaxing: false,
                detailVisible: false,
                addInfo: {
                    versionCode: '',
                    versionName: '',
                    versionInstall: '',
                    downloadUrl: '',
                    versionSize: '',
                    description: ''
                },
            };
        },
        methods: {
            searchTableInfo() {
                console.log("table");
                let pageSize = this.queryConditions.pageSize || 10;
                this.queryConditions = {
                    pageSize: pageSize,
                    currentPage: 1,
                };
                this.searchPageInfo();
            },
            searchPageInfo() {
                console.log("page");
                this.tableData = [];
                this.isTableLoading = true;
                this.$api.get(`${this.$config.efoms_HOST}/api/version/pageVersion`, this.queryConditions, { token: this.token })
                    .then(res => {
                        setTimeout(load => {
                            this.isTableLoading = false;
                        }, 500);
                        if (res.appCode == 0) {
                            this.tableData = res.resultList.result;
                            this.totalPage = res.resultList.totalPage;
                            this.totalCount = res.resultList.totalCount;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isTableLoading = false;
                        Common.printErrorLog(err);
                    });
            },
            openDetail() {
                this.detailVisible = true;
                Object.keys(this.addInfo).forEach((key) => {
                    this.addInfo[key] = '';
                });
            },
            saveItem() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                if (this.addInfo.versionCode == '') {
                    Common.ejMessage("warning", "版本值必填");
                    return;
                }
                if (this.addInfo.versionName == '') {
                    Common.ejMessage("warning", "版本编号必填");
                    return;
                }
                if (this.addInfo.versionInstall == '') {
                    Common.ejMessage("warning", "强制更新必选");
                    return;
                }
                if (this.addInfo.downloadUrl == '') {
                    Common.ejMessage("warning", "请上传apk");
                    return;
                }

                this.isAjaxing = true;
                this.$api.post(`${this.$config.efoms_HOST}/api/version/create`, this.addInfo, { token: this.token }).then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage("success");
                            this.detailVisible = false;
                            this.searchTableInfo();
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            upload() {
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json;charset=UTF-8",
                    token: this.token
                };
                var formData = new FormData();
                var file = document.getElementById('apkFile').files[0];
                formData.append("file", file);
                let size = file.size > 0 ? `${parseInt((file.size/(1024*1024))*100) / 100}MB` : 0;

                this.$api.post(`${this.$config.efoms_HOST}/file/uploadFile`, formData, header).then(res => {
                        if (res.appCode == 0) {
                            this.addInfo.versionSize = size;
                            this.addInfo.downloadUrl = res.resultList.downloadPath;
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        Common.printErrorLog(err);
                    });
            },
            delImg() {
                this.addInfo.downloadUrl = '';
            },
            currentSelect(e) {
                console.log(e);
                this.detailInfo = e || {};
            },
            dataDetail(item) {
                sessionStorage.setItem('relaodPage', '1'); // 返回需要刷新当前页数据
                this.$router.push({
                    path: "/detCab",
                    query: { id: item.deviceId }
                });
            },
            // 字典类型接口
            getDicInfo(url, obj) {
                return this.$api.get(
                    url, { token: this.token, data: JSON.stringify(obj) }, {}
                );
            },
            // 页面初始化
            initPage() {
                this.queryConditions = {};
                this.detailInfo = {};
                this.$refs.layout.conditionVisible = false;
                this.token = Common.getQueryString("token");

                this.searchTableInfo();
            }
        },
        mounted() {
            this.token = Common.getQueryString("token");
        },
        activated() {
            if (!this.$route.meta.isUseCache) {
                console.log('新');
                sessionStorage.setItem('relaodPage', '0');
                this.initPage();
            } else {
                console.log('旧');
                // 回到列表，如果回到的不是同一个列表则需要刷新
                // 根据是否点击菜单判断
                if (sessionStorage.getItem('menuSeclect') === '1') {
                    sessionStorage.setItem('menuSeclect', '0');
                    this.initPage();
                }

                // 点击编辑去的详情回来列表要刷新
                else if (sessionStorage.getItem('relaodPage') == '1') {
                    sessionStorage.setItem('relaodPage', '0');
                    this.searchPageInfo();
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.name == 'detCab') {
                from.meta.isUseCache = true;
                sessionStorage.setItem('menuSeclect', '0');
            } else {
                from.meta.isUseCache = false;
            }
            next();
        },
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import "../../assets/less/baseInfo.less";
    @import "../../assets/less/depiction.less";
    @import "../../assets/less/list.less";
    @import "../../assets/less/dialog.less";

    .search-hide {
        /deep/ .base-info {
            display: none;
        }
    }

    .m-icon {
        font-size: 16px;

        &.green {
            color: #00c187;
        }

        &.red {
            color: #fb6849;
        }
    }

    .ds-flex {
        display: flex;

        .img-preview {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            position: relative;
            border: 1px solid #e1e7ed;
            font-size: 50px;
            position: relative;
            text-align: center;

            &:hover {
                .img-del {
                    display: block;
                }
            }

            .img-del {
                opacity: .62;
                background: #7a7a7a;
                width: 100%;
                height: 15px;
                position: absolute;
                bottom: 0;
                display: none;
                line-height: 15px;
                font-size: 12px;
                text-align: center;
                left: 0;

                p {
                    // transform: scale(0.86);
                    color: #fff;
                    cursor: pointer;
                }
            }
        }

        .img-add {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            background: #fff;
            border: 1px solid #e1e7ed;
            cursor: pointer;
        }
    }
</style>
<style lang="less">
    @import "../../assets/css/tableHeight.css";
    @import "../../assets/less/tAll.less";

    .ej-content-scrollbar {
        height: 100%;
    }

    .ej-content-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden;
    }
</style>