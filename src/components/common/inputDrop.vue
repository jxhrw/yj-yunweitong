<template>
    <div class="d-select">
        <el-autocomplete class="content-select" popper-class="sp-my-autocomplete" v-model="showCode" :fetch-suggestions="filterMs" placeholder="请输入内容" @select="visibleChange" :clearable="clearable">
            <template slot-scope="{ item }">
                <span v-if='isShowCode'>{{item[getAttr]}} -> {{item[showAttr] }}</span>
                <span v-else>{{item[showAttr] }}</span>
            </template>
        </el-autocomplete>
    </div>
</template>
<script>
    export default {
        props: {
            list: {
                type: Array,
                default: []
            },
            code: {
                type: String,
                default: ''
            },
            name: [String, Object],
            showAttr: {
                type: String,
                default: 'dicName'
            },
            getAttr: {
                type: String,
                default: 'dicCode'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            },
            isShowCode: {
                type: Boolean,
                default: false
            },
            showOther: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                showCode: ''
            }
        },
        watch: {
            name(val) {
                this.showCode = val;
            },
        },
        methods: {
            filterMs(val, cb) {
                this.$emit('update:name', val);
                let arr = this.list.filter(res => res[this.showAttr] === val);
                this.$emit('update:code', arr.length > 0 ? arr[0][this.getAttr] : '');

                this.$emit('netSearch', val, cb);
            },
            visibleChange(item) {
                // this.$emit('visibleChange');
                // console.log(this.showCode);
                console.log(item);
                this.showCode = item[this.showAttr];
                this.$emit('update:code', item[this.getAttr]);
                this.$emit('update:name', item[this.showAttr]);
            }
        },
    }
</script>
<style lang="less" scoped>
    .d-select {
        display: inline-block;
        width: 220px;

        .content-select {
            width: 100%;

            /deep/ .el-input__inner {
                font-size: 12px;
            }

            /deep/ .el-input__suffix {
                .el-input__icon {
                    line-height: 30px;
                }
            }
        }
    }
</style>
<style lang="less">
    .region-popper {
        min-width: 220px;
        padding: 5px 0;
    }

    .region-scroll {
        height: 246px;
    }

    .region-scroll .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .sp-my-autocomplete.el-autocomplete-suggestion li {
        white-space: initial;
        line-height: 18px;
        padding-top: 8px;
        padding-bottom: 8px;
    }
</style>