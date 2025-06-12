<template>
  <div class="user-container">
    <!-- 搜索和操作栏 -->
    <div class="mb-4 flex justify-between items-center">
      <el-input
        v-model="searchQuery"
        placeholder="请输入用户名搜索"
        @input="handleSearch"
      >
        <!-- <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template> -->
      </el-input>
      <el-button
        type="primary"
        @click="handleAdd"
      >
        <el-icon>
          <Plus />
        </el-icon>新增用户
      </el-button>
    </div>

    <!-- 用户列表 -->
    <el-table
      :data="displayUsers"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
      />
      <el-table-column
        prop="username"
        label="用户名"
        width="120"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
      />
      <el-table-column
        prop="email"
        label="邮箱"
      />
      <el-table-column
        prop="role"
        label="角色"
        width="100"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
      />
      <el-table-column
        prop="password"
        label="密码"
        width="180"
      />
      <el-table-column
        label="操作"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button
            link
            text
            @click="handleEdit(row)"
          >编辑</el-button>
          <el-button
            link
            text
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalUsers"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="name"
        >
          <el-input
            v-model="userForm.name"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="userForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item
          label="角色"
          prop="role"
          class="w-98"
        >
          <el-select
            v-model="userForm.role"
            placeholder="请选择角色"
          >
            <el-option
              label="管理员"
              value="admin"
            />
            <el-option
              label="白名单用户"
              value="whitelist"
            />
            <el-option
              label="普通用户"
              value="user"
            />
            <el-option
              label="内部用户"
              value="internal"
            />
            <el-option
              label="外部用户"
              value="external"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitForm"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

// 搜索相关
const searchQuery = ref('')
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)

// 用户数据
const userList = ref([])
const displayUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return userList.value.slice(start, end)
})

// 模拟获取用户数据
const fetchUsers = async () => {
  // TODO: 替换为实际的API调用
  const mockData = Array.from({ length: 55 }, (_, index) => ({
    id: index + 1,
    username: `user${index + 1}`,
    name: `用户${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: index % 5 === 0 ? 'admin' : 'user',
    createTime: new Date().toLocaleString()
  }))

  userList.value = mockData.filter(
    (user) =>
      user.username.includes(searchQuery.value) ||
      user.name.includes(searchQuery.value)
  )
  totalUsers.value = userList.value.length
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const userFormRef = ref()
const userForm = ref({
  username: '',
  name: '',
  email: '',
  role: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

// 新增用户
const handleAdd = () => {
  dialogTitle.value = '新增用户'
  userForm.value = {
    username: '',
    name: '',
    email: '',
    role: ''
  }
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  userForm.value = { ...row }
  dialogVisible.value = true
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // TODO: 调用删除API
      const index = userList.value.findIndex((item) => item.id === row.id)
      userList.value.splice(index, 1)
      totalUsers.value--
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}

// 提交表单
const submitForm = async () => {
  if (!userFormRef.value) return

  await userFormRef.value.validate((valid) => {
    if (valid) {
      // TODO: 调用新增或更新API
      if (userForm.value.id) {
        // 更新现有用户
        const index = userList.value.findIndex(
          (item) => item.id === userForm.value.id
        )
        userList.value[index] = { ...userForm.value }
      } else {
        // 新增用户
        const newUser = {
          ...userForm.value,
          id: userList.value.length + 1,
          createTime: new Date().toLocaleString()
        }
        userList.value.unshift(newUser)
        totalUsers.value++
      }

      dialogVisible.value = false
      ElMessage({
        type: 'success',
        message: userForm.value.id ? '更新成功' : '添加成功'
      })
    }
  })
}

// 初始化
fetchUsers()
</script>

<style scoped lang="less">
.user-container {
  min-height: 100%;
}
:deep(.el-pagination .el-select) {
  width: 100px !important;
}
</style>