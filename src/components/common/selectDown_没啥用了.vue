<template>
    <div class="m-select">
        <el-input v-model="showName" placeholder="请选择" size='mini' class="content-select" clearable :readonly="false" v-popover:popoverSelect></el-input>
        <el-popover highlight-current popper-class="region-popper" ref="popoverSelect" placement="bottom-start" trigger="click" v-model="selectVisible">
            <el-scrollbar class="region-scroll">
                <el-tree id="select" :data="list" accordion :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
            </el-scrollbar>
        </el-popover>
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
            }
        },
        data() {
            return {
                showName: '',
                selectVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
            }
        },
        watch: {
            name(val) {
                this.showName = val;
            },
            showName(newVal, oldVal) {
                this.$emit('update:name', newVal);
                if (newVal === '') {
                    // this.code = '';
                    this.$emit('update:code', '');
                    setTimeout(() => {
                        this.selectVisible = false;
                    });
                }
            },
        },
        methods: {
            handleNodeClick(data, node, e) {
                let thisId = e.$parent.$parent.$parent.$attrs.id || e.$parent.$parent.$attrs.id || e.$parent.$attrs.id;
                // if (!data.children || data.children.length == 0) {
                if (data) {
                    // this.name = data.text;
                    // this.code = data.id;
                    this.$emit('update:name', data.text);
                    this.$emit('update:code', data.id);
                    this.selectVisible = false;
                }
            },
        },
    }
</script>
<style lang="less" scoped>
    .m-select {
        display: inline-block;
        width: 220px;
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