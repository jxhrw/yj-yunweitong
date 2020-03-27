<template>
    <div>
        <VueUeditorWrap v-model="msg" :config="myConfig"></VueUeditorWrap>
    </div>
</template>
<script>
    import VueUeditorWrap from "vue-ueditor-wrap";
    export default {
        components: {
            VueUeditorWrap
        },
        data() {
            return {
                msg: '',
                myConfig: {
                    // UE 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
                    UEDITOR_HOME_URL: this.$config.ueditorUrl + '/static/UEditor/',
                    serverUrl: '', // 服务器统一请求接口路径
                    //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的重新定义
                    initialStyle: 'p{line-height:1em}', //编辑器层级的基数,可以用来改变字体等
                    toolbars: [
                        [
                            'fullscreen', 'source', '|', 'undo', 'redo', '|',
                            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'formatmatch', '|', 'forecolor', 'backcolor', 'lineheight', '|', 'fontfamily', 'fontsize', '|',
                            'indent', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
                            'link', 'unlink', 'anchor', '|', 'simpleupload', 'insertimage', 'horizontal', 'date', 'time', '|'
                            //'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                            //'print', 'preview', 'searchreplace', 'drafts', 'help'
                        ]
                    ],
                    indentValue: '2em', //首行缩进距离,默认是2em
                    initialFrameWidth: '99%', //初始化编辑器宽度,默认1000
                    initialFrameHeight: 300, //初始化编辑器高度,默认320
                    elementPathEnabled: false, //是否启用元素路径，默认是显示
                    wordCount: true, //是否开启字数统计
                    autoHeightEnabled: false, // 是否自动长高,默认true
                    xssFilterRules: true, // xss 过滤是否开启,inserthtml等操作
                    inputXssFilter: true, //input xss过滤
                    outputXssFilter: true, //output xss过滤
                    // xss过滤白名单 名单来源: https://raw.githubusercontent.com/leizongmin/js-xss/master/lib/default.js
                    whitList: {
                        a: ['target', 'href', 'title', 'class', 'style'],
                        abbr: ['title', 'class', 'style'],
                        address: ['class', 'style'],
                        area: ['shape', 'coords', 'href', 'alt'],
                        article: [],
                        aside: [],
                        audio: ['autoplay', 'controls', 'loop', 'preload', 'src', 'class', 'style'],
                        b: ['class', 'style'],
                        bdi: ['dir'],
                        bdo: ['dir'],
                        big: [],
                        blockquote: ['cite', 'class', 'style'],
                        br: [],
                        caption: ['class', 'style'],
                        center: ['class', 'style'],
                        cite: [],
                        code: ['class', 'style'],
                        col: ['align', 'valign', 'span', 'width', 'class', 'style'],
                        colgroup: ['align', 'valign', 'span', 'width', 'class', 'style'],
                        dd: ['class', 'style'],
                        del: ['datetime'],
                        details: ['open'],
                        div: ['class', 'style'],
                        dl: ['class', 'style'],
                        dt: ['class', 'style'],
                        em: ['class', 'style'],
                        font: ['color', 'size', 'face'],
                        footer: ['class', 'style'],
                        h1: ['class', 'style'],
                        h2: ['class', 'style'],
                        h3: ['class', 'style'],
                        h4: ['class', 'style'],
                        h5: ['class', 'style'],
                        h6: ['class', 'style'],
                        header: ['class', 'style'],
                        hr: ['class', 'style'],
                        i: ['class', 'style'],
                        img: ['src', 'alt', 'title', 'width', 'height', 'id', '_src', 'loadingclass', 'class', 'data-latex'],
                        ins: ['datetime'],
                        li: ['class', 'style'],
                        mark: [],
                        nav: ['class', 'style'],
                        ol: ['class', 'style'],
                        p: ['class', 'style'],
                        pre: ['class', 'style'],
                        s: [],
                        section: ['class', 'style'],
                        small: [],
                        span: ['class', 'style'],
                        sub: ['class', 'style'],
                        sup: ['class', 'style'],
                        strong: ['class', 'style'],
                        table: ['width', 'border', 'align', 'valign', 'class', 'style'],
                        tbody: ['align', 'valign', 'class', 'style'],
                        td: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
                        tfoot: ['align', 'valign', 'class', 'style'],
                        th: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
                        thead: ['align', 'valign', 'class', 'style'],
                        tr: ['rowspan', 'align', 'valign', 'class', 'style'],
                        tt: [],
                        u: [],
                        ul: ['class', 'style'],
                        video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width', 'class', 'style']
                    },
                }
            };
        },
        created() {
            this.myConfig.serverUrl = `http://35.201.165.105:8000/controller.php`;
        },
        methods: {
            showOne() {
                alert(this.msg);
            }
        }
    }
</script>