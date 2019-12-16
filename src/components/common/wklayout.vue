<template>
    <div class="ej-content">
        <div class="ej-content-title">
            <h2>{{title}}</h2>
            <div>
                <slot name='pageBtn'></slot>
            </div>
        </div>
        <div class="ej-content-main">
            <el-scrollbar class="ej-content-scrollbar">
                <div class="base-info">
                    <div class="content">
                        <el-row class="content-row-select">
                            <slot name="condFirst"></slot>
                            <el-col :span="3">
                                <div class="relative">
                                    <div v-if="searchMore" class="content-icon" :class="{'active':conditionVisible}" @click="conditionVisible = !conditionVisible"></div>
                                    <div class="content-search" @click="searchTable">
                                        <p>查询</p>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row v-show="conditionVisible || !searchMore" class="content-row-select select-more">
                            <slot name="condSecond"></slot>
                        </el-row>
                    </div>
                </div>
                <div class="depiction-info">
                    <div class="title">
                        <h3>{{tableTitle}}</h3>
                        <div v-if="typeTableData.length>0" class="operation select" v-popover:popoverMultiple>
                            <i></i>
                        </div>
                        <el-popover ref="popoverMultiple" placement="left" title="选择可见内容" popper-class="table-list-popver" trigger="click" @after-enter="initMultiple">
                            <el-table ref="multipleTable" :data="typeTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="55">
                                </el-table-column>
                                <el-table-column prop="name" label="类别">
                                </el-table-column>
                            </el-table>
                        </el-popover>
                        <slot name="tableBtn"></slot>
                    </div>
                    <div class="content">
                        <slot name="table"></slot>
                        <Paging ref="tableList" id="managePage" :totalCount="totalCount" :totalPage="totalPage" :queryConditions="queryConditions" @pageAsk="searchPage"></Paging>
                    </div>

                    <slot name="dialog"></slot>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<script>
    import Paging from "@/components/common/paging_new";
    export default {
        // props: ['title', 'searchMore', 'queryConditions', 'totalPage', 'totalCount', 'typeTableData', 'multipleSelection'],
        props: {
            title: {
                type: String,
                default: ''
            },
            searchMore: {
                type: Number,
                default: 0
            },
            queryConditions: {
                type: Object,
                default () {
                    return {}
                }
            },
            totalPage: {
                type: Number,
                default: 0
            },
            totalCount: {
                type: Number,
                default: 0
            },
            typeTableData: {
                type: Array,
                default () {
                    return []
                }
            },
            multipleSelection: {
                type: Array,
                default () {
                    return []
                }
            },
            tableTitle: {
                type: String,
                default: '查询结果'
            },
        },
        components: {
            Paging
        },
        watch: {
            'queryConditions.currentPage'(val) {
                this.$refs.tableList.zjCurrentPage = val;
            }
        },
        data() {
            return {
                conditionVisible: false, // 更多条件
                // typeTableData: [{ "name": "所属辖区" }, { "name": "管理部门" }, { "name": "故障类型" }, { "name": "报修人" }],// 所有可隐藏属性
                // multipleSelection: [] // 选中需显示的内容
            };
        },
        mounted() {

        },
        methods: {
            searchTable() {
                this.$emit('searchTable');
            },
            searchPage() {
                this.$emit('searchPage');
            },

            // 列表显示处理--start
            initMultiple() {
                let rows = [];
                let mulStr = JSON.stringify(this.multipleSelection);
                this.typeTableData.forEach(res => {
                    let resStr = JSON.stringify(res);
                    if (mulStr.indexOf(resStr) > -1) {
                        rows.push(res);
                    }
                });
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row, true);
                });
            },
            handleSelectionChange(val) {
                this.$emit('update:multipleSelection', val);
                // this.multipleSelection = val;
            }
            // 列表显示处理--end
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/main.css";
    @import '../../assets/less/baseInfo.less';
    @import '../../assets/less/depiction.less';
    @import '../../assets/less/list.less';

    .base-info {
        border-top: 1px solid #e4eaee;
        border-radius: 2px;
    }

    .depiction-info .content {
        padding-bottom: 20px;
    }

    .relative {
        position: relative;
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