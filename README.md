# Vue 3 + Vite

这是一个基于 vue3全家桶（vue-route、pina） 加 vite搭建的脚手架；

## 基础技术栈

- 基础核心 ： vue
- 路由方案 ： vue-router
- 全局管理 ： pinia
- 打包工具 ： vite
- 样式处理 ： scss、 tailwindcss、 nprogress、
- 网络方案 ： axios
- 工具方案 ： mitt(订阅发布通信管理)、dayjs(日期格式化)、vueuse(hooks 工具)、unplugin-auto-import(自动导入插件)，prettier（代码格式化）、jsdoc（代码注释工具和标准）、file-saver（客户端文件保存）

## 前端运行

```bash
# 安装依赖
yarn
```

```bash
# 运行
yarn dev

# 构建测试环境 yarn build:stage
# 构建预发生产环境 yarn build:prod
# 前端访问地址 http://localhost:3000
```

## 内置功能

1. 内置 jsdoc 工具方便将方法或者函数生成文档，也能有良好的代码提示，运行 `yarn jsdoc`；
2.

## 规范
1. 字符串`单引号`
2. 空判断 `??`
3. [jsdoc](https://www.jsdoc.com.cn/tags) 替代 TS


## 新特性 （为什么是 `vue3.4`？）

1. `defineModel` API 的稳定化及功能

   - 在之前的版本中作为实验性功能引入的 `defineModel`，在 Vue 3.4 中正式成为稳定特性。这个 API 主要用于简化支持 `v-model` 的组件实现，并在最新版本中增加了对 `v-model` 修饰符的支持。例如，你可以使用 `defineModel` 来创建一个响应式的输入组件，这个组件能够处理数字类型的 `v-model`：

   ```vue
   <script setup>
   const [modelValue, modelModifiers] = defineModel({
     get() {
       /* 获取值 */
     },
     set(value) {
       if (modelModifiers.number) {
         return Number(value);
       }
       return value;
     },
   });
   </script>
   ```

2. `v-bind` 的同名简写功能

   - Vue 3.4 引入了 `v-bind` 的同名简写功能，使得开发者在模板中绑定属性时可以省略重复的变量名。当属性名和绑定的变量名相同时，可以直接使用属性名，从而使模板更加简洁。例如，对于一个需要绑定多个属性的组件，传统的写法和新的简写方法对比如下：

   ```vue
   <!-- 传统方式 -->
   <my-component :title="title" :content="content"></my-component>

   <!-- 使用 v-bind 同名简写 -->
   <my-component :title :content></my-component>
   ```

3. `watch` 新增 `once` 选项
   - Vue 3.4 为 watch 函数增加了 once 选项，这使得观察者在第一次检测到变化时就会停止，非常适用于只需响应一次数据变化的场景。这个新选项提供了一种简洁的方式来防止重复触发。例如，你可以使用 once 来观察一个状态值的变化，并在它第一次改变时执行某个操作：
   ```vue
   watch(someRef, () => { // 这个函数只会在 someRef 第一次变化时执行 }, { once:
   true });
   ```
4. 对 MathML 的支持
   - Vue 3.4 对 MathML 的支持意味着开发者现在可以在 Vue 应用中直接使用 MathML 来呈现数学公式和符号。MathML 是一种标记语言，用于描述数学公式的结构和内容。这一功能的加入使得 Vue 适用于更广泛的应用场景，特别是在需要展示复杂数学内容的教育和科学出版领域。以下是一个 MathML 示例，展示了如何在 Vue 模板中渲染 x²：
   ```vue
   <template>
     <div>
       MathML数学公式：
       <math>
         <mrow>
           <msup>
             <mi>x</mi>
             <mn>2</mn>
           </msup>
         </mrow>
       </math>
     </div>
   </template>
   ```
