<template>
  <div class="role-container">
    <!-- 搜索栏 -->
    <div class="mb-4 text-left">
      <el-input
        v-model="searchQuery"
        placeholder="请输入角色名称搜索"
        class="search-input"
        @input="handleSearch"
      >
        <!-- <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template> -->
      </el-input>
    </div>

    <!-- 角色列表 -->
    <el-table
      :data="filteredRoles"
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
        prop="name"
        label="角色名称"
        width="150"
      />
      <el-table-column
        prop="code"
        label="角色代码"
        width="120"
      />
      <el-table-column
        prop="description"
        label="描述"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
      />
      <el-table-column
        label="操作"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button
            text
            :disabled="row.code === 'admin'"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            text
            @click="handlePermission(row)"
          >
            权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="permissionDialog.visible"
      title="权限设置"
      width="600px"
    >
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTree"
        show-checkbox
        node-key="path"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="savePermissions"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="角色名称"
          prop="name"
        >
          <el-input
            v-model="roleForm.name"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item
          label="角色代码"
          prop="code"
        >
          <el-input
            v-model="roleForm.code"
            placeholder="请输入角色代码"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="description"
        >
          <el-input
            v-model="roleForm.description"
            type="textarea"
            rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="roleForm.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="禁用">禁用</el-radio>
          </el-radio-group>
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
import { ref, computed, onMounted, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { routes } from '@/router/index.js'
import { useAppStore } from '@/store/app'

const app = useAppStore()
const route = useRouter()
const permissionDialog = ref({
  visible: false,
  roleId: null
})
const permissionTreeRef = ref(null)
const checkedKeys = ref([])
// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('编辑角色')
const isEdit = ref(false)
const roleFormRef = ref()
const roleForm = ref({
  name: '',
  code: '',
  description: '',
  status: '启用'
})
watch(
  () => permissionDialog.value.roleId,
  (val) => {
    if (val) {
      // 处理权限数据
      checkedKeys.value =
        app.rolePermissions?.[permissionDialog.value.roleId] || []
    }
  },
  { immediate: true }
)
// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色代码', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '角色代码必须以字母开头，只能包含字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const defaultProps = {
  children: 'children',
  label: 'title'
}
// 搜索相关
const searchQuery = ref('')
const handleSearch = () => {
  // 实时搜索，不需要额外处理
}

// 角色数据
const roles = ref([
  {
    id: 1,
    name: '管理员',
    code: 'admin',
    description: '系统管理员，拥有所有权限',
    status: '启用',
    createTime: '2024-05-12 10:00:00'
  },
  {
    id: 2,
    name: '普通用户',
    code: 'user',
    description: '普通用户，拥有基本权限',
    status: '启用',
    createTime: '2024-05-12 10:00:00'
  },
  {
    id: 3,
    name: '白名单用户',
    code: 'whitelist',
    description: '白名单用户，拥有特殊权限',
    status: '启用',
    createTime: '2024-05-12 10:00:00'
  },
  {
    id: 4,
    name: '内部用户',
    code: 'internal',
    description: '内部用户，拥有内部系统权限',
    status: '启用',
    createTime: '2024-05-12 10:00:00'
  },
  {
    id: 5,
    name: '外部用户',
    code: 'external',
    description: '外部用户，拥有有限权限',
    status: '启用',
    createTime: '2024-05-12 10:00:00'
  },
  {
    id: 6,
    name: '复核员',
    code: 'checker',
    description: '复核员，拥有复核权限',
    status: '启用',
    createTime: '2024-05-21 10:00:00'
  }
])

// 过滤后的角色列表
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value

  return roles.value.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      role.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 格式化路由为树形结构
const formatRoutes = (routes) => {
  return routes
    .filter((route) => !route?.whiteUser && route.meta?.title)
    .map((route) => {
      const node = {
        title: route.meta.title,
        path: route.path
      }

      if (route.children) {
        const children = formatRoutes(route.children)
        if (children.length) {
          node.children = children
        }
      }

      return node
    })
}

// 计算权限树数据
const permissionTree = computed(() => formatRoutes(routes))
// 处理权限设置
const handlePermission = (row) => {
  permissionDialog.value.visible = true
  permissionDialog.value.roleId = row.id

  // 模拟获取该角色已有的权限
  // 实际使用时应该从后端获取
  checkedKeys.value = row.permissions || []
}

const savePermissions = async () => {
  ElMessageBox.confirm('更改权限设置，需要重新登陆，是否确认更改？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const checkedNodes = permissionTreeRef.value.getCheckedNodes()
      const halfCheckedNodes = permissionTreeRef.value.getHalfCheckedNodes()
      const permissions = [...checkedNodes, ...halfCheckedNodes].map(
        (node) => node.path
      )

      try {
        // TODO: 调用保存权限的API
        app.saveRolePermissions(permissionDialog.value.roleId, permissions)

        ElMessage.success('权限设置成功')
        permissionDialog.value.visible = false
      } catch (error) {
        ElMessage.error('权限设置失败')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '您已取消'
      })
    })
}

// 编辑角色
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑角色'
  roleForm.value = { ...row }
  dialogVisible.value = true
}

onMounted(() => {})
// 提交表单
const submitForm = async () => {
  if (!roleFormRef.value) return

  await roleFormRef.value.validate((valid) => {
    if (valid) {
      // TODO: 调用编辑API
      const index = roles.value.findIndex(
        (item) => item.id === roleForm.value.id
      )
      if (index !== -1) {
        roles.value[index] = { ...roles.value[index], ...roleForm.value }
      }

      dialogVisible.value = false
      ElMessage({
        type: 'success',
        message: '编辑成功'
      })
    }
  })
}
</script>

<style scoped lang="less">
.role-container {
  min-height: 100%;
}
.role-container::-webkit-scrollbar {
  display: none;
  width: 0;
}
.el-tree {
  margin: 10px 0;
}
</style>