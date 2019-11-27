<template>
    <div class="d-select">
        <el-select v-if="isSearch" v-model="showCode" filterable placeholder="请选择" size='mini' class="content-select" :filter-method="filterMs" :disabled="disabled" :clearable="clearable">
            <el-option v-for="item in list" :key="item[getAttr]" :label="item[showAttr]" :value="item[getAttr]">
                <template v-if='isShowCode'>
                    <span>{{item[getAttr]}} -> {{item[showAttr] }}</span>
                </template>
            </el-option>
        </el-select>

        <el-select v-else v-model="showCode" filterable placeholder="请选择" size='mini' class="content-select" :disabled="disabled" :clearable="clearable">
            <el-option v-for="item in list" :key="item[getAttr]" :label="item[showAttr]" :value="item[getAttr]">
                <template v-if='showOther'>
                    <span>{{item[showAttr]}}（{{item[showOther] }}） </span>
                </template>
            </el-option>
        </el-select>
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
            name: {
                type: String,
                default: ''
            },
            showAttr: {
                type: String,
                default: 'dicName'
            },
            getAttr: {
                type: String,
                default: 'dicCode'
            },
            isSearch: {
                type: Boolean,
                default: false
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
            code(val) {
                this.showCode = val;
            },
            showCode(newVal, oldVal) {
                // console.log(newVal);
                this.$emit('update:code', newVal);
                let arr = this.list.filter(res => res[this.getAttr] === newVal);
                this.$emit('update:name', arr.length > 0 ? arr[0][this.showAttr] : '');
            },
        },
        methods: {
            filterMs(val) {
                this.$emit('netSearch', val);
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
</style>