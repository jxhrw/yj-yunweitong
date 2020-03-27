<template>
    <div class="pop-content">
        <div class="pop-title">
            <p class="p1">{{popoverData.name}}</p>
            <p class="p2"><span>总数：{{popoverData.totalSum}}</span><span>故障数：{{popoverData.faultSum}}</span><span>完好率：{{popoverData.goodRate|twoDecimal}}%</span></p>
        </div>
        <div style="min-height: 200px;">
            <el-table :data="tableList" class="pop-con-table" border>
                <el-table-column type="index" align="left" label="序号" :index="currentPage*10-9"></el-table-column>
                <el-table-column min-width="150" align="left" prop="devName" label="点位名称"></el-table-column>
                <el-table-column v-if="popoverData.type!='area'" prop="devAreaName" align="left" label="区域"></el-table-column>
                <el-table-column v-if="popoverData.type!='devtype'" prop="devTypeName" align="left" label="设备类型"></el-table-column>
                <el-table-column v-if="popoverData.type!='oppm'" prop="oppmTypeName" align="left" label="项目类型"></el-table-column>
                <el-table-column prop="workordersStatusName" align="left" label="状态"></el-table-column>
                <el-table-column prop="repDate" align="left" label="故障时间">
                    <template slot-scope="scope">
                        {{scope.row.repDate|timeDay}}
                    </template>
                </el-table-column>
                <el-table-column prop="finishTime" align="left" label="修复时间">
                    <template slot-scope="scope">
                        {{scope.row.finishTime|timeDay}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pop-page">
            <el-pagination layout="prev, pager, next" :total="totalCount" :current-page.sync="currentPage" @current-change="getpage"></el-pagination>
        </div>
    </div>

</template>
<script>
    import Common from "@/assets/js/common.js";
    export default {
        props: {
            // 总计的数据
            popoverData: {
                type: Object,
                default: () => { return {}; }
            },
            // 列表的数据,包括分页信息
            popoverList: {
                type: Object,
                default: () => { return {}; }
            }
        },
        watch: {
            popoverList(val) {
                this.tableList = val.result || [];
                this.totalCount = parseInt(val.totalCount || 0);
                this.currentPage = parseInt(val.currentPage || 1);
            }
        },
        filters: {
            twoDecimal(val) {
                return Math.round((val || 0) * 100) / 100;
            },
            timeDay(val) {
                let str = '';
                if (val) {
                    str = Common.dateFormat('yyyy-MM-dd', new Date(val));
                }
                return str;
            }
        },
        data() {
            return {
                tableList: [],
                totalCount: 0,
                currentPage: 1
            }
        },
        methods: {
            getpage(page) {
                this.$emit('fatherMethod', page);
            }
        },
    }
</script>
<style lang="less" scoped>
    .pop-content {
        .pop-title {
            display: flex;
            justify-content: space-between;
            align-content: center;
            line-height: 14px;
            color: #ffffff;
            padding: 7px 0 10px;

            .p1 {
                font-size: 14px;
            }

            .p2 {
                font-size: 12px;

                span {
                    margin-left: 50px;
                }
            }
        }

        .pop-con-table {
            width: 100%;
            background: transparent;
            border-color: #0E4992;
        }

        /deep/ .el-table {
            color: #fff;

            .el-table__header-wrapper {
                thead {
                    font-size: 12px;
                    color: #8BACDF;
                }

                tr,
                th {
                    background-color: #0A4297;
                }
            }

            .el-table__body-wrapper {
                .el-table__empty-text {
                    color: #fff;
                }

                tr,
                td {
                    background-color: transparent;
                    border-color: #0E4992;
                }
            }

            th,
            td {
                padding: 3px 0 5px;

                &>.cell {
                    line-height: 16px;
                }
            }

            td {
                padding: 4px 0 4px;
                font-size: 12px;
            }

            &.el-table--border {
                th {
                    border-color: #0E4992;
                }
            }

            &::before,
            &::after {
                background-color: #0E4992;
            }
        }

        .pop-page {
            display: flex;
            justify-content: center;

            /deep/ .el-pagination {
                padding: 12px 0 0 0;
                color: #94BFFF;

                button,
                .btn-prev,
                .btn-next,
                .el-pager li {
                    background-color: transparent;
                    height: 16px;
                    line-height: 16px;
                }

                button,
                .btn-prev,
                .btn-next {
                    color: #94BFFF;

                    i {
                        line-height: 18px;
                    }

                }

                .el-pager .more::before {
                    line-height: 18px;
                }

                .el-pager li {
                    font-weight: 100;
                    min-width: 16px;
                    margin: 0 10px;

                    &.active {
                        background: #0070FE;
                        color: #F9FBFF;
                    }
                }

                .el-pager li.btn-quicknext,
                .el-pager li.btn-quickprev {
                    color: #94BFFF;
                }

                button:disabled {
                    color: #0049A5;
                }
            }
        }
    }
</style>