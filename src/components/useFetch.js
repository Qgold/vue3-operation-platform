import { ref } from "vue";
export function useFetch() {
  const data = ref([
    { title: "首页" },
    { title: "AI Coding" },
    { title: "沸点" },
    { title: "课程" },
    { title: "直播" },
    { title: "活动" },
  ]);

  return {
    data: data,
  };
}
