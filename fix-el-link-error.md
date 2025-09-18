# 修复 el-link 组件未找到错误

## 问题描述
控制台报错：
```
[Vue warn]: Unknown custom element: <el-link> - did you register the component correctly?
```

## 问题原因
项目使用的 Element UI 版本为 2.3.7，而 `el-link` 组件是在 Element UI 2.4.11 版本中才引入的。

## 解决方案
将 `el-link` 组件替换为 `el-button` 的 text 类型，保持相同的视觉效果和功能。

### 修改内容
**文件：** `src/views/case/data/index.vue`

**修改前：**
```vue
<el-link type="primary" @click="handleViewDetail(scope.row)">
  {{scope.row.title}}
</el-link>
```

**修改后：**
```vue
<el-button type="text" @click="handleViewDetail(scope.row)" style="color: #409EFF;">
  {{scope.row.title}}
</el-button>
```

## 效果
- ✅ 消除控制台警告错误
- ✅ 保持原有的点击功能
- ✅ 保持蓝色链接样式（#409EFF 是 Element UI 的主色调）
- ✅ 兼容 Element UI 2.3.7 版本

## 其他注意事项
如果项目中还有其他地方使用了 `el-link` 组件，也需要进行相同的替换。

## 版本信息
- Element UI: 2.3.7
- Vue: 2.7.2
- `el-link` 组件最低要求: Element UI 2.4.11+