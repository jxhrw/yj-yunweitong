<template>
    <div class="t-quarter">
        <mark style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;" v-show="showSeason" @click.stop="showSeason=false"></mark>
        <el-input placeholder="请选择季度" v-model="showValue" style="width:138px;" @click.native="showSeason=true">
            <i slot="prefix" class="el-input__icon el-icon-date"></i>
        </el-input>
        <el-card class="box-card" style="width:316px;padding: 0 0 20px;margin-top:10px;position:fixed;z-index:9999" v-show="showSeason">
            <div slot="header" class="clearfix" style="text-align:center;padding:0">
                <button type="button" aria-label="前一年" class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left" @click="prev"></button>
                <span role="button" class="el-date-picker__header-label">{{year}}年</span>
                <button type="button" aria-label="后一年" @click="next" class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"></button>
            </div>
            <div class="text item" style="text-align:center;">
                <el-button type="text" size="medium" style="width:40%;float:left;" @click="selectSeason(0)" :class="{'active':handleValue==(year+'-1'),'today': todayValue==(year+'-1')}">第一季度</el-button>
                <el-button type="text" size="medium" style="float:right;width:40%;" @click="selectSeason(1)" :class="{'active':handleValue==(year+'-2'),'today': todayValue==(year+'-2')}">第二季度</el-button>
            </div>
            <div class="text item" style="text-align:center;">
                <el-button type="text" size="medium" style="width:40%;float:left;" @click="selectSeason(2)" :class="{'active':handleValue==(year+'-3'),'today': todayValue==(year+'-3')}">第三季度</el-button>
                <el-button type="text" size="medium" style="float:right;width:40%;" @click="selectSeason(3)" :class="{'active':handleValue==(year+'-4'),'today': todayValue==(year+'-4')}">第四季度</el-button>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 182px;"></div>
        </el-card>
    </div>
</template>
<script>
    /**
     * @file:  View 组件 季节选择控件
     * @description: UI组件  可选择季节
     * @api: valueArr : 季度value defalut['01-03', '04-06', '07-09', '10-12'] 默认值待设置
     */
    import Common from "@/assets/js/common.js";
    export default {
        props: {
            valueArr: {
                default: () => {
                    return ['01-03', '04-06', '07-09', '10-12']
                },
                type: Array
            },
            getValue: {
                default: () => {},
                type: Function
            },
            defaultValue: {
                default: '',
                type: String
            },
            value: {
                default: '',
                type: String
            },
        },
        data() {
            return {
                showSeason: false,
                season: '',
                year: new Date().getFullYear(),
                showValue: '',
                handleValue: '',
                todayValue: '',
            }
        },
        created() {
            if (this.defaultValue) {
                let value = this.defaultValue
                let arr = value.split('-')
                this.year = arr[0].slice(0, 4)
                let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
                let arrAll = this.valueArr
                this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
                this.handleValue = `${this.year}-${arrAll.indexOf(str) + 1}`
            }

            let a = Common.dateFormat('yyyy-MM', new Date());
            let year = a.split('-')[0];
            let qua = parseInt((a.split('-')[1] - 1) / 3) + 1;
            this.todayValue = year + '-' + qua;
        },
        watch: {
            defaultValue: function(value, oldValue) {
                let arr = value.split('-')
                this.year = arr[0].slice(0, 4)
                let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
                let arrAll = this.valueArr
                this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
                this.handleValue = `${this.year}-${arrAll.indexOf(str) + 1}`
            },
            handleValue(val) {
                this.$emit('update:value', val);
            },
            value(val) {
                this.handleValue = val;
            }
        },
        methods: {
            one() {
                this.showSeason = false
            },
            prev() {
                this.year = this.year * 1 - 1
            },
            next() {
                this.year = this.year * 1 + 1
            },
            selectSeason(i) {
                let that = this
                that.season = i + 1
                let arr = that.valueArr[i].split('-')
                that.getValue(that.year + arr[0] + '-' + that.year + arr[1])
                that.showSeason = false
                this.showValue = `${this.year}年${this.season}季度`
                this.handleValue = `${this.year}-${this.season}`
            }
        }
    }
</script>

<style lang="less" scoped>
    .t-quarter {
        /deep/ .el-card {
            background: #040b19;
            border: 1px solid #124d78;
            overflow: initial;

            .el-card__header {
                border-bottom-color: #124d78;
                margin: 0 12px;
                margin-top: 12px;
                padding: 0;
                padding-bottom: 12px;
                height: 42px;
                line-height: 30px;
            }

            .el-date-picker__header-label,
            .el-picker-panel__icon-btn,
            .el-button--text {
                color: #d6d4d4;
            }

            .el-button--text {
                font-size: 12px;
                font-weight: 400;
                border-radius: 100px;
            }

            .el-button--text.today {
                color: #409EFF;
                font-weight: 700;
            }

            .el-date-picker__header-label.active .el-date-picker__header-label:hover,
            .el-picker-panel__icon-btn:hover {
                color: #409EFF;
            }

            .el-button--text:hover {
                color: #409EFF;
            }

            .el-button--text.active {
                color: #fff;
                background: #409EFF;
            }

        }

        .popper__arrow {
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
            border-width: 6px;
            top: -12px;
            left: 50%;
            margin-right: 3px;
            border-top-width: 6px;
            border-bottom-color: #124d78;

            &::after {
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                content: " ";
                border-width: 6px;
                top: 1px;
                margin-left: -6px;
                border-top-width: 0;
                border-bottom-color: #040b19;
            }
        }
    }
</style>