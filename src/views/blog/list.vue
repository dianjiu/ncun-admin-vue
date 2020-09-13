<template>
    <div>
        <!--<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    &lt;!&ndash;<i class="el-icon-lx-cascades"></i>&ndash;&gt; 基础管理 / 博客管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>-->
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量下架</el-button>
                <el-select v-model="query.articleType" placeholder="是否原创" class="handle-select mr10">
                    <el-option key="1" label="原创" value="原创"></el-option>
                    <el-option key="2" label="转载" value="转载"></el-option>
                </el-select>
                <el-select v-model="query.articleGrade" placeholder="推荐等级" class="handle-select mr10">
                    <el-option key="1" label="正常" value="正常"></el-option>
                    <el-option key="2" label="推荐" value="推荐"></el-option>
                    <el-option key="3" label="置顶" value="置顶"></el-option>
                </el-select>
                <el-select v-model="query.status" placeholder="是否发布" class="handle-select mr10">
                    <el-option key="1" label="发布" value="发布"></el-option>
                    <el-option key="2" label="下架" value="下架"></el-option>
                </el-select>
                <el-input v-model="query.articleTitle" placeholder="标题、内容" class="handle-input mr10"></el-input>
                <el-input v-model="query.articleCategories" placeholder="分类、标签、专题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="缩略图" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.articleImgs"
                            :preview-src-list="[scope.row.articleImgs]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="articleTitle" min-width="150" label="标题"></el-table-column>
                <el-table-column prop="articleAuthor" width="70" label="作者"></el-table-column>
                <el-table-column width="70" label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status==='1'?'success':(scope.row.status==='0'?'danger':'')"
                        >{{scope.row.status==='1'?'发布':(scope.row.status==='0'?'下架':'')}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column width="70" label="点赞">
                    <template slot-scope="scope">{{scope.row.articleLikes}}</template>
                </el-table-column>
                <el-table-column width="70" label="浏览">
                    <template slot-scope="scope">{{scope.row.articleViews}}</template>
                </el-table-column>
                <el-table-column width="100" prop="createTime" label="发布日期"></el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <!--<el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>-->
    </div>
</template>

<script>
import { queryList } from '@/api/blog';
export default {
    // name: 'basetable',
    data() {
        return {
            query: {
                articleType: '',
                articleGrade: '',
                status: '',
                articleTitle: '',
                articleText: '',
                articleCategories: '',
                articleLabel: '',
                articleSpecial: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            queryList(this.query).then(res => {
                console.log(res);
                this.tableData = res.data;
                this.pageTotal = res.pageTotal || 50;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            //this.editVisible = true;
            this.$router.push({path: `/blogEdit?blogId=${row.id}`})
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 100px;
}

.handle-input {
    width: 200px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
