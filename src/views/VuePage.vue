<template>
  <div class="vue-page">
    <div class="card">
      <h2>Vue3 响应式原理</h2>
      <p>
        Vue3 的响应式系统基于 ES6 的 <code>Proxy</code> 实现。它通过拦截对象的读取和设置操作，实现对数据变化的监听。
      </p>
      <p>
        <strong>核心概念：</strong>
      </p>
      <ul>
        <li>
          <strong>Reactive：</strong> 使用 <code>reactive</code> 函数将普通对象转换为响应式对象。
        </li>
        <li>
          <strong>Ref：</strong> 使用 <code>ref</code> 函数创建一个包含单一值的响应式对象。
        </li>
        <li>
          <strong>Effect：</strong> 定义副作用函数，当响应式数据变化时自动执行。
        </li>
      </ul>
      <p>
        响应式系统的核心是依赖收集和触发更新。当访问响应式数据时，Vue 会记录依赖该数据的副作用函数；当数据变化时，Vue 会重新执行这些函数。
      </p>
    </div>

    <div class="card">
      <h2>Composition API</h2>
      <p>
        Vue3 引入了 Composition API，提供了一种更灵活的方式来组织组件逻辑。它的核心是 <code>setup</code> 函数。
      </p>
      <p>
        <strong>主要功能：</strong>
      </p>
      <ul>
        <li>
          <strong>逻辑复用：</strong> 使用组合函数（Composable）将逻辑封装到独立的函数中。
        </li>
        <li>
          <strong>更清晰的逻辑组织：</strong> 将相关逻辑集中在一起，而不是分散在生命周期钩子中。
        </li>
      </ul>
      <p>
        Composition API 使得大型组件的代码更易于维护和复用。
      </p>
    </div>

    <div class="card">
      <h2>虚拟 DOM 与 Diff 算法</h2>
      <p>
        Vue3 使用虚拟 DOM 来描述组件的 UI 结构，并通过 Diff 算法高效地更新真实 DOM。
      </p>
      <p>
        <strong>Diff 算法的优化：</strong>
      </p>
      <ul>
        <li>
          同层比较：只比较同一层级的节点，避免跨层级的复杂计算。
        </li>
        <li>
          Key 的使用：通过 <code>key</code> 属性标识节点，优化节点的复用。
        </li>
      </ul>
      <p>
        虚拟 DOM 的优点是性能优化和跨平台支持。
      </p>
    </div>

    <div class="card">
      <h2>Vue Router</h2>
      <p>
        Vue Router 是 Vue 的官方路由管理器，用于构建单页面应用（SPA）。
      </p>
      <p>
        <strong>核心功能：</strong>
      </p>
      <ul>
        <li>
          动态路由匹配：支持基于参数的动态路由。
        </li>
        <li>
          路由守卫：提供导航守卫来控制路由的访问权限。
        </li>
        <li>
          懒加载：通过按需加载组件优化性能。
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.vue-page {
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

h2 {
  font-size: 20px;
  margin-top: 0;
  color: #333;
}

p {
  font-size: 16px;
  line-height: 1.5;
  margin: 10px 0;
}

ul {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  font-size: 16px;
  line-height: 1.5;
}
</style>