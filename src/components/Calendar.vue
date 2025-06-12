<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())

// 获取当月天数
const getDaysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// 获取当月第一天是星期几
const getFirstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

// 生成日历数据
const calendarDays = computed(() => {
  const days = []
  const daysInWeek = 7
  const firstDay = getFirstDayOfMonth.value
  const totalDays = getDaysInMonth.value
  const maxRows = 5
  const maxCells = maxRows * daysInWeek

  // 获取今天的日期
  const today = new Date()
  const isCurrentMonth =
    today.getFullYear() === currentYear.value &&
    today.getMonth() === currentMonth.value
  const todayDate = today.getDate()

  // 填充前面的空白
  for (let i = 0; i < firstDay; i++) {
    days.push({ type: 'empty' })
  }

  // 计算需要合并的日期数
  const normalCellsCount = maxCells - firstDay // 可用于正常显示的格子数
  const daysToMerge = Math.max(0, totalDays - normalCellsCount) // 需要合并的日期数

  // 填充日期
  for (let i = 1; i <= totalDays; i++) {
    const isToday = isCurrentMonth && i === todayDate

    if (i <= normalCellsCount) {
      // 正常填充单个日期
      days.push({
        type: 'single',
        value: i,
        isToday
      })
    } else {
      // 需要合并的日期，与倒数的日期共用格子
      const mergeWithIndex =
        days.length - daysToMerge + (i - normalCellsCount - 1)
      const targetCell = days[mergeWithIndex]
      if (targetCell.type === 'single') {
        // 转换为多值格子
        targetCell.type = 'multiple'
        targetCell.value = [targetCell.value, i]
        targetCell.isToday = targetCell.isToday || isToday
      }
    }
  }

  // 补充剩余空白到35格
  while (days.length < maxCells) {
    days.push({ type: 'empty' })
  }

  return days
})

// 月份切换
const changeMonth = (increment) => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(currentMonth.value + increment)
  currentDate.value = newDate
}

// 年份切换
const changeYear = (increment) => {
  const newDate = new Date(currentDate.value)
  newDate.setFullYear(currentYear.value + increment)
  currentDate.value = newDate
}
</script>

<template>
  <div class="calendar">
    <div class="calendar-header">
      <div class="year-control">
        <el-button @click="changeYear(-1)">上一年</el-button>
        <span>{{ currentYear }}年</span>
        <el-button @click="changeYear(1)">下一年</el-button>
      </div>
      <div class="month-control">
        <el-button @click="changeMonth(-1)">上个月</el-button>
        <span>{{ currentMonth + 1 }}月</span>
        <el-button @click="changeMonth(1)">下个月</el-button>
      </div>
    </div>

    <div class="calendar-body">
      <div class="weekdays">
        <div class="weekday">日</div>
        <div class="weekday">一</div>
        <div class="weekday">二</div>
        <div class="weekday">三</div>
        <div class="weekday">四</div>
        <div class="weekday">五</div>
        <div class="weekday">六</div>
      </div>
      <div class="days">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="day"
          :class="[day.type, day.isToday ? 'is-today' : '']"
        >
          <template v-if="day.type === 'single'">
            {{ day.value }}
          </template>
          <template v-else-if="day.type === 'multiple'">
            <div class="diagonal-container">
              <div class="diagonal-values">
                <template
                  v-for="(value, vIndex) in day.value"
                  :key="vIndex"
                >
                  <div :class="{'value-top': vIndex === 0, 'value-bottom': vIndex === day.value.length - 1}">
                    {{ value }}
                  </div>
                </template>
              </div>
              <div class="diagonal-line"></div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.calendar {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .calendar-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;

    .year-control,
    .month-control {
      display: flex;
      align-items: center;
      gap: 10px;

      span {
        min-width: 60px;
        text-align: center;
      }
    }
  }

  .calendar-body {
    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-weight: bold;
      margin-bottom: 10px;

      .weekday {
        padding: 10px;
        background-color: transparent;
      }
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0px;

      .day {
        position: relative;
        padding: 20px;
        text-align: center;
        border: 1px solid #121212;
        cursor: pointer;
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;

        &.is-today {
          color: var(--primary-color);
          font-weight: bold;
        }

        &:hover {
          background-color: #ffffff30;
          color: var(--primary-color);
        }

        &.empty {
          background-color: transparent;
          cursor: default;
        }

        &.multiple {
          padding: 0;

          .diagonal-container {
            position: relative;
            width: 100%;
            height: 100%;

            .diagonal-values {
              position: absolute;
              width: 100%;
              height: 100%;
              z-index: 1;

              .value-top {
                position: absolute;
                top: 5px;
                left: 5px;
              }

              .value-bottom {
                position: absolute;
                bottom: 5px;
                right: 5px;
              }
            }

            .diagonal-line {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(
                to right bottom,
                transparent 48%,
                #121212 49%,
                #121212 51%,
                transparent 52%
              );
            }
          }
        }
      }
    }
  }
}
</style>
