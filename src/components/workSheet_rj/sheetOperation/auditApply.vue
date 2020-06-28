<template>
    <!-- 科室/处室审核 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>审核操作</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content">
                <div class="complete-content">
                    <el-row class="content-row-select" v-if="$route.query.pre=='科室审核'">
                        <el-col :span="20">
                            <label>维修期限</label>
                            <el-input type="text" placeholder="请输入天数" class="content-textarea-fix height" v-model="dayNum" resize="none"></el-input>
                            <span>天</span>
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
                        <div class="cancel" @click="auditMRepairs('0')">
                            <p>拒绝</p>
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
        props: ['data'],
        data() {
            return {
                token: "",
                isShow: false,
                workordersInfo: {},
                operExplain: '',
                dayNum: '',
                isAjaxing: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data || {};
            if (this.$route.query.pre == '科室审核') {
                this.getDeadlineTime();
            }
        },
        methods: {
            // 审核接口
            auditMRepairs(isPass) {
                if (this.dayNum) {
                    if (!(/^\d+(\.\d{1})?$/.test(this.dayNum))) {
                        Common.ejMessage("warning", "延期天数最多一位小数");
                        return;
                    }
                    if (!(parseFloat(this.dayNum) > 0)) {
                        Common.ejMessage("warning", "延期天数需大于零");
                        return;
                    }
                }
                if (isPass == 0 && this.operExplain == '') {
                    Common.ejMessage("warning", "拒绝请填写审核意见");
                    return;
                }
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }

                let prePage = this.$route.query.pre;
                let murl = '';
                if (prePage == '科室审核') {
                    murl = '/workordersOther/checkWorkordersOtherByKS';
                } else if (prePage == '处室审核') {
                    murl = '/workordersOther/checkWorkordersOtherByCS';
                }

                this.isAjaxing = true;
                this.$api.putByQs(`${this.$config.efoms_HOST}${murl}`, {
                        workOtherId: this.workordersInfo.workOtherId,
                        isPass: isPass,
                        operExplain: this.operExplain,
                        dayNum: this.dayNum
                    }, { token: this.token })
                    .then(res => {
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
            // 获取默认完成时间
            getDeadlineTime() {
                this.$api.get(`${this.$config.efoms_HOST}/workorderDeadline/selectDeadlineConfList`, {
                        devTypeCode: this.workordersInfo.systemCode,
                        typeCode: this.workordersInfo.typeCode,
                        isUse: 1,
                        workType: 4, // 工单类型：1、设备；2、设施；3、系统、4其他
                    }, { token: this.token })
                    .then(res => {
                        if (res.appCode == 0) {
                            let num = 24;
                            if (res.resultList && res.resultList.length > 0) {
                                num = res.resultList[0].deadlineTime || 24;
                            }
                            this.dayNum = Math.round(num / 24 * 10) / 10;
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
        height: 181px;

        .complete-content {
            .content-textarea-fix {
                width: 400px;
                margin-left: 0;

                /deep/ .el-textarea__inner {
                    resize: none;
                }

                &.height {
                    /deep/ .el-input__inner {
                        height: 30px;
                        font-size: 12px;
                    }
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
</style>