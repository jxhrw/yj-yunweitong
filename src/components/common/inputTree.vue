<template>
    <div class="d-select">
        <el-cascader v-model="showCode" :options="tree" placeholder="请选择" size='mini' filterable :props="{checkStrictly: true, value: getAttr, label: showAttr}" :disabled="disabled" :clearable="clearable" @change="handleChange" separator=">">
        </el-cascader>
    </div>
</template>
<script>
    export default {
        props: {
            tree: {
                type: Array,
                default: []
            },
            code: {
                type: Array,
                default: []
            },
            name: [Array,Object],
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
            }
        },
        data() {
            return {
                showList: [],
                showTree: [],
                showCode: [],
                showName: []
            }
        },
        watch: {
            code(newVal,oldVal) {
                if(JSON.stringify(newVal)!=JSON.stringify(oldVal)){
                    if(newVal.length == 1){
                        this.showName = this.filterAllCode(newVal[0],this.tree);
                    }else{
                        this.showCode = newVal;
                    }
                }
            },
            showCode(newVal, oldVal) {
                if(JSON.stringify(newVal)!=JSON.stringify(oldVal)){
                    let codeLast = newVal.length>0?newVal[newVal.length-1]: '';
                    this.$emit('update:code', newVal);
                    this.showName =  this.forName(newVal);
                    if(typeof(this.name) != 'undefined'){
                        this.$emit('update:name', this.showName);
                    }
                }
            },
            tree(val) {
                this.showList = [];
                let qwer = this.ergodic(val);
                this.showTree = qwer;
            }
        },
        methods: {
            handleChange(data) {
                // console.log(this.showCode)
            },
            // 递归遍历，将树形数据的children为空的删除
            ergodic(data) {
                this.showList = [...this.showList,...data];
                data.map(item => {
                    if (item['children'].length > 0) {
                        this.ergodic(item['children']);
                    } else {
                        delete item['children'];
                    }
                });
            },
            // 树形结构数据 每一个对应名称的集合
            forName(target){
                let name = [];
                target.map(res=>{
                    let arr = this.showList.filter(item=>{return item[this.getAttr] == res});
                    if(arr.length>0){name.push(arr[0][this.showAttr])}
                });
                return name;
            },
            // 递归，code 目标值， data 树形结构数据，arr 先辈code集合
            filterAllCode(code,data,arr){
                let b = arr || [];
                (data||[]).map(res=>{
                    let all = [...b,res[this.getAttr]];
                    if(res[this.getAttr] == code){
                        this.showCode = all;
                    }else{
                        this.filterAllCode(code,res.children,all);
                    }
                });
            }
        },
    }
</script>
<style lang="less" scoped>
    .d-select {
        display: inline-block;
        width: 220px;

        /deep/.el-cascader {
            width: 100%;

            .el-input {
                height: 28px;
            }

            .el-input__inner {
                border-radius: 0;
                background: #f9fafc;
                border: 1px solid #e1e7ed;
            }

            .el-input__suffix {
                border-left: 1px solid #e1e7ed;
                height: 28px;
            }
        }
    }
</style>