<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useAppStore } from '../store/app'
import { useRouter } from 'vue-router'
import { routes } from '@/router/index.js'
const refreshRight = () => {}

const app = useAppStore()
const router = useRouter()
const formSize = ref('default')
const ruleFormRef = ref()

const isExpanded = ref(true)
const ruleForm = reactive({
  userName: '',
  gender: '',
  priority: '',
  date1: '',
  date2: '',
  hobby: [],
  cardType: '',
  cardNo: ''
})

const rules = reactive({
  userName: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' },
    { min: 2, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ],
  gender: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change'
    }
  ],
  priority: [
    {
      required: true,
      message: '请选择优先级',
      trigger: 'change'
    }
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
    }
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change'
    }
  ],
  hobby: [
    {
      type: 'array',
      // required: true,
      message: '请选择爱好',
      trigger: 'change'
    }
  ],
  cardType: [
    {
      required: true,
      message: '请选择证件类型',
      trigger: 'change'
    }
  ],
  cardNo: [{ required: true, message: '请输入证件号码', trigger: 'blur' }]
})
const checkedKeys = ref([])
// 格式化路由为树形结构
const formatRoutes = (routes) => {
  const data = routes
    .filter((route) => !route?.whiteUser && route.meta?.title)
    .map((route) => {
      const node = {
        title: route.meta.title
      }

      if (route.children) {
        const children = formatRoutes(route.children)
        if (children.length) {
          node.children = children
        }
      }

      return node
    })
  return [{ title: '权限管理', children: data }]
}

const permissionTree = computed(() => formatRoutes(routes))
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      localStorage.setItem('userInfo', JSON.stringify(ruleForm))
      localStorage.setItem('token', 'APPTEXT')
      localStorage.setItem('userName', ruleForm.userName)
      app.$patch({ userInfo: ruleForm })
      app.$patch({ token: 'APPTEXT' })
      app.$patch({ userName: ruleForm.userName })
      ElMessage.success('注册成功')
      setTimeout(() => {
        router.push('/index')
      }, 500)
    } else {
      ElMessage.error('表单错误')
      console.log('error submit!', fields)
    }
  })
}
const defaultProps = {
  children: 'children',
  label: 'title'
}

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
const searchQuery = ref('')
// 过滤后的角色列表
const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value

  return roles.value.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      role.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const handleSizeChange = (val) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const options = Array.from({ length: 100 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`
}))
</script>

<template>
  <div class="register">
    <!-- 左侧整体容器：包含内容 + 拉手 -->
    <div class="left-wrapper">
      <div
        class="left-content"
        :style="{ transform: isExpanded ? 'translateX(0)' : 'translateX(-222px)' }"
      >

        <div>
          <el-input
            style="width:180px !important;"
            placeholder="请输入"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-tree
            ref="permissionTreeRef"
            :data="permissionTree"
            node-key="path"
            :props="defaultProps"
          />
          <el-tree
            ref="permissionTreeRef"
            :data="permissionTree"
            node-key="path"
            :props="defaultProps"
          />
          <el-button style="width:180px !important;margin-top:120px;">新增</el-button>

        </div>

      </div>
      <div
        class="drawer-handle"
        :style="{ transform: isExpanded ? 'translateX(0)' : 'translateX(-212px)' }"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? '<' : '>' }}
      </div>
      <div class="right">
        <el-table
          :data="filteredRoles"
          border
          stripe
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
        <div class="mt-4 flex justify-end">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.register {
  position: relative;
  height: 100%;
}

.left-wrapper {
  position: relative;

  display: flex;

  flex: 1;
  height: 100%;
}

.left-content {
  transition: transform 0.3s ease;
  width: 200px;
  box-sizing: border-box;
  display: flex;

  justify-content: space-between;
  border-right: 1px solid var(--line-color);
  overflow: auto;
}

.drawer-handle {
  width: 10px;
  height: 40px;
  background-color: white;
  color: var(--line-color);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  border-radius: 0 2px 2px 0;
  border: 1px solid var(--line-color);

  //   margin-left: v-bind("isExpanded ? '0' : '-212px'");
  //   transition: margin-left 0.3s ease;
}

.right {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  padding: 20px;

  margin-left: v-bind("isExpanded ? '0' : '-212px'");
  transition: margin-left 0.3s ease;
}
</style>