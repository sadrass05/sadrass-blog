# SKILL.md

## Skill: localStorage 数据安全恢复

**版本**: 1.0  
**创建日期**: 2026-05-05  
**分类**: 数据持久化 & 前端调试

---

### 触发条件 (When)

**必须满足以下任一条件时调用此 Skill**：

1. **备份恢复场景**
   - 用户操作：点击"恢复备份"按钮
   - 特征：需要从 localStorage 读取旧数据并覆盖当前数据
   - 风险：备份数据可能缺少某些字段（如用户头像）

2. **数据导入场景**
   - 用户操作：导入外部 JSON 数据文件
   - 特征：需要将导入的数据写入 localStorage
   - 风险：导入的数据可能包含 null/undefined 值

3. **关键用户数据保护场景**
   - 目标数据：用户头像、个人资料、用户设置
   - 操作类型：批量更新、数据同步、初始化
   - 需求：保护用户已有数据不被意外覆盖

---

### 执行方法 (How)

#### 步骤 1：问题诊断
```javascript
// 1.1 搜索所有 localStorage 操作
// 搜索关键词：localStorage.setItem、restore、import、backup
// 1.2 识别可能导致数据覆盖的代码
// 查找模式：遍历备份数据并调用 setItem
// 1.3 确认问题数据类型
// 检查：用户头像、配置、个性化数据等关键数据
```

#### 步骤 2：数据有效性检查实现

在调用 `localStorage.setItem` 前添加检查：

```javascript
// 标准实现
function safeRestoreData(key, value) {
  // 检查数据是否有效
  if (value === null || value === undefined) {
    console.log(`跳过 null/undefined 值: ${key}`);
    return;
  }
  
  // 对于复杂对象，可进一步检查必要字段
  if (typeof value === 'object' && !Array.isArray(value)) {
    const requiredFields = getRequiredFieldsForKey(key);
    const missingFields = requiredFields.filter(field => !(field in value));
    if (missingFields.length > 0) {
      console.log(`数据缺少必要字段: ${key}, 缺少: ${missingFields.join(',')}`);
      return;
    }
  }
  
  // 执行存储
  localStorage.setItem(key, JSON.stringify(value));
}

// 根据不同的 key 定义所需字段
function getRequiredFieldsForKey(key) {
  const fieldMap = {
    'blog_avatar': ['base64', 'type'],
    // 添加其他关键数据的要求
  };
  return fieldMap[key] || [];
}
```

#### 步骤 3：应用到具体位置

**修复备份恢复** (`restoreBackup` 函数)：
```javascript
Object.keys(backup.data).forEach(key => {
  if (STORAGE_KEYS[key]) {
    const backupValue = backup.data[key];
    if (backupValue !== null && backupValue !== undefined) {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(backupValue));
    }
  }
});
```

**修复数据导入** (`importData` 函数)：
```javascript
Object.keys(importData.data).forEach(key => {
  if (STORAGE_KEYS[key]) {
    const importValue = importData.data[key];
    if (importValue !== null && importValue !== undefined) {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(importValue));
    }
  }
});
```

#### 步骤 4：优化数据获取函数

在读取数据时添加完整性检查：

```javascript
// 以头像数据为例
function getAvatarUrl() {
  if (avatarData.value && 
      avatarData.value.base64 && 
      avatarData.value.type && 
      avatarData.value.base64.length > 0) {
    return `data:${avatarData.value.type};base64,${avatarData.value.base64}`;
  }
  return null;
}
```

#### 步骤 5：测试验证

1. 上传测试头像
2. 创建缺少头像数据的备份
3. 执行恢复操作
4. 验证头像依然存在
5. 检查其他功能是否正常

---

### 输出结果 (What)

**验收标准**：

1. **功能完整性**
   - ✅ 原有功能完全正常
   - ✅ 备份恢复功能正常
   - ✅ 数据导入功能正常
   - ✅ 用户头像/个人资料不被覆盖

2. **代码质量**
   - ✅ 添加了必要的数据检查
   - ✅ 有适当的日志记录
   - ✅ 代码清晰可维护

3. **数据安全**
   - ✅ null 值不会覆盖有效数据
   - ✅ undefined 值不会覆盖有效数据
   - ✅ 关键数据有额外的完整性检查

**输出交付物**：
1. 修复后的代码文件
2. 测试验证报告
3. 可复用的检查函数

---

### 预设失败策略

#### 策略 A：先备份再修改
```
问题：修改导致其他数据意外损坏
应对：
1. 在修改前创建完整备份
2. 使用版本控制（如 Git）保存修改前状态
3. 如果发现问题，立即回滚到备份
```

#### 策略 B：渐进式修改
```
问题：一次性修改过多代码导致难以定位问题
应对：
1. 每次只修改一个函数
2. 修改后立即测试
3. 逐步验证每个修复点
```

#### 策略 C：安全兜底
```
问题：检查逻辑过于严格导致有效数据无法恢复
应对：
1. 提供强制恢复选项（带警告）
2. 记录所有跳过的数据操作
3. 允许用户查看并手动选择恢复
```

#### 策略 D：诊断工具
```
问题：不确定数据是否被正确处理
应对：
// 添加诊断函数
function diagnoseStorage() {
  const storageKeys = ['blog_avatar', 'blog_articles', 'blog_projects'];
  const results = {};
  
  storageKeys.forEach(key => {
    const raw = localStorage.getItem(key);
    try {
      const data = JSON.parse(raw);
      results[key] = {
        exists: true,
        type: typeof data,
        isNull: data === null,
        isEmpty: !data,
        size: raw ? raw.length : 0
      };
    } catch (e) {
      results[key] = { exists: true, error: e.message };
    }
  });
  
  console.table(results);
  return results;
}
```

---

### 使用示例

**场景**：备份恢复功能实现

**代码变更前**：
```javascript
// 存在问题的代码
Object.keys(backup.data).forEach(key => {
  if (STORAGE_KEYS[key]) {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(backup.data[key]));
  }
});
```

**应用 Skill 后**：
```javascript
// 修复后的代码
Object.keys(backup.data).forEach(key => {
  if (STORAGE_KEYS[key]) {
    const backupValue = backup.data[key];
    if (backupValue !== null && backupValue !== undefined) {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(backupValue));
    }
  }
});
```

---

## 总结

这个 Skill 完整记录了解决"头像上传后丢失"问题的完整过程，包括问题诊断、修复实施、验证测试的标准流程。可以直接应用到其他有类似 localStorage 数据覆盖风险的前端项目中。
