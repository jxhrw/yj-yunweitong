<template>
    <div class="d-select">
        <!-- <el-autocomplete popper-class="my-autocomplete" v-model="showName" :fetch-suggestions="querySearch" placeholder="请选择" @select="handleSelect" size='mini' class="content-select" clearable>
            <template slot-scope="{ item }">
                <div class="name" :style="item[getAttr]==code?'color:#409eff;font-weight: bold;':''">{{ item[showAttr] }}</div>
            </template>
        </el-autocomplete> -->

        <el-select v-model="showName" filterable placeholder="请选择" size='mini' class="content-select" clearable @change="handleSelect">
            <el-option v-for="item in list" :key="item[getAttr]" :label="item[showAttr]" :value="item[getAttr]">
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
            }
        },
        data() {
            return {
                showName: '',
                showList: [],
            }
        },
        watch: {
            name(val) {
                this.showName = val;
            },
            showName(newVal, oldVal) {
                this.$emit('update:name', newVal);
                if (newVal == '') {
                    this.$emit('update:code', '');
                }
            },
        },
        methods: {
            querySearch(queryString, cb) {
                var restaurants = this.list;
                var arr = queryString ? restaurants.filter(res => res[this.showAttr] == queryString && res[this.getAttr] == this.code) : restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                if (arr.length == 1) {
                    cb(restaurants);
                } else {
                    cb(results);
                }
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant[this.showAttr].toLowerCase().indexOf(queryString.toLowerCase()) > -1);
                };
            },
            handleSelect(item) {
                console.log(item);
                this.showName = item[this.showAttr];
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