<template>
    <div class="unit-tab-operation">
        <!-- 维修处置页面，并且状态为待维修ORDERSSTATUS02，待确认ORDERSSTATUS03，-时出现 -->
        <div v-if="title=='维修处置'&&(scope.row.workStatusCode == 'ORDERSSTATUS02'||scope.row.workStatusCode == 'ORDERSSTATUS03'||scope.row.workStatusCode == 'ORDERSSTATUS14')" class="tab-operation" @click="dataDetail(scope.row,'edit')">反馈</div>
        <!-- 工单确认页面，并且状态为待确认时出现 -->
        <div v-if="title=='工单确认'&&(scope.row.workStatusCode == 'ORDERSSTATUS03')" class="tab-operation" @click="dataDetail(scope.row,'edit')">确认</div>

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
                if (item.workSystemId) {
                    if (this.title == '转单审核' || this.title == '转单查询') {
                        sessionStorage.setItem('transferInfo', JSON.stringify(item));
                    }
                    this.$router.push({
                        path: "/detsheetxt",
                        query: { pre: this.title, id: item.workSystemId, isread: type }
                    });
                } else {
                    this.$router.push({
                        path: "/detsheetxt",
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