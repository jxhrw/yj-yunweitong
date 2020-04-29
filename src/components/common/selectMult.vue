<template>
    <div class="d-select">
        <el-select v-model="showCode" filterable multiple collapse-tags placeholder="请选择" size='mini' class="content-select" :popper-class="popperClass" clearable :reserve-keyword="true">
            <el-option v-if="codeAll && showAll && multList.length==list.length" label="全部" :value="codeAll"></el-option>
            <el-option v-for="item in multList" :key="item[getAttr]" :label="item[showAttr]" :value="item[getAttr]">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    export default {
        props: {
            list: {
                type: Array,
                default () {
                    return []
                }
            },
            code: {
                type: Array,
                default () {
                    return []
                }
            },
            name: {
                type: Array,
                default () {
                    return []
                }
            },
            showAttr: {
                type: String,
                default: 'dicName'
            },
            getAttr: {
                type: String,
                default: 'dicCode'
            },
            showAll: {
                // 是否有全部选项
                type: Boolean,
                default: false
            },
            popperClass: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                multList: [],
                showCode: [],
                codeAll: '',
                nameAll: '',
            }
        },
        mounted() {
            this.multList = this.list;
        },
        watch: {
            code(newVal, oldVal) {
                //val 里必定不存在 codeAll的项，传递回去时需过滤
                if (newVal.length != oldVal.length) {
                    if (newVal.length === this.list.length && this.showAll) {
                        this.showCode = [this.codeAll, ...newVal];
                    } else {
                        this.showCode = newVal;
                    }
                }
            },
            showCode(newVal, oldVal) {
                // console.log(newVal);
                // console.log(oldVal);
                if (newVal.length <= this.list.length) {
                    let _thisCode = [];

                    // 当前是否全选
                    let isSelectAll = false;
                    // true代表本次有全部选项
                    let newHasAll = newVal.some(res => { return res == this.codeAll });
                    // true代表上次有全部选项
                    let oldHasAll = oldVal.some(res => { return res == this.codeAll });

                    if (newVal.length < oldVal.length) {
                        //本次比上次少，必为取消全选
                        if (oldHasAll && !newHasAll && newVal.length == this.list.length) {
                            // 上次有全部，本次没有，并且当前长度等于list的长度，说明之前是选中全部，现在为全部取消
                            isSelectAll = false;
                            _thisCode = [];
                        } else {
                            // 其余为取消某个
                            isSelectAll = false;
                            _thisCode = newVal.filter(res => { return res != this.codeAll });
                        }
                    } else if (newHasAll && !oldHasAll) {
                        // 上次没有全部，本次有，说明全部选中
                        isSelectAll = true;
                    } else if (!newHasAll && !oldHasAll && newVal.length == this.list.length) {
                        // 上次没有全部，本次没有，但是当前长度等于list的长度,说明是一个个选的 ==》全选
                        isSelectAll = true;
                    } else if (newHasAll && oldHasAll) {
                        // 都有全部，当前更短，说明取消勾选一个，已不是全选（按理说这种情况应该不存在）
                        isSelectAll = false;
                        _thisCode = newVal.filter(res => { return res != this.codeAll });
                    } else {
                        //没有选中全部
                        isSelectAll = false;
                        _thisCode = newVal.filter(res => { return res != this.codeAll });
                    }

                    if (isSelectAll) {
                        // 有全部把所有code返回
                        this.$emit('update:code', this.codeAll.split(","));
                        this.$emit('update:name', this.nameAll.split(","));
                    } else {
                        // 没有全部把对应项返回
                        this.$emit('update:code', _thisCode);
                        let arr = [];
                        _thisCode.map(item => {
                            let ab = this.list.filter(res => res[this.getAttr] === item);
                            arr = [...arr, ...ab];
                        });
                        let names = [];
                        arr.map(item => names.push(item[this.showAttr]));
                        this.$emit('update:name', names);
                    }
                } else {
                    // newVal的项比list多说明全选了，当前code必包含list的所有code，无需处理逻辑
                }
            },
            list(val) {
                this.multList = val;
                let id = [];
                let name = [];
                val.map(res => {
                    id.push(res[this.getAttr]);
                    name.push(res[this.showAttr]);
                });
                this.codeAll = id.join(',');
                this.nameAll = name.join(',');
            },
        },
        methods: {},
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