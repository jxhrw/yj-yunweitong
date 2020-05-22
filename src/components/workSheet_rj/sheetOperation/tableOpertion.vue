<template>
    <div class="unit-tab-operation">
        <!-- 维修申报页面，并且状态为待下发ORDERSSTATUS01时出现，下发已拒绝ORDERSSTATUS10（取消） -->
        <div v-if="(title=='维修申报')&&(scope.row.workStatusCode == 'ORDERSSTATUS01')" class="tab-operation" @click="dataDetail(scope.row,'edit')">撤销</div>
        <!-- 优化申报页面，并且状态为科室待审核REPAIRSTATUS05时出现 -->
        <div v-if="(title=='优化申报')&&(scope.row.workStatusCode == 'REPAIRSTATUS05')" class="tab-operation" @click="dataDetail(scope.row,'edit')">撤销</div>
        <!-- 科室审核页面+处室审核页面，并且状态为待审核时出现 -->
        <div v-if="(title=='科室审核'&&scope.row.workStatusCode == 'REPAIRSTATUS05')||(title=='处室审核'&&scope.row.workStatusCode == 'REPAIRSTATUS06')" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div>
        <!-- 工单下发页面，并且状态为待下发ORDERSSTATUS01时出现，下发已拒绝ORDERSSTATUS10 -->
        <div v-if="title=='工单下发'&&(scope.row.workStatusCode == 'ORDERSSTATUS01'||scope.row.workStatusCode == 'ORDERSSTATUS10')" class="tab-operation" @click="dataDetail(scope.row,'edit')">下发</div>
        <!-- <div v-if="title=='工单下发'&&(scope.row.workStatusCode == 'ORDERSSTATUS01'||scope.row.workStatusCode == 'ORDERSSTATUS10')" class="tab-operation" @click="dataDetail(scope.row,'edit')">撤销</div> -->
        <!-- 工单指派页面，并且状态为待响应ORDERSSTATUS11时出现,指派已拒绝ORDERSSTATUS13 -->
        <div v-if="title=='工单指派'&&(scope.row.workStatusCode == 'ORDERSSTATUS11'||scope.row.workStatusCode == 'ORDERSSTATUS13')" class="tab-operation" @click="dataDetail(scope.row,'edit')">指派</div>
        <!-- 工单指派页面，并且状态为待反馈ORDERSSTATUS02，待处理ORDERSSTATUS05，已到达ORDERSSTATUS14-时出现 -->
        <!-- <div v-if="title=='工单指派'&&(scope.row.workStatusCode == 'ORDERSSTATUS02'||scope.row.workStatusCode == 'ORDERSSTATUS05'||scope.row.workStatusCode == 'ORDERSSTATUS14')" class="tab-operation" @click="dataDetail(scope.row,'edit')">退回</div> -->
        <!-- 维修处置页面，并且状态为待反馈ORDERSSTATUS02，待处理ORDERSSTATUS05，已到达ORDERSSTATUS14-时出现 -->
        <div v-if="title=='维修处置'&&(scope.row.workStatusCode == 'ORDERSSTATUS02'||scope.row.workStatusCode == 'ORDERSSTATUS05'||scope.row.workStatusCode == 'ORDERSSTATUS14')" class="tab-operation" @click="dataDetail(scope.row,'edit')">反馈</div>
        <!-- 工单确认页面，并且状态为待确认时出现 -->
        <div v-if="title=='工单确认'&&(scope.row.workStatusCode == 'ORDERSSTATUS03'||scope.row.workStatusCode == 'ORDERSSTATUS04')" class="tab-operation" @click="dataDetail(scope.row,'edit')">确认</div>
        <!-- 工单评价页面，并且状态为待评价时出现 -->
        <div v-if="title=='工单评价'&&scope.row.workStatusCode == 'ORDERSSTATUS06'" class="tab-operation" @click="dataDetail(scope.row,'edit')">评价</div>
        <!-- 延期审核页面，并且状态为待审核时出现 -->
        <div v-if="title=='延期审核'&&scope.row.isDefer===true" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div>
        <!-- 转单审核页面，并且状态为待审核时出现 -->
        <!-- <div v-if="title=='转单审核'&&queryConditions.type=='0'" class="tab-operation" @click="dataDetail(scope.row,'edit')">审核</div> -->
        <!-- 材料审核页面，并且状态为待审核时出现 -->
        <!-- <div v-if="title=='材料审核'&&queryConditions.type=='0'" class="tab-operation" @click="handleOther(scope.row)">审核</div> -->
        <!-- 材料超期工单，并且状态为已超期时出现 -->
        <!-- <div v-if="title=='超期工单'&&queryConditions.type=='0'" class="tab-operation" @click="dataDetail(scope.row,'edit')">操作</div> -->

        <div class="tab-operation" @click="dataDetail(scope.row)">详情</div>
    </div>
</template>
<script>
    export default {
        props: ['title', 'scope', 'queryConditions'],
        methods: {
            dataDetail(item, type) {
                if (type == 'edit') {
                    sessionStorage.setItem('relaodPage', '1');
                }
                if (item.workOtherId) {
                    this.$router.push({
                        path: "/detsheetrj",
                        query: { pre: this.title, id: item.workOtherId, isread: type }
                    });
                } else {
                    this.$router.push({
                        path: "/detsheetrj",
                        query: { pre: this.title, id: item.repairsId, isread: type, type: 'optimize' }
                    });
                }
            },
            handleOther(data) {
                this.$emit('onOtherEvent', data);
            }
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