<template>
  <div class="crm-container ">
    <!-- 搜索和操作栏 -->
    <div class="flex justify-between mb-4">
      <div class="search-box flex gap-2">
        <el-input
          v-model="searchQuery"
          placeholder="搜索客户名称/手机号"
        >
          <template #suffix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-select
          v-model="selectedTags"
          multiple
          collapse-tags
          placeholder="选择标签"
          class="w-64"
        >
          <el-option
            v-for="tag in tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </div>
      <div class="action-buttons">
        <el-button
          type="primary"
          @click="handleAddCustomer"
        >
          新增客户
        </el-button>
        <el-button @click="handleManageTags">管理标签</el-button>
      </div>
    </div>

    <!-- 客户列表 -->
    <el-table
      :data="filteredCustomers"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="客户名称"
        width="120"
      />
      <el-table-column
        prop="phone"
        label="联系电话"
        width="120"
      />
      <el-table-column
        prop="email"
        label="邮箱"
        width="220"
      />
      <el-table-column
        prop="level"
        label="客户等级"
        width="100"
      >
        <template #default="{ row }">
          <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="标签"
        min-width="180"
      >
        <template #default="{ row }">
          <el-tag
            v-for="tag in row.tags"
            :key="tag.id"
            class="mr-1"
            size="small"
          >
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastContact"
        label="最近联系"
        width="180"
      />
      <el-table-column
        label="操作"
        width="180"
        fixed="right"
      >
        <template #default="{ row }">
          <el-button
            link
            text
            @click="handleViewDetail(row)"
          >
            查看
          </el-button>
          <el-button
            link
            text
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            link
            text
            @click="handleAddInteraction(row)"
          >
            添加记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 客户详情弹窗 -->
    <el-dialog
      v-model="detailDialog.visible"
      :title="detailDialog.title"
      width="800px"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="基本信息"
          name="basic"
        >
          <div class="customer-info">
            <div
              class="info-row"
              v-for="(value, key) in customerDetail"
              :key="key"
            >
              <span class="label">{{ getFieldLabel(key) }}：</span>
              <span class="value">{{ value }}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="交互记录"
          name="interactions"
        >
          <div class="interactions-list">
            <div
              v-for="item in interactions"
              :key="item.id"
              class="interaction-item"
            >
              <div class="interaction-header">
                <span class="time">{{ item.time }}</span>
                <span class="type">{{ item.type }}</span>
              </div>
              <div class="content">{{ item.content }}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 添加/编辑客户弹窗 -->
    <el-dialog
      v-model="customerDialog.visible"
      :title="customerDialog.title"
      width="600px"
    >
      <el-form
        ref="customerFormRef"
        :model="customerForm"
        :rules="customerRules"
        label-width="100px"
      >
        <el-form-item
          label="客户名称"
          prop="name"
        >
          <el-input
            v-model="customerForm.name"
            placeholder="请输入客户名称"
          />
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="phone"
        >
          <el-input
            v-model="customerForm.phone"
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="customerForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item
          label="客户等级"
          prop="level"
        >
          <el-select v-model="customerForm.level">
            <el-option
              label="普通"
              value="普通"
            />
            <el-option
              label="重要"
              value="重要"
            />
            <el-option
              label="VIP"
              value="VIP"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="customerForm.tags"
            multiple
            class="w-100"
          >
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="customerDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmitCustomer"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加交互记录弹窗 -->
    <el-dialog
      v-model="interactionDialog.visible"
      title="添加交互记录"
      width="500px"
    >
      <el-form
        ref="interactionFormRef"
        :model="interactionForm"
        :rules="interactionRules"
        label-width="100px"
      >
        <el-form-item
          label="交互类型"
          prop="type"
        >
          <el-select
            v-model="interactionForm.type"
            class="w-full"
          >
            <el-option
              label="电话"
              value="电话"
            />
            <el-option
              label="邮件"
              value="邮件"
            />
            <el-option
              label="会议"
              value="会议"
            />
            <el-option
              label="其他"
              value="其他"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="交互内容"
          prop="content"
        >
          <el-input
            v-model="interactionForm.content"
            type="textarea"
            rows="4"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="interactionDialog.visible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmitInteraction"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 标签管理弹窗 -->
    <el-dialog
      v-model="tagDialog.visible"
      title="标签管理"
      width="400px"
    >
      <div class="tag-list">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="tag-item"
        >
          <el-tag
            closable
            @close="handleDeleteTag(tag)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
        <div class="add-tag">
          <el-input
            v-if="tagInput.visible"
            ref="tagInputRef"
            v-model="tagInput.value"
            @keyup.enter="handleAddTag"
            @blur="handleAddTag"
          />
          <el-button
            v-else
            @click="showTagInput"
          >
            + 新增标签
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索相关
const searchQuery = ref('')
const selectedTags = ref([])

// 标签数据
const tags = ref([
  { id: 1, name: '潜在客户' },
  { id: 2, name: '活跃客户' },
  { id: 3, name: '高价值' },
  { id: 4, name: '待跟进' }
])

// 客户数据
const customers = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    level: 'VIP',
    tags: [
      { id: 1, name: '潜在客户' },
      { id: 3, name: '高价值' }
    ],
    lastContact: '2024-05-15 14:30:00'
  }
])

const activeTab = ref('basic')
const customerDetail = ref({})

// 交互记录数据
const interactions = ref([
  {
    id: 1,
    time: '2024-05-15 14:30:00',
    type: '电话',
    content: '讨论了新项目的具体需求'
  }
])

// 弹窗状态管理
const detailDialog = reactive({
  visible: false,
  title: '客户详情'
})

const customerDialog = reactive({
  visible: false,
  title: '新增客户',
  isEdit: false
})

const interactionDialog = reactive({
  visible: false,
  customerId: null
})

const tagDialog = reactive({
  visible: false
})

// 表单数据
const customerForm = reactive({
  name: '',
  phone: '',
  email: '',
  level: '普通',
  tags: []
})

const interactionForm = reactive({
  type: '',
  content: ''
})

const tagInput = reactive({
  visible: false,
  value: ''
})

// 表单校验规则
const customerRules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }],
  level: [{ required: true, message: '请选择客户等级', trigger: 'change' }]
}

const interactionRules = {
  type: [{ required: true, message: '请选择交互类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入交互内容', trigger: 'blur' }]
}

// 计算属性：过滤后的客户列表
const filteredCustomers = computed(() => {
  return customers.value.filter((customer) => {
    const matchQuery =
      !searchQuery.value ||
      customer.name.includes(searchQuery.value) ||
      customer.phone.includes(searchQuery.value)

    const matchTags =
      selectedTags.value.length === 0 ||
      customer.tags.some((tag) => selectedTags.value.includes(tag.id))

    return matchQuery && matchTags
  })
})

// 方法定义
const getLevelType = (level) => {
  const types = {
    普通: '',
    重要: 'warning',
    VIP: 'success'
  }
  return types[level] || ''
}

const handleAddCustomer = () => {
  customerDialog.title = '新增客户'
  customerDialog.isEdit = false
  Object.assign(customerForm, {
    name: '',
    phone: '',
    email: '',
    level: '普通',
    tags: []
  })
  customerDialog.visible = true
}

const handleEdit = (row) => {
  customerDialog.title = '编辑客户'
  customerDialog.isEdit = true
  Object.assign(customerForm, row)
  customerDialog.visible = true
}

const handleViewDetail = (row) => {
  detailDialog.visible = true
  customerDetail.value = { ...row }
  activeTab.value = 'basic'
  // TODO: 加载该客户的交互记录
}

const handleAddInteraction = (row) => {
  interactionDialog.customerId = row.id
  Object.assign(interactionForm, {
    type: '',
    content: ''
  })
  interactionDialog.visible = true
}

const handleManageTags = () => {
  tagDialog.visible = true
}

const showTagInput = () => {
  tagInput.visible = true
  tagInput.value = ''
  // 在下一个tick聚焦输入框
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

const handleAddTag = () => {
  if (tagInput.value) {
    tags.value.push({
      id: Date.now(),
      name: tagInput.value
    })
    tagInput.value = ''
  }
  tagInput.visible = false
}

const handleDeleteTag = (tag) => {
  const index = tags.value.findIndex((t) => t.id === tag.id)
  if (index !== -1) {
    tags.value.splice(index, 1)
  }
}

const handleSubmitCustomer = () => {
  // TODO: 提交客户表单
  if (customerDialog.isEdit) {
    const index = customers.value.findIndex((c) => c.id === customerForm.id)
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...customerForm }
    }
  } else {
    customers.value.push({
      id: Date.now(),
      ...customerForm,
      lastContact: new Date().toLocaleString()
    })
  }
  customerDialog.visible = false
  ElMessage.success(customerDialog.isEdit ? '编辑成功' : '添加成功')
}

const handleSubmitInteraction = () => {
  interactions.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleString(),
    ...interactionForm
  })

  // 更新客户最近联系时间
  const customerIndex = customers.value.findIndex(
    (c) => c.id === interactionDialog.customerId
  )
  if (customerIndex !== -1) {
    customers.value[customerIndex].lastContact = new Date().toLocaleString()
  }

  interactionDialog.visible = false
  ElMessage.success('添加记录成功')
}

const getFieldLabel = (key) => {
  const labels = {
    name: '客户名称',
    phone: '联系电话',
    email: '邮箱',
    level: '客户等级',
    lastContact: '最近联系'
  }
  return labels[key] || key
}
</script>

<style scoped lang="less">
.crm-container {
  .interactions-list {
    .interaction-item {
      border-bottom: 1px solid #eee;
      padding: 12px 0;

      .interaction-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        color: #666;
        font-size: 14px;
      }

      .content {
        color: #333;
        line-height: 1.5;
      }
    }
  }

  .customer-info {
    .info-row {
      margin-bottom: 16px;
      display: flex;

      .label {
        width: 100px;
        color: #666;
      }

      .value {
        flex: 1;
        color: #333;
      }
    }
  }

  .tag-list {
    .tag-item {
      display: inline-block;
      margin: 0 8px 8px 0;
    }

    .add-tag {
      display: inline-block;
      vertical-align: top;
    }
  }
}

.el-tag + .el-tag {
  //   margin-left: 8px;
}
</style>