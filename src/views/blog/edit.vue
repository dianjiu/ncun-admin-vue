<template>
    <div>
        <div class="container">
            <el-form :model="blogForm" :rules="rules" ref="blogForm" label-width="100px" class="demo-blogForm">
                <el-form-item label="博客标题" prop="articleTitle">
                    <el-input v-model="blogForm.articleTitle"></el-input>
                </el-form-item>
                <el-form-item label="文章内容" prop="blogText">
                    <quill-editor class="blogText"
                                  ref="myTextEditor"
                                  v-model="blogForm.blogText"
                                  :options="editorOption"
                                  @blur="onEditorBlur($event)"
                                  @focus="onEditorFocus($event)"
                                  @ready="onEditorReady($event)"
                                  @change="onEditorChange($event)">
                    </quill-editor>
                    <!--<quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>-->
                    <!--<el-input type="textarea" v-model="blogForm.desc"></el-input>-->
                </el-form-item>
                <el-form-item label="文章摘要" prop="blogSummary">
                    <el-input type="textarea" v-model="blogForm.blogSummary" rows="5"></el-input>
                </el-form-item>
                <div class="">
                <el-form-item label="文章配图" prop="blogImgs" class="dj-img-upload">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="blogForm.blogImgs" :src="blogForm.blogImgs" class="avatar" style="width: 100%;height: 100%">
                        <i v-else class="el-icon-upload"></i><br>
                        <span class="el-upload__text">将配图拖到此处，或<em>点击上传</em></span>
                    </el-upload>
                </el-form-item>
            </div>
                <div class="">
                    <el-form-item label="是否原创" prop="blogType" class="dj-form-inline">
                        <el-select v-model="blogForm.blogType" placeholder="请选择文章类型">
                            <el-option label="原创" value="1"></el-option>
                            <el-option label="转载" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否置顶" prop="blogGrade" class="dj-form-inline">
                        <el-select v-model="blogForm.blogGrade" placeholder="请选择推荐等级">
                            <el-option label="置顶" value="10"></el-option>
                            <el-option label="推荐" value="6"></el-option>
                            <el-option label="正常" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开启评论" prop="commentStatus" class="dj-form-inline">
                        <el-select v-model="blogForm.commentStatus" placeholder="请选择推荐等级">
                            <el-option label="开启" value="1"></el-option>
                            <el-option label="关闭" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="">
                    <el-form-item label="文章专题" prop="blogTopic" class="dj-form-inline">
                        <el-select v-model="blogForm.blogTopic" filterable placeholder="请选择文章专题">
                            <el-option
                                v-for="item in topicOptions"
                                :key="item.labelName"
                                :label="item.labelName"
                                :value="item.labelUrl">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章分类" prop="blogSort" class="dj-form-inline">
                        <el-select v-model="blogForm.blogSort" filterable placeholder="请选择文章分类">
                            <el-option
                                v-for="item in sortOptions"
                                :key="item.labelName"
                                :label="item.labelName"
                                :value="item.labelUrl">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章标签" prop="blogTags" class="dj-form-inline">
                        <el-select
                            v-model="blogForm.blogTags"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请选择文章标签">
                            <el-option
                                v-for="item in tagsOptions"
                                :key="item.labelName"
                                :label="item.labelName"
                                :value="item.labelUrl">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class='dj-div-inline'>
                    <el-form-item label="同步社区" prop="delivery" class="dj-form-inline">
                        <el-switch v-model="blogForm.toEmen"></el-switch>
                    </el-form-item>
                </div>
                <div class='dj-div-inline'>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('blogForm')">立即发布</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import { insert } from '@/api/blog';

export default {
    data() {
        return {
            content: '',
            //富文本配置
            editorOption: {
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                        ["blockquote", "code-block"], // 引用  代码块
                        [{ header: 1 }, { header: 2 }], // 1、2 级标题
                        [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
                        [{ align: [] }], // 对齐方式
                        [{ indent: "-1" }, { indent: "+1" }], // 缩进
                        [{ size: ["small", false, "large", "huge"] }], // 字体大小
                        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
                        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
                        [{ font: [] }], // 字体种类
                        ["link", "image", "video"] // 链接、图片、视频
                    ], //工具菜单栏配置
                },
                placeholder: '欢迎使用诺春博客系统', //提示
                readyOnly: false, //是否只读
                theme: 'snow', //主题 snow/bubble
                syntax: true, //语法检测
            },
            blogForm: {
                //博客标题
                blogTitle:"",
                //博客正文
                blogText:"",
                //博客摘要
                blogSummary:"",
                //博客类型
                blogType:"",
                //博客分类
                blogSort:"",
                //博客标签
                blogTags:[],
                //博客专题
                blogTopic:"",
                //博客热度
                blogGrade:"",
                //博客作者
                blogAuthor:"",
                //博客缩略图
                blogImgs:"",
                //开启评论
                commentStatus:"",
                //同步依梦
                toEmen:true,
                //使用MD
                usedMD:false,
            },
            rules: {
                blogTitle: [
                    { required: true, message: '请输入文章标题', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                ],
                blogSummary: [
                    { required: true, message: '请输入文章概述', trigger: 'blur' },
                    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
                ],
                blogText: [
                    { required: true, message: '请输入文章内容', trigger: 'blur' }
                ],
                blogType: [
                    { required: true, message: '请选择是否原创', trigger: ['change','blur'] }
                ],
                blogGrade: [
                    { required: true, message: '请选择是否置顶', trigger: ['change','blur'] }
                ],
                commentStatus: [
                    { required: true, message: '请选择开启评论', trigger: ['change','blur'] }
                ],
                blogTopic: [
                    { required: true, message: '请至少选择一个专题', trigger: ['change','blur'] }
                ],
                blogSort: [
                    { required: true, message: '请至少选择一个分类', trigger: ['change','blur'] }
                ],
                blogTags: [
                    { type: 'array', required: true, message: '请至少选择一个标签', trigger: ['change','blur'] }
                ],
            },
            topicOptions: [{
                labelName: 'SpringBoot',
                labelUrl: 'springboot',
            }, {
                labelName: 'Spring',
                labelUrl: 'spring'
            }, {
                labelName: 'Vue',
                labelUrl: 'vue'
            }],
            sortOptions: [{
                labelName: '前端',
                labelUrl: 'H5',
            }, {
                labelName: '后端',
                labelUrl: 'web'
            }, {
                labelName: '生活',
                labelUrl: 'life'
            }],
            tagsOptions: [{
                labelName: 'Java',
                labelUrl: 'Java',
            },{
                labelName: 'HTML',
                labelUrl: 'HTML',
            }, {
                labelName: 'CSS',
                labelUrl: 'CSS'
            }, {
                labelName: 'JavaScript',
                labelUrl: 'JavaScript'
            }],
            value: [],
        };
    },
    components: {
        quillEditor
    },
    methods: {
        // 失去焦点
        onEditorBlur(editor) {},
        // 获得焦点
        onEditorFocus(editor) {},
        // 开始
        onEditorReady(editor) {},
        // 值发生变化
        onEditorChange(editor) {
            this.content = editor.html;
            console.log(editor);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = {}
                    Object.keys(this.blogForm).forEach(key => {
                        if(this.blogForm[key]  instanceof Array){
                            params[key] = this.blogForm[key].join(",")
                        }else{
                            params[key] = this.blogForm[key]
                        }
                        params.blogAuthor ="dianjiu"
                        params.status ="1"
                    })
                    console.log(params,'params')
                    insert(params).then((res) => {
                        console.log(res)
                    })
                } else {
                    console.log(this.blogForm)
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
};
</script>

<style>
.dj-div-inline {
    display: inline-block;
    width: 50%;
}

.dj-form-inline {
    display: inline-block;
}
.dj-article-textarea{
    height: 200px;
    line-height: 200px;
}
/*.dj-form-inline input {
    width: 150px;
}*/

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

/*汉化编辑器*/
.editor {
    line-height: normal !important;
    height: 800px;
}
.ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
}
</style>