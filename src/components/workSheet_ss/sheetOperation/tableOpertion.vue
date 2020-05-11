<template>
    <div class="unit-tab-operation">
        <!-- 维修申报页面，并且状态为大队道管待审核FACILITYSTATUS01时出现，设施科待审核FACILITYSTATUS03 -->
        <div v-if="(title=='维修申报'||title=='抢修申报'||title=='优化申报')&&(scope.row.workordersStatusCode == 'FACILITYSTATUS01'||scope.row.workordersStatusCode == 'FACILITYSTATUS03')" class="tab-operation" @click="dataDetail(scope.row,'edit')">撤销</div>
        <!-- 数字城管页面，并且状态为待下发FACILITYSTATUS06时出现 -->
        <div v-if="(title=='数字城管')&&(scope.row.workordersStatusCode == 'FACILITYSTATUS06')" class="tab-operation" @click="dataDetail(scope.row,'edit')">撤销</div>
        <!-- 流程审核页面+并且状态为待审核时出现 -->
        <div v-if="(title=='大队道管审核'&&scope.row.workordersStatusCode == 'FACILITYSTATUS01')" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div>
        <div v-if="(title=='大队领导审核'&&scope.row.workordersStatusCode == 'FACILITYSTATUS02')" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div>
        <div v-if="(title=='设施科审核'&&scope.row.workordersStatusCode == 'FACILITYSTATUS03')" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div>
        <div v-if="(title=='秩序处审核'&&scope.row.workordersStatusCode == 'FACILITYSTATUS04')" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div>
        <!-- 工单下发页面，并且状态为待下发FACILITYSTATUS06时出现，下发已拒绝，审核通过FACILITYSTATUS25 -->
        <div v-if="title=='工单下发'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS06'||scope.row.workordersStatusCode == 'FACILITYSTATUS25')" class="tab-operation" @click="dataDetail(scope.row,'edit')">下发</div>
        <!-- 工单指派页面，并且状态为待指派FACILITYSTATUS07时出现,指派已拒绝FACILITYSTATUS08，维修驳回（FACILITYSTATUS10） -->
        <div v-if="title=='工单指派'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS07'||scope.row.workordersStatusCode == 'FACILITYSTATUS08'||scope.row.workordersStatusCode == 'FACILITYSTATUS10')" class="tab-operation" @click="dataDetail(scope.row,'edit')">指派</div>
        <!-- 维修处置页面，并且状态为待维修（FACILITYSTATUS09），已到达（FACILITYSTATUS11），时出现 -->
        <div v-if="title=='维修处置'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS09'||scope.row.workordersStatusCode == 'FACILITYSTATUS11')" class="tab-operation" @click="dataDetail(scope.row,'edit')">反馈</div>
        <!-- 工程量提报页面，并且状态为工程量提报（FACILITYSTATUS12），工程量驳回（FACILITYSTATUS13）时出现 -->
        <div v-if="title=='工程量提报'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS12'||scope.row.workordersStatusCode == 'FACILITYSTATUS13')" class="tab-operation" @click="dataDetail(scope.row,'edit')">材料提交</div>
        <!-- 经理审核页面，并且状态为待确认,驳回，验证不通过 FACILITYSTATUS22 时出现 -->
        <div v-if="title=='经理审核'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS14'||scope.row.workordersStatusCode == 'FACILITYSTATUS16'||scope.row.workordersStatusCode == 'FACILITYSTATUS22')" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div>
        <!-- 监理审核页面，并且状态为待确认时出现 -->
        <div v-if="title=='监理审核'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS15')" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div>
        <!-- 中队验收页面，并且状态为待验收 FACILITYSTATUS17，中队待验收 FACILITYSTATUS18 时出现 -->
        <div v-if="title=='中队验收'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS17'||scope.row.workordersStatusCode == 'FACILITYSTATUS18')" class="tab-operation" @click="dataDetail(scope.row,'edit')">验收</div>
        <!-- 大队验收页面，并且状态为待验收,大队待验收FACILITYSTATUS19时出现 -->
        <div v-if="title=='大队验收'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS17'||scope.row.workordersStatusCode == 'FACILITYSTATUS19')" class="tab-operation" @click="dataDetail(scope.row,'edit')">验收</div>
        <!-- 民警验收页面，并且状态为待验收，民警待验收FACILITYSTATUS20时出现 -->
        <div v-if="title=='民警验收'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS17'||scope.row.workordersStatusCode == 'FACILITYSTATUS20')" class="tab-operation" @click="dataDetail(scope.row,'edit')">验收</div>
        <!-- 干部验收页面，并且状态为待验收,干部待验收FACILITYSTATUS21 时出现 -->
        <div v-if="title=='干部验收'&&(scope.row.workordersStatusCode == 'FACILITYSTATUS17'||scope.row.workordersStatusCode == 'FACILITYSTATUS21')" class="tab-operation" @click="dataDetail(scope.row,'edit')">验收</div>
        <!-- 工单确认页面，并且状态为待确认时出现 -->
        <!-- <div v-if="title=='工单确认'&&(scope.row.workordersStatusCode == 'ORDERSSTATUS03'||scope.row.workordersStatusCode == 'ORDERSSTATUS04')" class="tab-operation" @click="dataDetail(scope.row,'edit')">确认</div> -->
        <!-- 工单评价页面，并且状态为待评价时出现 -->
        <!-- <div v-if="title=='工单评价'&&scope.row.workordersStatusCode == 'ORDERSSTATUS06'" class="tab-operation" @click="dataDetail(scope.row,'edit')">评价</div> -->
        <!-- 延期审核页面，并且状态为待审核时出现 -->
        <div v-if="title=='延期审核'&&(scope.row.isDefer===true||scope.row.isDefer===1)" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div>
        <!-- 转单审核页面，并且状态为待审核时出现 -->
        <!-- <div v-if="title=='转单审核'&&queryConditions.type=='0'" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div> -->
        <!-- 超期工单，并且状态为已超期时出现 -->
        <div v-if="title=='超期工单'&&queryConditions.type=='0'" class="tab-operation" @click="dataDetail(scope.row,'edit')">操作</div>

        <div class="tab-operation" @click="dataDetail(scope.row)">详情</div>
        <div v-if="title=='标注工单管理'" class="tab-operation" @click="handleTag(scope.row)">{{!scope.row.isTag?'标注':'取消标注'}}</div>
    </div>
</template>
<script>
    import Common from "@/assets/js/common.js";
    export default {
        props: ['title', 'scope', 'queryConditions'],
        methods: {
            dataDetail(item, type) {
                if (type == 'edit') {
                    sessionStorage.setItem('relaodPage', '1');
                }
                if (item.signsWorkordersId) {
                    if (this.title == '转单审核') {
                        sessionStorage.setItem('transferssInfo', JSON.stringify(item));
                    }

                }
                this.$router.push({
                    path: "/detsheetss",
                    query: { pre: this.title, id: item.signsWorkordersId, isread: type }
                });
            },
            //标注和取消标注
            handleTag(item) {
                let type = !item.isTag ? '标注' : '取消标注';
                let murl = `${this.$config.efoms_HOST}/workordersTag/insertWorkordersInfoTag`; // 默认是标注
                if (item.isTag) murl = `${this.$config.efoms_HOST}/workordersTag/cancelWorkordersInfoTag`;
                this.$confirm(`确认${type}吗？`, '操作提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                }).then(() => {
                    this.$api.putByQs(murl, { workordersId: item.signsWorkordersId }, { token: Common.getQueryString("token") })
                        .then(res => {
                            if (res.appCode == 0) {
                                Common.ejMessage("success", `${type}成功！`);
                                item.isTag = !item.isTag;
                            } else {
                                Common.printErrorLog(res);
                            }
                        })
                        .catch(err => {
                            Common.printErrorLog(err);
                        });
                }).catch(() => {});
            },
        }
    }
</script>
<style lang="less" scoped>
    .unit-tab-operation {
        .tab-operation {
            color: #00c187;
            cursor: pointer;
            display: inline-block;
            box-sizing: border-box;

            &+.tab-operation {
                margin-left: 8px;
            }
        }
    }
</style>