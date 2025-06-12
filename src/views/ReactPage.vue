<script setup>
</script>
<template>
  <div class="react-page">
    <div class="card">
      <h2>React Fiber</h2>
      <p>
        React Fiber 是 React 16 引入的一种新的协调引擎。它的核心目标是提高渲染性能，支持时间分片（Time Slicing）和优先级更新。
      </p>
      <p>
        Fiber 是一种基于链表的数据结构，每个 Fiber 节点表示一个 React 元素。它的设计使得 React 可以将渲染工作分解为多个小任务，并在主线程空闲时逐步完成这些任务。
      </p>
      <p>
        <strong>Fiber 的数据结构：</strong>
      </p>
      <ul>
        <li>
          <strong>type：</strong> 表示当前节点的类型，例如函数组件、类组件、原生 DOM 节点等。
        </li>
        <li>
          <strong>key：</strong> 用于标识节点的唯一性，优化节点的复用。
        </li>
        <li>
          <strong>stateNode：</strong> 对于类组件，指向组件实例；对于 DOM 节点，指向真实的 DOM 元素。
        </li>
        <li>
          <strong>child：</strong> 指向第一个子节点。
        </li>
        <li>
          <strong>sibling：</strong> 指向下一个兄弟节点。
        </li>
        <li>
          <strong>return：</strong> 指向父节点。
        </li>
        <li>
          <strong>pendingProps：</strong> 表示即将应用到节点的属性。
        </li>
        <li>
          <strong>memoizedProps：</strong> 表示上一次渲染时的属性。
        </li>
        <li>
          <strong>alternate：</strong> 指向当前 Fiber 节点的上一次渲染对应的 Fiber 节点（双缓冲机制）。
        </li>
      </ul>
      <p>
        Fiber 的工作分为两个阶段：
      </p>
      <ul>
        <li>
          <strong>Reconciliation（协调阶段）：</strong> 在这个阶段，React 会比较当前 Fiber 树和更新后的 Fiber 树，找出需要更新的部分。
        </li>
        <li>
          <strong>Commit（提交阶段）：</strong> 在这个阶段，React 会将需要更新的部分应用到真实 DOM 上。
        </li>
      </ul>
      <p>
        时间分片的实现依赖于浏览器的 <code>requestIdleCallback</code> 或 <code>MessageChannel</code>，React 会在每一帧中检查是否有剩余时间来执行任务。
      </p>
    </div>

    <div class="card">
      <h2>Diff 算法</h2>
      <p>
        React 的 Diff 算法是一种启发式算法，用于高效地比较两棵虚拟 DOM 树的差异。它的核心思想是：
      </p>
      <ul>
        <li>
          <strong>同层比较：</strong> React 假设跨层级的节点移动很少发生，因此只比较同一层级的节点。
        </li>
        <li>
          <strong>唯一标识：</strong> 通过 <code>key</code> 属性标识节点，优化节点的复用。如果 <code>key</code> 不同，React 会认为是不同的节点。
        </li>
      </ul>
      <p>
        Diff 算法的具体步骤如下：
      </p>
      <ol>
        <li>
          比较两个节点的类型：如果类型不同，React 会直接删除旧节点并创建新节点。
        </li>
        <li>
          如果类型相同，React 会保留节点并更新其属性。
        </li>
        <li>
          对于子节点，React 会递归地进行比较。
        </li>
      </ol>
      <p>
        通过这些优化，React 的 Diff 算法的时间复杂度从 O(n^3) 降低到了 O(n)。
      </p>
    </div>

    <div class="card">
      <h2>虚拟 DOM</h2>
      <p>
        虚拟 DOM 是 React 的核心概念之一。它是对真实 DOM 的抽象表示，使用 JavaScript 对象来描述 DOM 结构。
      </p>
      <p>
        虚拟 DOM 的更新过程包括以下步骤：
      </p>
      <ol>
        <li>React 根据组件的状态和属性生成新的虚拟 DOM。</li>
        <li>React 使用 Diff 算法比较新旧虚拟 DOM 的差异。</li>
        <li>React 将差异应用到真实 DOM 上。</li>
      </ol>
      <p>
        虚拟 DOM 的优点包括性能优化和跨平台支持。
      </p>
    </div>

    <div class="card">
      <h2>Hooks</h2>
      <p>
        React Hooks 是 React 16.8 引入的特性，它允许在函数组件中使用状态和生命周期方法。
      </p>
      <p>
        常用的 Hooks 包括：
      </p>
      <ul>
        <li><code>useState</code>：管理组件的状态。</li>
        <li><code>useEffect</code>：处理副作用，如数据获取和订阅。</li>
        <li><code>useContext</code>：访问上下文数据。</li>
      </ul>
      <p>
        自定义 Hooks 允许开发者将逻辑复用封装到独立的函数中，从而提高代码的可读性和可维护性。
      </p>
    </div>

    <div class="card">
      <h2>组件化</h2>
      <p>
        React 的组件化开发模式是其核心优势之一。通过将 UI 分解为独立的、可复用的组件，开发者可以更高效地构建复杂的用户界面。
      </p>
      <p>
        组件分为：
      </p>
      <ul>
        <li>函数组件：使用函数定义的组件，推荐使用。</li>
        <li>类组件：使用类定义的组件，适用于需要更多功能的场景。</li>
      </ul>
      <p>
        组件之间可以通过 props 传递数据，通过 state 管理内部状态，通过 context 实现跨层级数据共享。
      </p>
    </div>
  </div>
</template>

<style scoped>
.react-page {
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start; /* 左对齐 */
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
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

ul,
ol {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  font-size: 16px;
  line-height: 1.5;
}
</style>

