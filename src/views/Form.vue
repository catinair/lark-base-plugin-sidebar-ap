<!--
 * @Version    : v1.00
 * @Author     : itchaox
 * @Date       : 2023-09-26 15:10
 * @LastAuthor : Wang Chao
 * @LastTime   : 2025-02-27 06:39
 * @desc       : 主要页面
-->
<script setup>
import { ref, onMounted, watch, watchEffect } from 'vue';
import { bitable } from '@lark-base-open/js-sdk';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue'

const { t } = useI18n();

// Token相关
const aiPowerToken = ref('');
const loading = ref(false);

// 数据表相关
const databaseList = ref();
const databaseId = ref();
const viewList = ref();
const viewId = ref();
const fieldList = ref();
const fieldId = ref();
const selectedWorkflow = ref('');

const base = bitable.base;
const currentFieldId = ref();
const recordId = ref();
const currentValue = ref();

// 添加字段相关的响应式变量
const tableFields = ref([]); // 存储完整的字段信息
const selectedFields = ref([]); // 用于存储选中的字段

// 添加字段类型映射表
const fieldTypeMap = {
  1: '多行文本',
  2: '数字',
  3: '单选',
  4: '多选',
  5: '日期',
  7: '复选框',
  11: '人员',
  15: '附件',
  17: '超链接',
  18: '创建时间',
  19: '修改时间',
  20: '创建人',
  21: '修改人',
  22: '公式',
  23: '查找引用',
  24: '自动编号',
  25: '条码',
  26: '评分',
  27: '进度',
  28: '货币',
  29: '电话号码',
  30: '邮箱',
  31: '位置',
  32: '关联表',
  33: '分组',
  34: '按钮',
  35: '工作流状态'
};

// 添加获取字段类型名称的方法
const getFieldTypeName = (type) => {
  return fieldTypeMap[type] || `未知类型(${type})`;
};

// 添加工作流相关的响应式变量
const workflows = ref([]);  // 工作流列表
const workflowParams = ref(null);  // 工作流参数信息
const workflowLoading = ref(false);  // 加载状态

// 添加参数映射相关的响应式变量
const paramMappings = ref({
  inputs: [],   // 输入参数映射
  outputs: []   // 输出参数映射
});

// 添加执行相关的响应式变量
const executionStatus = ref({
  running: false,
  progress: 0,
  total: 0,
  current: 0,
  results: [],
  error: null
});

// 添加折叠控制的响应式变量
const paramsCollapsed = ref(true);  // 参数信息默认收起
const fieldsCollapsed = ref(true);  // 字段信息默认收起

// 切换折叠状态的方法
const toggleParams = () => {
  paramsCollapsed.value = !paramsCollapsed.value;
};

const toggleFields = () => {
  fieldsCollapsed.value = !fieldsCollapsed.value;
};

// 封装API请求函数
const api = {
  // 获取工作流列表
  async getWorkflows() {
    const token = localStorage.getItem('aiPowerToken');
    if (!token) {
      ElMessage.warning('请先填写并保存AI Power Token');
      return [];
    }
    
    try {
      const response = await fetch('https://power-api.yingdao.com/oapi/power/v1/flow/page?page=1&size=100', {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        throw new Error(data.msg || '获取工作流列表失败');
      }
    } catch (error) {
      console.error('获取工作流列表失败:', error);
      ElMessage.error(error.message);
      return [];
    }
  },

  // 获取工作流详情
  async getWorkflowDetail(flowUuid) {
    const token = localStorage.getItem('aiPowerToken');
    if (!token || !flowUuid) return null;
    
    try {
      const response = await fetch(`https://power-api.yingdao.com/oapi/power/v1/flow/detail?flowUuid=${flowUuid}`, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.msg || '获取工作流详情失败');
      }
    } catch (error) {
      console.error('获取工作流详情失败:', error);
      ElMessage.error(error.message);
      return null;
    }
  }
};

// 加载工作流列表
async function loadWorkflows() {
  workflowLoading.value = true;
  try {
    workflows.value = await api.getWorkflows();
    if (workflows.value.length > 0) {
      ElMessage.success('获取工作流列表成功');
    }
  } finally {
    workflowLoading.value = false;
  }
}

// 初始化参数映射
function initParamMappings(params) {
  if (!params) return;
  
  // 初始化输入参数映射
  paramMappings.value.inputs = params.inputs.map(input => ({
    paramName: input.name,
    paramLabel: input.label,
    paramType: input.type,
    fieldId: '',  // 选中的字段ID
    required: true // 输入参数必填
  }));
  
  // 初始化输出参数映射
  paramMappings.value.outputs = params.outputs.map(output => ({
    paramName: output.name,
    paramLabel: output.label,
    paramType: output.type,
    fieldId: '',  // 选中的字段ID
    required: false // 输出参数可选
  }));
}

// 修改工作流选择的watch
watch(selectedWorkflow, async (newValue) => {
  if (!newValue) {
    workflowParams.value = null;
    paramMappings.value = { inputs: [], outputs: [] };
    return;
  }
  
  workflowLoading.value = true;
  try {
    workflowParams.value = await api.getWorkflowDetail(newValue);
    if (workflowParams.value) {
      initParamMappings(workflowParams.value);
      console.log('参数映射初始化:', paramMappings.value);
    }
  } finally {
    workflowLoading.value = false;
  }
});

// Token保存成功后自动加载工作流列表
const saveToken = async () => {
  if (!aiPowerToken.value) {
    ElMessage.warning('请输入AI Power Token');
    return;
  }
  
  loading.value = true;
  try {
    localStorage.setItem('aiPowerToken', aiPowerToken.value);
    ElMessage.success('Token保存成功');
    await loadWorkflows(); // 保存成功后加载工作流列表
  } catch (error) {
    console.error('保存Token失败:', error);
    ElMessage.error('保存失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 数据表切换
async function databaseChange() {
  try {
    loading.value = true;
    const table = await base.getTable(databaseId.value);
    viewList.value = await table.getViewMetaList();
    viewId.value = viewList.value[0]?.id;
  
    const fields = await table.getFieldMetaList();
    tableFields.value = fields.map(field => ({
      ...field,
      typeText: getFieldTypeName(field.type)
    }));
    
    console.log('表格字段信息：', tableFields.value);
    
    ElMessage.success('获取表格数据成功');
  } catch (error) {
    console.error('获取表格数据失败:', error);
    ElMessage.error('获取表格数据失败');
  } finally {
    loading.value = false;
  }
}

// 添加获取字段详细信息的方法
async function getFieldDetails(fieldId) {
  try {
    const table = await base.getTable(databaseId.value);
    const fieldMeta = await table.getFieldById(fieldId);
    return fieldMeta;
  } catch (error) {
    console.error('获取字段详情失败:', error);
    return null;
  }
}

// 监听视图变化时更新字段列表
watch(viewId, async (newValue) => {
  if (!newValue) return;
  try {
    const table = await base.getTable(databaseId.value);
    const view = await table.getViewById(newValue);
    const fields = await view.getFieldMetaList();
    
    // 转换字段类型为中文
    tableFields.value = fields.map(field => ({
      ...field,
      typeText: getFieldTypeName(field.type)
    }));
    
    fieldList.value = fields.filter(field => {
      return true; // 暂时返回所有字段
    });
  } catch (error) {
    console.error('获取字段列表失败:', error);
    ElMessage.error('获取字段列表失败');
  }
});

// 监听数据表变化
watchEffect(async () => {
  if (!databaseId.value) return;
  const table = await base.getTable(databaseId.value);
  viewList.value = await table.getViewMetaList();
});

// 选择变化监听
base.onSelectionChange(async (event) => {
  currentFieldId.value = event.data.fieldId;
  recordId.value = event.data.recordId;
  databaseId.value = event.data.tableId;
  viewId.value = event.data.viewId;

  const table = await base.getActiveTable();
  if (currentFieldId.value && recordId.value) {
    let data = await table.getCellValue(currentFieldId.value, recordId.value);
    if (data && data[0].text !== currentValue.value) {
      currentValue.value = data[0].text;
    }
  }
});

// 检查参数类型与字段类型是否匹配
function isFieldTypeCompatible(paramType, fieldType) {
  // 根据参数类型和字段类型判断是否兼容
  const compatibilityMap = {
    'TEXT': [1], // 文本类型参数可以映射到多行文本字段
    'IMAGE': [15], // 图片类型参数可以映射到附件字段
    'FILE': [15], // 文件类型参数可以映射到附件字段
    'VIDEO': [15], // 视频类型参数可以映射到附件字段
    'AUDIO': [15]  // 音频类型参数可以映射到附件字段
  };
  
  return compatibilityMap[paramType]?.includes(fieldType) || false;
}

// 获取可用于映射的字段列表
function getCompatibleFields(paramType) {
  if (!tableFields.value) return [];
  
  return tableFields.value.filter(field => 
    isFieldTypeCompatible(paramType, field.type)
  );
}

// 验证映射配置
function validateMappings() {
  // 检查必填的输入参数是否都已映射
  const missingInputs = paramMappings.value.inputs.filter(
    input => input.required && !input.fieldId
  );
  
  if (missingInputs.length > 0) {
    const missingFields = missingInputs.map(input => input.paramLabel).join(', ');
    ElMessage.warning(`请为以下输入参数选择映射字段: ${missingFields}`);
    return false;
  }
  
  return true;
}

// 修改获取表格数据的函数
async function getTableRecords() {
  try {
    const table = await base.getTable(databaseId.value);
    if (!table) {
      throw new Error('未选择数据表');
    }
    
    console.log('开始获取记录...');
    // 获取当前视图的记录
    const { records } = await table.getRecords({
      viewId: viewId.value
    });
    
    console.log('获取到记录数量:', records?.length);
    console.log('记录示例:', records[0]);
    return records;
  } catch (error) {
    console.error('获取表格数据失败:', error);
    throw error;
  }
}

// 修改获取字段值的函数
async function getFieldValue(recordId, fieldId) {
  try {
    console.log(`获取字段值 - recordId: ${recordId}, fieldId: ${fieldId}`);
    const table = await base.getTable(databaseId.value);
    const field = await table.getFieldById(fieldId);
    const value = await field.getValue(recordId);
    
    console.log('原始字段值:', value);
    
    // 处理不同类型的值
    let processedValue = '';
    if (Array.isArray(value)) {
      processedValue = value.map(v => v.text || v.name || v).join(',');
    } else if (typeof value === 'object' && value !== null) {
      processedValue = value.text || value.name || JSON.stringify(value);
    } else {
      processedValue = String(value || '');
    }
    
    console.log('处理后的字段值:', processedValue);
    return processedValue;
  } catch (error) {
    console.error('获取字段值失败:', error);
    throw new Error(`获取字段值失败: ${error.message}`);
  }
}

// 修改执行单条记录的工作流函数
async function executeWorkflowForRecord(record) {
  try {
    console.log('开始执行记录:', record);
    const token = localStorage.getItem('aiPowerToken');
    if (!token) throw new Error('未找到Token');

    // 准备输入参数
    const input = {};
    for (const mapping of paramMappings.value.inputs) {
      if (!mapping.fieldId) continue;
      const value = await getFieldValue(record.recordId, mapping.fieldId);
      input[mapping.paramName] = value;
    }

    console.log('工作流输入参数:', input);

    // 调用异步执行API
    const response = await fetch(
      `https://power-api.yingdao.com/oapi/power/v1/rest/flow/${selectedWorkflow.value}/execute/async`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ input })
      }
    );

    const data = await response.json();
    console.log('API响应:', data);

    if (!data.success) {
      throw new Error(data.msg || '执行失败');
    }

    return data.data.runRecordId;
  } catch (error) {
    console.error('执行工作流失败:', error);
    throw error;
  }
}

// 获取执行结果
async function getExecutionResult(runRecordId) {
  const token = localStorage.getItem('aiPowerToken');
  if (!token) throw new Error('未找到Token');

  let retries = 0;
  const maxRetries = 30; // 最大重试次数
  const retryInterval = 2000; // 重试间隔(毫秒)

  while (retries < maxRetries) {
    try {
      const response = await fetch(
        `https://power-api.yingdao.com/oapi/power/v1/rest/flow/execute/result?runRecordId=${runRecordId}`,
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.msg || '获取结果失败');
      }

      if (data.data.status === 'success') {
        return data.data.result;
      } else if (data.data.status === 'failed') {
        throw new Error(data.data.failReason || '执行失败');
      }

      // 如果还在执行中，等待后重试
      await new Promise(resolve => setTimeout(resolve, retryInterval));
      retries++;
    } catch (error) {
      console.error('获取执行结果失败:', error);
      throw new Error(`获取执行结果失败: ${error.message}`);
    }
  }

  throw new Error('执行超时');
}

// 修改更新字段值的函数
async function updateFieldValue(recordId, fieldId, value) {
  try {
    const table = await base.getTable(databaseId.value);
    const field = await table.getFieldById(fieldId);
    await field.setValue(recordId, value);
  } catch (error) {
    console.error('更新字段值失败:', error);
    throw new Error('更新字段值失败');
  }
}

// 修改执行工作流主函数
async function executeWorkflow() {
  if (!databaseId.value) {
    ElMessage.warning('请先选择数据表');
    return;
  }

  if (!selectedWorkflow.value) {
    ElMessage.warning('请先选择工作流');
    return;
  }

  if (!validateMappings()) return;

  try {
    console.log('开始执行工作流...');
    // 初始化执行状态
    executionStatus.value = {
      running: true,
      progress: 0,
      total: 0,
      current: 0,
      results: [],
      error: null
    };

    // 获取所有记录
    const records = await getTableRecords();
    if (!records || records.length === 0) {
      throw new Error('未找到可处理的记录');
    }

    executionStatus.value.total = records.length;
    console.log(`准备处理 ${records.length} 条记录`);

    // 批量处理记录
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      executionStatus.value.current = i + 1;
      executionStatus.value.progress = Math.round((i + 1) * 100 / records.length);

      try {
        console.log(`处理第 ${i + 1} 条记录:`, record);
        // 执行工作流
        const runRecordId = await executeWorkflowForRecord(record);
        console.log('获取到runRecordId:', runRecordId);
        
        // 获取执行结果
        const result = await getExecutionResult(runRecordId);
        console.log('执行结果:', result);

        // 更新输出字段
        for (const mapping of paramMappings.value.outputs) {
          if (mapping.fieldId && result[mapping.paramName]) {
            await updateFieldValue(record.recordId, mapping.fieldId, result[mapping.paramName]);
          }
        }

        executionStatus.value.results.push({
          recordId: record.recordId,
          status: 'success'
        });
      } catch (error) {
        console.error(`处理记录 ${record.recordId} 失败:`, error);
        executionStatus.value.results.push({
          recordId: record.recordId,
          status: 'error',
          error: error.message
        });
      }
    }

    ElMessage.success('工作流执行完成');
  } catch (error) {
    console.error('执行工作流失败:', error);
    executionStatus.value.error = error.message;
    ElMessage.error(error.message);
  } finally {
    executionStatus.value.running = false;
  }
}

onMounted(async () => {
  try {
    // 获取数据表列表
    databaseList.value = await base.getTableMetaList();
    
    // 如果有数据表，自动选择第一个有货币字段的表
    if (databaseList.value?.length) {
      for (const table of databaseList.value) {
        const currencyFields = await table.getFieldMetaListByType<ICurrencyFieldMeta>(FieldType.Currency);
        if (currencyFields.length > 0) {
          databaseId.value = table.id;
          await databaseChange();
          break;
        }
      }
      
      // 如果没有找到合适的表，使用第一个表
      if (!databaseId.value) {
        databaseId.value = databaseList.value[0].id;
        await databaseChange();
      }
    }
    
    // 加载保存的Token
    const savedToken = localStorage.getItem('aiPowerToken');
    if (savedToken) {
      aiPowerToken.value = savedToken;
      await loadWorkflows();
    }
  } catch (error) {
    console.error('初始化失败:', error);
    ElMessage.error('初始化失败，请刷新重试');
  }
});
</script>

<template>
  <div class="form-container">
    <!-- 第一区域: Token配置 -->
    <div class="section-card">
      <div class="section-title">
        <span>影刀AI Power Token</span>
        <el-link 
          type="primary" 
          :underline="false" 
          href="https://ying-dao.feishu.cn/wiki/ONjywYIVtia98DkqsCzclWV9n3a" 
          target="_blank"
        >
          点击获取
        </el-link>
      </div>
      <div class="section-content">
        <div class="input-with-button">
          <el-input 
            v-model="aiPowerToken" 
            placeholder="请输入AI Power Token" 
            :disabled="loading"
            type="password"
            show-password
          />
          <el-button 
            type="primary" 
            @click="saveToken" 
            :loading="loading"
          >
            保存
          </el-button>
        </div>
      </div>
    </div>

    <!-- 第二区域: 数据表和工作流配置 -->
    <div class="section-card">
      <div class="section-title">数据源与工作流配置</div>
      <div class="section-content">
        <!-- 数据表选择 -->
        <div class="subsection">
          <div class="subsection-title">数据表</div>
          <div class="input-with-button">
            <el-select 
              v-model="databaseId"
              placeholder="请选择数据表"
              @change="databaseChange"
              style="flex: 1;"
            >
              <el-option
                v-for="item in databaseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-button 
              type="primary" 
              @click="databaseChange" 
              :loading="loading"
            >
              获取
            </el-button>
          </div>
          
          <!-- 视图选择 -->
          <div class="view-select" v-if="databaseId">
            <span class="label-text">{{ t('label.view') }}</span>
            <el-select
              v-model="viewId"
              :placeholder="t('placeholder.view')"
              style="flex: 1;"
            >
              <el-option
                v-for="item in viewList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>

          <!-- 字段信息(可折叠) -->
          <div v-if="tableFields.length" class="collapsible-section">
            <div class="section-header" @click="toggleFields" style="cursor: pointer;">
              <div class="header-left">
                <span>字段信息</span>
                <el-tag size="small" type="info" class="count-tag">
                  共 {{ tableFields.length }} 个字段
                </el-tag>
              </div>
              <el-icon class="collapse-icon" :class="{ 'is-collapsed': fieldsCollapsed }">
                <ArrowDown />
              </el-icon>
            </div>
            <div v-show="!fieldsCollapsed" class="collapse-content">
              <el-table :data="tableFields" style="width: 100%">
                <el-table-column prop="name" label="字段名称" />
                <el-table-column prop="typeText" label="字段类型" />
              </el-table>
            </div>
          </div>
        </div>

        <!-- 工作流选择 -->
        <div class="subsection">
          <div class="subsection-title">影刀AI Power工作流</div>
          <div class="input-with-button">
            <el-select 
              v-model="selectedWorkflow" 
              placeholder="请选择工作流"
              :loading="workflowLoading"
              :disabled="!aiPowerToken || workflowLoading"
              style="flex: 1;"
            >
              <el-option
                v-for="item in workflows"
                :key="item.flowUuid"
                :label="item.name"
                :value="item.flowUuid"
              />
            </el-select>
            <el-button 
              type="primary" 
              :disabled="!aiPowerToken"
              :loading="workflowLoading"
              @click="loadWorkflows"
            >
              刷新
            </el-button>
          </div>

          <!-- 工作流参数信息(可折叠) -->
          <div v-if="workflowParams" class="collapsible-section">
            <div class="section-header" @click="toggleParams" style="cursor: pointer;">
              <div class="header-left">
                <span>工作流参数信息</span>
                <el-tag size="small" type="info" class="count-tag">
                  输入:{{ workflowParams.inputs.length }} 输出:{{ workflowParams.outputs.length }}
                </el-tag>
              </div>
              <el-icon class="collapse-icon" :class="{ 'is-collapsed': paramsCollapsed }">
                <ArrowDown />
              </el-icon>
            </div>
            <div class="collapse-content" v-show="!paramsCollapsed">
              <div class="param-group">
                <h4>输入参数:</h4>
                <el-table :data="workflowParams.inputs" style="width: 100%">
                  <el-table-column prop="label" label="参数名称" />
                  <el-table-column prop="type" label="参数类型" />
                  <el-table-column prop="name" label="参数标识" />
                </el-table>
              </div>
              <div class="param-group">
                <h4>输出参数:</h4>
                <el-table :data="workflowParams.outputs" style="width: 100%">
                  <el-table-column prop="label" label="参数名称" />
                  <el-table-column prop="type" label="参数类型" />
                  <el-table-column prop="name" label="参数标识" />
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第三区域: 参数映射配置 -->
    <div class="section-card" v-if="workflowParams">
      <div class="section-title">参数映射配置</div>
      <div class="section-content">
        <!-- 输入参数映射 -->
        <div class="mapping-group">
          <h4>输入参数映射 (必填)</h4>
          <el-table :data="paramMappings.inputs" style="width: 100%">
            <el-table-column prop="paramLabel" label="AI参数" width="180">
              <template #default="{ row }">
                <div class="param-info">
                  <span>{{ row.paramLabel }}</span>
                  <el-tag size="small" type="info">{{ row.paramType }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="表格字段" width="280">
              <template #default="{ row }">
                <el-select 
                  v-model="row.fieldId"
                  placeholder="请选择字段"
                  style="width: 100%"
                >
                  <el-option
                    v-for="field in getCompatibleFields(row.paramType)"
                    :key="field.id"
                    :label="field.name"
                    :value="field.id"
                  >
                    <div class="field-option">
                      <span>{{ field.name }}</span>
                      <el-tag size="small">{{ field.typeText }}</el-tag>
                    </div>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.fieldId ? 'success' : 'danger'" size="small">
                  {{ row.fieldId ? '已配置' : '未配置' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 输出参数映射 -->
        <div class="mapping-group">
          <h4>输出参数映射 (可选)</h4>
          <el-table :data="paramMappings.outputs" style="width: 100%">
            <el-table-column prop="paramLabel" label="AI参数" width="180">
              <template #default="{ row }">
                <div class="param-info">
                  <span>{{ row.paramLabel }}</span>
                  <el-tag size="small" type="info">{{ row.paramType }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="表格字段" width="280">
              <template #default="{ row }">
                <el-select 
                  v-model="row.fieldId"
                  placeholder="请选择字段(可选)"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="field in getCompatibleFields(row.paramType)"
                    :key="field.id"
                    :label="field.name"
                    :value="field.id"
                  >
                    <div class="field-option">
                      <span>{{ field.name }}</span>
                      <el-tag size="small">{{ field.typeText }}</el-tag>
                    </div>
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.fieldId ? 'success' : 'info'" size="small">
                  {{ row.fieldId ? '已配置' : '未配置' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 执行按钮 -->
        <div class="execution-footer">
          <el-button 
            type="primary" 
            :loading="executionStatus.running"
            :disabled="!selectedWorkflow || executionStatus.running"
            @click="executeWorkflow"
          >
            {{ executionStatus.running ? '执行中' : '执行工作流' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 执行结果展示 -->
    <div class="section-card" v-if="executionStatus.results.length > 0">
      <div class="section-title">执行结果</div>
      <div class="section-content">
        <!-- 执行进度 -->
        <div v-if="executionStatus.running || executionStatus.results.length > 0" class="execution-progress">
          <el-progress 
            :percentage="executionStatus.progress"
            :status="executionStatus.error ? 'exception' : 'success'"
          />
          <div class="progress-info">
            处理进度: {{ executionStatus.current }}/{{ executionStatus.total }}
          </div>
        </div>

        <!-- 执行结果 -->
        <div v-if="executionStatus.results.length > 0" class="execution-results">
          <h4>执行结果</h4>
          <el-table :data="executionStatus.results" style="width: 100%">
            <el-table-column prop="recordId" label="记录ID" width="180" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'success' ? 'success' : 'danger'">
                  {{ row.status === 'success' ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="error" label="错误信息" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 960px;
  margin: 0 auto;
}

.section-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid var(--semi-color-border, #e5e6eb);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-title {
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  color: var(--semi-color-text-0, #1f2329);
  border-bottom: 1px solid var(--semi-color-border, #e5e6eb);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-content {
  padding: 16px;
}

.subsection {
  margin-bottom: 24px;
}

.subsection:last-child {
  margin-bottom: 0;
}

.subsection-title {
  font-size: 14px;
  color: var(--semi-color-text-2, #4e5969);
  margin-bottom: 8px;
}

.input-with-button {
  display: flex;
  gap: 8px;
}

.view-select {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-text {
  min-width: 70px;
  color: var(--semi-color-text-2, #4e5969);
}

.collapsible-section {
  margin-top: 16px;
  border: 1px solid var(--semi-color-border, #e5e6eb);
  border-radius: 4px;
}

.section-header {
  padding: 12px;
  background-color: var(--semi-color-fill-0, #f7f8fa);
}

.collapse-content {
  padding: 16px;
  border-top: 1px solid var(--semi-color-border, #e5e6eb);
}

.execution-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.execution-progress {
  margin: 20px 0;
}

.progress-info {
  margin-top: 8px;
  text-align: center;
  color: #606266;
}

.execution-results {
  margin-top: 20px;
}

.execution-results h4 {
  margin: 0 0 12px 0;
  color: #606266;
}
</style>

<style>
.selectStyle .el-select-dropdown__item {
  font-weight: 300 !important;
}

.selectStyle .el-select-dropdown__item.selected {
  color: #0442d2;
}
</style>
