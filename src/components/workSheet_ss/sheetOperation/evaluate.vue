<template>
    <!-- 评价 -->
    <div class="operation-info">
        <div class="operation-main" v-show="isShow">
            <div class="operation-title">
                <label for>评价操作</label>
                <i class="close" @click="close">X</i>
            </div>
            <div class="operation-content">
                <div class="complete-content">
                    <el-row class="content-row-select">
                        <el-col :span="3" v-for="(item,i) in evalItemList" :key="item.evalItemId">
                            <label>{{item.evalItemName}}</label>
                            <ul class="ul">
                                <li @click="setEvalGrades(i,index)" v-for="index in 5" :key="index" :class="{'active':index<=evalGradeList[i].evalGrades}"></li>
                            </ul>
                        </el-col>
                    </el-row>
                    <el-row class="content-row-select">
                        <el-col :span="20">
                            <label style="float: left;margin-right: 17px;">评价意见</label>
                            <el-input type="textarea" :rows="3" placeholder="请输入内容" class="content-textarea-fix" v-model="operExplain "></el-input>
                        </el-col>
                    </el-row>
                    <div class="ej-content-operation">
                        <div class="submit" @click="evaluateWorkorders">
                            <p>提交</p>
                        </div>
                        <div class="cancel" @click="close">
                            <p>取消</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="operation-btn" @click="isShow = true" v-show="!isShow">
            <span>评价操作</span>
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
                evalItemList: [],
                evalGradeList: [],
                isAjaxing: false
            };
        },
        mounted() {
            this.token = Common.getQueryString("token");
            this.workordersInfo = this.data || {};
            this.getEvalItemList().then(res => {
                if (res.appCode == 0) {
                    this.evalItemList = res.resultList || [];
                    this.evalItemList.forEach(e => {
                        this.evalGradeList.push({
                            evalItemId: e.evalItemId,
                            evalItemName: e.evalItemName,
                            evalGrades: 0,
                            evalExplain: e.evalItemExplain
                        });
                    });
                }
            });
        },
        methods: {
            getEvalItemList() {
                var header = {
                    "Content-Type": "application/x-www-form-urlencoded",
                    token: this.token
                };
                return this.$api.get(`${this.$config.efoms_HOST}/evalItem/getEvalItemList`, { token: this.token, data: '' }, header);
            },
            setEvalGrades(i, val) {
                this.evalGradeList[i].evalGrades = val;
            },
            // 评价接口
            evaluateWorkorders() {
                if (this.isAjaxing) {
                    alert('数据请求中，请稍等！');
                    return;
                }
                var url = `${this.$config.efoms_HOST}/workordersRecord/evaluateWorkorders`;
                url = url + '?token=' + this.token +
                    '&workordersId=' + this.workordersInfo.workordersId +
                    '&operExplain=' + this.operExplain;
                let arr = this.evalGradeList.some(res => parseInt(res.evalGrades) == 0);
                if (arr) {
                    Common.ejMessage('warning', '请评价星级');
                    return;
                }

                this.isAjaxing = true;
                this.$api.post(url, this.evalGradeList, { token: this.token })
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
            close() {
                this.isShow = false;
            }
        }
    };
</script>
<style scoped>
    .operation-info .operation-main .operation-content .complete-content .content-row-select ul li:hover~li {
        background-image: url("../../../assets/images/icon-star.png");
    }
</style>
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