<template>
    <div class="ej-main">
        <div class="ej-content">
            <div class="ej-content-title">
                <h2>知识{{knowledgeInfo.knowledgeId?'详情':'发布'}}</h2>
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
                                <el-col :span="18" class="col-flex">
                                    <label>知识分类</label>
                                    <mInput :list="typeList" :code.sync="typeCode" :name.sync="typeName" :disabled="isOnlyRead" :clearable="true"></mInput>
                                </el-col>
                                <el-col :span="18" class="col-flex">
                                    <label>标题</label>
                                    <el-input v-model="titleName" placeholder="" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="true"></el-input>
                                </el-col>
                                <el-col :span="18" class="col-flex">
                                    <label>关键字</label>
                                    <el-input v-model="keyWord" placeholder="请输入关键字" size='mini' class="content-select" :disabled="isOnlyRead" :clearable="false" @blur="addTags($event)" @keyup.enter.native="addTags($event)"></el-input>
                                    <div class="col-div">
                                        <el-tag v-for="(item,index) in keyList" :key="index" type="info" effect="light" class="a-tag active" closable @close="removeTags(item)">
                                            {{ item }}
                                        </el-tag>
                                    </div>
                                </el-col>
                                <el-col :span="18" class="col-flex">
                                    <label>内容</label>
                                    <div class="col-div">
                                        <Ueditor ref="richtext"></Ueditor>
                                    </div>
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
            </div>
        </div>
    </div>
</template>
<script>
    import mInput from "components/common/selectDrop";
    import Bus from "@/assets/js/bus.js";
    import Common from "@/assets/js/common.js";
    import Ueditor from "components/common/ueditor";
    export default {
        components: {
            mInput,
            Ueditor
        },
        data() {
            return {
                title: "",
                token: "",
                typeCode: '',
                typeName: '',
                typeList: [],
                titleName: '',
                keyWord: '',
                keyList: [],
                ruchText: '<p>故障现象:</p><p><br/></p><p><br/></p><p>故障原因:</p><p><br/></p><p><br/></p><p>解决方案:</p>',
                knowledgeInfo: {},

                isOnlyRead: false,
                isAjaxing: false, //是否在请求中
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.isOnlyRead = this.$route.query.isread != 'edit';
            // 分类
            this.typeList = [{ dicCode: '1', dicName: '考核制度' }, { dicCode: '2', dicName: '经验交流' }, { dicCode: '3', dicName: '点位相关' }, { dicCode: '4', dicName: '其他' }];
            this.getKnowInfo();
        },
        methods: {
            submitForm() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                let obj = {
                    knowledgeId: this.knowledgeInfo.knowledgeId,
                    typeCode: this.typeCode,
                    typeName: this.typeName,
                    titleName: this.titleName,
                    keyWord: this.keyList.join(','),
                    content: this.$refs.richtext.msg
                };

                let murl = `${this.$config.efoms_HOST}/Knowledge/insertKnowledgeInfo?token=${this.token}`;
                let type = 'add';
                if (this.knowledgeInfo.knowledgeId) {
                    murl = `${this.$config.efoms_HOST}/Knowledge/updateKnowledgeInfo?token=${this.token}`;
                    type = 'update';
                }

                this.isAjaxing = true;
                this.$api.post(murl, obj, { token: this.token }).then(res => {
                        this.isAjaxing = false;
                        if (res.appCode == 0) {
                            Common.ejMessage('success', `知识${type=='add'?'发布':'更新'}成功`);
                            this.$set(this.knowledgeInfo, 'knowledgeId', (res.resultList || this.knowledgeInfo.knowledgeId));
                        } else {
                            Common.printErrorLog(res);
                        }
                    })
                    .catch(err => {
                        this.isAjaxing = false;
                        Common.printErrorLog(err);
                    });
            },
            getKnowInfo() {
                let id = this.$route.query.id;
                if (id) {
                    this.$api.get(`${this.$config.efoms_HOST}/Knowledge/getKnowledgeInfoById`, { knowledgeId: id }, { token: this.token }).then(res => {
                            this.isAjaxing = false;
                            if (res.appCode == 0) {
                                this.knowledgeInfo = res.resultList || {};
                                this.typeCode = this.knowledgeInfo.typeCode;
                                this.typeName = this.knowledgeInfo.typeName;
                                this.titleName = this.knowledgeInfo.titleName;
                                if (this.knowledgeInfo.keyWord) {
                                    this.keyList = this.knowledgeInfo.keyWord.split(',');
                                }
                                this.$nextTick(() => {
                                    this.$refs.richtext.msg = this.knowledgeInfo.content;
                                });
                            } else {
                                Common.printErrorLog(res);
                            }
                        })
                        .catch(err => {
                            this.isAjaxing = false;
                            Common.printErrorLog(err);
                        });
                } else {
                    this.$nextTick(() => {
                        this.$refs.richtext.msg = this.ruchText;
                    });
                }
            },
            addTags(e) {
                let word = e.target.value;
                setTimeout(() => { e.target.value = ''; }, 50);
                if (word.length > 0 && word.replace(/ /g, '') == '') {
                    Common.ejMessage('warning', '关键字不能为空字符');
                    return;
                }
                let hasIt = this.keyList.some(res => res == word);
                if (hasIt) Common.ejMessage('warning', '关键字已存在');
                if (!hasIt && word) this.keyList.push(word);
            },
            removeTags(val) {
                this.keyList = this.keyList.filter(res => res != val);
            },
            goBack() {
                window.history.back();
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

            .col-flex {
                display: flex;

                // align-items: center;
                label {
                    line-height: 28px;
                }

                .content-select {
                    height: 28px;
                }

                .col-div {
                    flex: 1;
                    overflow: hidden;

                    .a-tag {
                        margin: 0 5px;
                        cursor: pointer;
                        height: auto;
                        padding: 5px;
                        line-height: 16px;
                        min-height: 28px;
                        max-width: 99%;
                        white-space: normal;
                        word-break: break-all;
                        padding-right: 25px;
                        position: relative;

                        &.active {
                            background-color: #00c187;
                            color: #fff;
                        }

                        /deep/ &.el-tag.el-tag--info .el-tag__close {
                            color: #fff;
                            position: absolute;
                            right: 5px;
                            top: 50%;
                            transform: translateY(-45%);

                            &:hover {
                                color: #909399;
                                background-color: #ffffff;
                            }
                        }
                    }
                }
            }
        }

        /deep/ .el-input.is-disabled .el-input__inner {
            color: #737e84;
        }

        .el-icon-location-outline {
            cursor: pointer;
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