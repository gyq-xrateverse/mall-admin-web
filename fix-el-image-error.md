# 修复 el-image 组件未找到错误

## 问题描述
控制台报错：
```
[Vue warn]: Unknown custom element: <el-image> - did you register the component correctly?
```

## 问题原因
项目使用的 Element UI 版本为 2.3.7，而 `el-image` 组件是在 Element UI 2.9.0 版本中才引入的。

## 解决方案
将 `el-image` 组件替换为普通 `<img>` 标签，并实现相应的预览和错误处理功能。

### 修改内容

#### 1. 列表页面：`src/views/case/data/index.vue`

**修改前：**
```vue
<el-image
  v-if="scope.row.image"
  style="width: 60px; height: 40px"
  :src="scope.row.image"
  :preview-src-list="[scope.row.image]"
  fit="cover"
  :lazy="true">
  <div slot="error" class="image-slot">
    <i class="el-icon-picture-outline"></i>
  </div>
</el-image>
```

**修改后：**
```vue
<img
  v-if="scope.row.image"
  style="width: 60px; height: 40px; object-fit: cover; cursor: pointer"
  :src="scope.row.image"
  @click="previewImage(scope.row.image)"
  @error="handleImageError($event)"
  :alt="scope.row.title" />
```

#### 2. 详情页面：`src/views/case/data/detail.vue`

**封面图片修改前：**
```vue
<el-image
  style="width: 300px; height: 200px"
  :src="caseData.image"
  :preview-src-list="[caseData.image]"
  fit="cover">
  <div slot="error" class="image-slot">
    <i class="el-icon-picture-outline"></i>
  </div>
</el-image>
```

**封面图片修改后：**
```vue
<img
  style="width: 300px; height: 200px; object-fit: cover; cursor: pointer"
  :src="caseData.image"
  @click="previewImage(caseData.image)"
  @error="handleImageError($event)"
  :alt="caseData.title" />
```

**相关案例图片修改前：**
```vue
<el-image
  style="width: 120px; height: 80px"
  :src="item.image"
  fit="cover">
  <div slot="error" class="image-slot">
    <i class="el-icon-picture-outline"></i>
  </div>
</el-image>
```

**相关案例图片修改后：**
```vue
<img
  style="width: 120px; height: 80px; object-fit: cover"
  :src="item.image"
  @error="handleImageError($event)"
  :alt="item.title" />
```

### 新增方法

#### 两个页面都添加了以下方法：

```javascript
previewImage(imageUrl) {
  // 使用Element UI的Dialog实现图片预览
  this.$alert(`<img src="${imageUrl}" style="max-width: 100%; max-height: 500px;"/>`, '图片预览', {
    dangerouslyUseHTMLString: true,
    showCancelButton: false,
    showConfirmButton: false,
    customClass: 'image-preview-dialog'
  });
},
handleImageError(event) {
  // 图片加载失败时显示默认图标
  event.target.style.display = 'none';
  const errorDiv = document.createElement('div');
  errorDiv.className = 'image-slot';
  errorDiv.innerHTML = '<i class="el-icon-picture-outline"></i>';
  errorDiv.style.cssText = 'width: 60px; height: 40px; display: flex; justify-content: center; align-items: center; background: #f5f7fa; color: #909399; font-size: 20px;';
  event.target.parentNode.appendChild(errorDiv);
}
```

## 效果
- ✅ 消除控制台警告错误
- ✅ 保持原有的图片显示功能
- ✅ 实现点击预览功能（使用Alert弹窗）
- ✅ 保持图片加载失败时的错误提示
- ✅ 兼容 Element UI 2.3.7 版本

## 版本信息
- Element UI: 2.3.7
- Vue: 2.7.2
- `el-image` 组件最低要求: Element UI 2.9.0+