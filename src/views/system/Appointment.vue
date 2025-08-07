<template>
  <div class="meeting-system">
    <el-container>
      <el-main>
        <el-tabs
          v-model="activeTab"
          type="border-card"
        >
          <!-- 会议预约 -->
          <el-tab-pane
            name="appointment"
            label="会议预约"
          >
            <div class="flex gap-4">
              <!-- 左侧日历 -->
              <div class="w-1/2">
                <el-card class="calendar-card">
                  <el-calendar v-model="selectedDate">

                    <template #dateCell="{ data }">
                      <div
                        class="calendar-cell"
                        :class="{ 'has-meetings': hasMeetings(data.day) }"
                      >
                        <p>{{ data.day.split('-')[2] }}</p>
                        <div class="meeting-dots">
                          <span
                            v-for="(type, index) in getMeetingTypes(data.day)"
                            :key="index"
                            class="dot"
                            :class="type"
                          />
                        </div>
                      </div>
                    </template>
                  </el-calendar>
                </el-card>
              </div>

              <!-- 右侧会议列表/表单 -->
              <div class="w-1/2">
                <el-card v-if="!showAppointmentForm">
                  <template #header>
                    <div class="flex justify-between items-center">
                      <span>{{ formatDate(selectedDate) }} 会议安排</span>
                      <el-button
                        type="primary"
                        @click="showAppointmentForm = true"
                      >
                        预约会议
                      </el-button>
                    </div>
                  </template>

                  <el-timeline>
                    <el-timeline-item
                      v-for="meeting in dayMeetings"
                      :key="meeting.id"
                      :type="meeting.status === 'ongoing' ? 'primary' : ''"
                      :timestamp="meeting.startTime + ' - ' + meeting.endTime"
                    >
                      <el-card class="meeting-card">
                        <template #header>
                          <div class="flex justify-between items-center">
                            <span class="font-bold">{{ meeting.title }}</span>
                            <el-tag :type="getStatusType(meeting.status)">
                              {{ getStatusText(meeting.status) }}
                            </el-tag>
                          </div>
                        </template>
                        <div class="meeting-info">
                          <p><el-icon>
                              <UserFilled />
                            </el-icon> 主持人：{{ meeting.host }}</p>
                          <p><el-icon>
                              <Location />
                            </el-icon> 会议室：{{ meeting.room }}</p>
                          <p><el-icon>
                              <User />
                            </el-icon> 参会人数：{{ meeting.attendees.length }}人</p>
                          <div class="mt-2 flex gap-2">
                            <el-button
                              v-if="meeting.status === 'pending'"
                              type="primary"
                              @click="startMeeting(meeting)"
                            >
                              开始会议
                            </el-button>
                            <el-button
                              v-if="meeting.status === 'ongoing'"
                              type="primary"
                              @click="endMeeting(meeting)"
                            >
                              结束会议
                            </el-button>
                            <el-button
                              v-if="meeting.status === 'pending'"
                              type="warning"
                              @click="cancelMeeting(meeting)"
                            >
                              取消会议
                            </el-button>
                            <el-button
                              link
                              type="text"
                              @click="viewDetail(meeting)"
                              style="width: 90px;"
                            >查看详情</el-button>
                          </div>
                        </div>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </el-card>

                <!-- 预约表单 -->
                <el-card v-else>
                  <template #header>
                    <div class="flex justify-between items-center">
                      <span>预约会议</span>
                      <el-button
                        link
                        @click="showAppointmentForm = false"
                      >返回</el-button>
                    </div>
                  </template>

                  <el-form
                    :model="appointmentForm"
                    :rules="formRules"
                    ref="appointmentFormRef"
                    label-width="100px"
                  >
                    <el-form-item
                      label="会议主题"
                      prop="title"
                    >
                      <el-input
                        v-model="appointmentForm.title"
                        placeholder="请输入会议主题"
                      />
                    </el-form-item>

                    <el-form-item
                      label="会议时间"
                      prop="timeRange"
                    >
                      <el-date-picker
                        v-model="appointmentForm.timeRange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :disabled-date="disabledDate"
                        :disabled-time="disabledTime"
                      />
                    </el-form-item>

                    <el-form-item
                      label="会议室"
                      prop="room"
                    >
                      <el-select
                        v-model="appointmentForm.room"
                        placeholder="请选择会议室"
                      >
                        <el-option
                          v-for="room in availableRooms"
                          :key="room.id"
                          :label="room.name"
                          :value="room.id"
                        >
                          <span>{{ room.name }}</span>
                          <span class="text-gray-500 ml-2">({{ room.capacity }}人)</span>
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      label="参会人员"
                      prop="attendees"
                    >
                      <el-select
                        v-model="appointmentForm.attendees"
                        multiple
                        filterable
                        remote
                        placeholder="请选择参会人员"
                        :remote-method="searchUsers"
                        :loading="loading"
                      >
                        <el-option
                          v-for="user in userOptions"
                          :key="user.id"
                          :label="user.name"
                          :value="user.id"
                        >
                          <div class="flex items-center">
                            <el-avatar
                              :size="24"
                              :src="user.avatar"
                            />
                            <span class="ml-2">{{ user.name }}</span>
                            <span class="text-gray-500 ml-2">({{ user.department }})</span>
                          </div>
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item
                      label="会议内容"
                      prop="content"
                    >
                      <el-input
                        v-model="appointmentForm.content"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入会议内容"
                      />
                    </el-form-item>

                    <el-form-item label="会议文件">
                      <Upload
                        tip="测试一段文字我不i难道还是几乎都是进口的"
                        list-type="picture-card"
                      />
                    </el-form-item>

                    <el-form-item>
                      <el-checkbox v-model="appointmentForm.sendNotification">
                        发送会议通知
                      </el-checkbox>
                    </el-form-item>

                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="submitAppointment"
                        :loading="submitting"
                      >
                        提交预约
                      </el-button>
                      <el-button @click="showAppointmentForm = false">取消</el-button>
                    </el-form-item>
                  </el-form>
                </el-card>
              </div>
            </div>
          </el-tab-pane>

          <!-- 会议记录 -->
          <el-tab-pane
            name="records"
            label="会议记录"
          >
            <el-form class="demo-form-inline mb-4">
              <el-form-item
                label="时间范围"
                style="width:400px;"
              >
                <el-date-picker
                  v-model="recordsDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item
                label="会议状态"
                style="width:400px;"
              >
                <el-select
                  v-model="recordsStatus"
                  placeholder="请选择"
                >
                  <el-option
                    label="全部"
                    value=""
                  />
                  <el-option
                    label="已完成"
                    value="completed"
                  />
                  <el-option
                    label="已取消"
                    value="cancelled"
                  />
                </el-select>
              </el-form-item>
              <el-form-item style="padding-left:100px;">
                <el-button
                  type="primary"
                  @click="searchRecords"
                >查询</el-button>
                <el-button @click="exportRecords">导出</el-button>
              </el-form-item>
            </el-form>

            <el-table
              :data="meetingRecords"
              style="width: 100%"
            >
              <el-table-column
                prop="date"
                label="会议日期"
                width="120"
              />
              <el-table-column
                prop="time"
                label="会议时间"
                width="180"
              />
              <el-table-column
                prop="title"
                label="会议主题"
                width="230"
              />
              <el-table-column
                prop="room"
                label="会议室"
                width="120"
              />
              <el-table-column
                prop="host"
                label="主持人"
                width="120"
              />
              <el-table-column
                prop="status"
                label="状态"
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="duration"
                label="会议时长"
                width="150"
              />
              <el-table-column
                label="操作"
                fixed="right"
              >
                <template #default="{ row }">
                  <el-button
                    link
                    @click="viewRecordDetail(row)"
                    text
                  >查看详情</el-button>
                  <el-button
                    link
                    text
                    @click="downloadMinutes(row)"
                  >
                    会议纪要
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="flex justify-end mt-4">
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
          </el-tab-pane>

          <!-- 会议室管理 -->
          <el-tab-pane
            name="rooms"
            label="会议室管理"
          >
            <div class="flex justify-end mb-4">
              <el-button
                type="primary"
                @click="showAddRoomDialog = true"
              >
                添加会议室
              </el-button>
            </div>

            <el-table
              :data="meetingRooms"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="会议室名称"
              />
              <el-table-column
                prop="location"
                label="位置"
              />
              <el-table-column
                prop="capacity"
                label="容量"
                width="100"
              >
                <template #default="{ row }">
                  {{ row.capacity }}人
                </template>
              </el-table-column>
              <el-table-column
                prop="facilities"
                label="设施配置"
              >
                <template #default="{ row }">
                  <el-tag
                    v-for="item in row.facilities"
                    :key="item"
                    class="mr-1"
                  >
                    {{ item }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                width="100"
              >
                <template #default="{ row }">
                  <el-tag :type="row.status === 'available' ? 'success' : 'danger'">
                    {{ row.status === 'available' ? '可用' : '维护中' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="200"
              >
                <template #default="{ row }">
                  <el-button
                    link
                    text
                    @click="editRoom(row)"
                  >编辑</el-button>
                  <el-button
                    link
                    text
                    style="width: 72px;height:28px;"
                    @click="toggleRoomStatus(row)"
                  >
                    {{ row.status === 'available' ? '设为维护' : '设为可用' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>

        <!-- 会议室弹窗 -->
        <el-dialog
          v-model="showAddRoomDialog"
          :title="editingRoom ? '编辑会议室' : '添加会议室'"
          width="500px"
        >
          <el-form
            :model="roomForm"
            :rules="roomRules"
            ref="roomFormRef"
            label-width="100px"
          >
            <el-form-item
              label="会议室名称"
              prop="name"
            >
              <el-input v-model="roomForm.name" />
            </el-form-item>
            <el-form-item
              label="位置"
              prop="location"
            >
              <el-input v-model="roomForm.location" />
            </el-form-item>
            <el-form-item
              label="容量"
              prop="capacity"
            >
              <el-input-number
                v-model="roomForm.capacity"
                :min="1"
              />
            </el-form-item>
            <el-form-item
              label="设施配置"
              prop="facilities"
            >
              <el-checkbox-group v-model="roomForm.facilities">
                <el-checkbox label="投影仪">投影仪</el-checkbox>
                <el-checkbox label="白板">白板</el-checkbox>
                <el-checkbox label="视频会议">视频会议</el-checkbox>
                <el-checkbox label="音响">音响</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showAddRoomDialog = false">取消</el-button>
              <el-button
                type="primary"
                @click="submitRoom"
              >确定</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 会议详情弹窗 -->
        <el-dialog
          v-model="showDetailDialog"
          title="会议详情"
          width="600px"
        >
          <div v-if="selectedMeeting">
            <div class="meeting-detail">
              <h3 class="text-xl font-bold mb-4">{{ selectedMeeting.title }}</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>开始时间</label>
                  <span>{{ selectedMeeting.startTime }}</span>
                </div>
                <div class="info-item">
                  <label>结束时间</label>
                  <span>{{ selectedMeeting.endTime }}</span>
                </div>
                <div class="info-item">
                  <label>会议室</label>
                  <span>{{ selectedMeeting.room }}</span>
                </div>
                <div class="info-item">
                  <label>主持人</label>
                  <span>{{ selectedMeeting.host }}</span>
                </div>
              </div>

              <div class="mt-4">
                <h4 class="font-bold mb-2">会议内容</h4>
                <p class="whitespace-pre-wrap">{{ selectedMeeting.content }}</p>
              </div>

              <div class="mt-4">
                <h4 class="font-bold mb-2">参会人员 ({{ selectedMeeting.attendees.length }})</h4>
                <div class="flex flex-wrap gap-2">
                  <el-avatar
                    v-for="attendee in selectedMeeting.attendees"
                    :key="attendee.id"
                    :size="32"
                    :src="attendee.avatar"
                  />
                </div>
              </div>

              <div
                class="mt-4"
                v-if="selectedMeeting.files?.length"
              >
                <h4 class="font-bold mb-2">会议文件</h4>
                <div class="flex flex-col gap-2">
                  <div
                    v-for="file in selectedMeeting.files"
                    :key="file.id"
                    class="flex items-center justify-between p-2 border rounded"
                  >
                    <span>{{ file.name }}</span>
                    <el-button
                      link
                      type="primary"
                      @click="downloadFile(file)"
                    >
                      下载
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled, User, Location } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import Upload from '@/components/Upload.vue'
// 状态变量
const activeTab = ref('appointment')
const selectedDate = ref(new Date())
const showAppointmentForm = ref(false)
const showAddRoomDialog = ref(false)
const showDetailDialog = ref(false)
const loading = ref(false)
const submitting = ref(false)
const editingRoom = ref(null)
const selectedMeeting = ref(null)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 会议预约表单
const appointmentForm = reactive({
  title: '',
  timeRange: [],
  room: '',
  attendees: [],
  content: '',
  files: [],
  sendNotification: true
})

// 会议室表单
const roomForm = reactive({
  name: '',
  location: '',
  capacity: 10,
  facilities: []
})

// 记录筛选
const recordsDateRange = ref([])
const recordsStatus = ref('')

// 模拟数据
const dayMeetings = ref([
  {
    id: 1,
    title: '产品评审会议',
    startTime: '09:00',
    endTime: '10:30',
    room: '第一会议室',
    host: '张三',
    status: 'ongoing',
    attendees: [
      { id: 1, name: '张三', avatar: 'https://example.com/avatar1.jpg' },
      { id: 2, name: '李四', avatar: 'https://example.com/avatar2.jpg' }
    ]
  }
])

const meetingRooms = ref([
  {
    id: 1,
    name: '第一会议室',
    location: '3楼东侧',
    capacity: 20,
    facilities: ['投影仪', '白板', '视频会议'],
    status: 'available'
  }
])

const meetingRecords = ref([
  {
    id: 1,
    date: '2025-05-22',
    time: '09:00-10:30',
    title: '产品评审会议',
    room: '第一会议室',
    host: '张三',
    status: 'completed',
    duration: '1.5小时'
  }
])

// 表单验证规则
const formRules = {
  title: [{ required: true, message: '请输入会议主题', trigger: 'blur' }],
  timeRange: [{ required: true, message: '请选择会议时间', trigger: 'change' }],
  room: [{ required: true, message: '请选择会议室', trigger: 'change' }],
  attendees: [{ required: true, message: '请选择参会人员', trigger: 'change' }]
}

const roomRules = {
  name: [{ required: true, message: '请输入会议室名称', trigger: 'blur' }],
  location: [{ required: true, message: '请输入会议室位置', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入会议室容量', trigger: 'change' }]
}

// 计算属性
const availableRooms = computed(() => {
  return meetingRooms.value.filter((room) => room.status === 'available')
})

// 方法
const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}

const hasMeetings = (day) => {
  // TODO: 检查该日期是否有会议
  return true
}

const getMeetingTypes = (day) => {
  // TODO: 返回该日期的会议类型（用于显示不同颜色的点）
  return ['normal', 'important']
}

const getStatusType = (status) => {
  const types = {
    pending: '',
    ongoing: 'success',
    completed: 'info',
    cancelled: 'danger'
  }
  return types[status]
}

const getStatusText = (status) => {
  const texts = {
    pending: '未开始',
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status]
}

const searchUsers = async (query) => {
  if (query) {
    loading.value = true
    try {
      // TODO: 调用搜索用户API
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      loading.value = false
    }
  }
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传5个文件')
}

const submitAppointment = async () => {
  try {
    submitting.value = true
    // TODO: 调用预约API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    ElMessage.success('预约成功')
    showAppointmentForm.value = false
  } catch {
    ElMessage.error('预约失败')
  } finally {
    submitting.value = false
  }
}

const startMeeting = async (meeting) => {
  try {
    // TODO: 调用开始会议API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    meeting.status = 'ongoing'
    ElMessage.success('会议已开始')
  } catch {
    ElMessage.error('开始会议失败')
  }
}

const endMeeting = async (meeting) => {
  try {
    await ElMessageBox.confirm('确定要结束会议吗？')
    // TODO: 调用结束会议API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    meeting.status = 'completed'
    ElMessage.success('会议已结束')
  } catch {
    // 用户取消操作
  }
}

const cancelMeeting = async (meeting) => {
  try {
    await ElMessageBox.confirm('确定要取消会议吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用取消会议API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    meeting.status = 'cancelled'
    ElMessage.success('会议已取消')
  } catch {
    // 用户取消操作
  }
}

const viewDetail = (meeting) => {
  selectedMeeting.value = meeting
  showDetailDialog.value = true
}

const searchRecords = () => {
  // TODO: 搜索会议记录
}

const exportRecords = () => {
  // TODO: 导出会议记录
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // TODO: 重新加载数据
}

const editRoom = (room) => {
  editingRoom.value = room
  Object.assign(roomForm, room)
  showAddRoomDialog.value = true
}

const toggleRoomStatus = async (room) => {
  try {
    await ElMessageBox.confirm(
      `确定要将会议室状态改为${
        room.status === 'available' ? '维护中' : '可用'
      }吗？`
    )
    room.status = room.status === 'available' ? 'maintenance' : 'available'
    ElMessage.success('状态已更新')
  } catch {
    // 用户取消操作
  }
}

const submitRoom = async () => {
  try {
    // TODO: 调用保存会议室API
    await new Promise((resolve) => setTimeout(resolve, 1000))
    ElMessage.success(editingRoom.value ? '编辑成功' : '添加成功')
    showAddRoomDialog.value = false
  } catch {
    ElMessage.error(editingRoom.value ? '编辑失败' : '添加失败')
  }
}

const downloadFile = (file) => {
  // TODO: 下载文件
}

const downloadMinutes = (record) => {
  // TODO: 下载会议纪要
}

// 初始化
onMounted(() => {
  // TODO: 加载初始数据
})
</script>

<style scoped lang="less">
.meeting-system {
  .el-container {
    .el-main {
      --el-main-padding: 0px !important;
    }
  }
}

.calendar-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
}

.meeting-dots {
  display: flex;
  gap: 2px;
  justify-content: center;
  margin-top: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot.normal {
  background-color: var(--primary-color);
}

.dot.important {
  background-color: var(--primary-color);
}

.meeting-card {
  margin-bottom: 0;
}

.meeting-info {
  p {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;

  label {
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
  }
}

:deep(.el-form-item__label) {
  width: 100px !important;
}
</style>