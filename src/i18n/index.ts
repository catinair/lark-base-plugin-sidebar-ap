import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    token: {
      title: '影刀AI Power Token',
      placeholder: '请输入AI Power Token',
      get: '点击获取',
      save: '保存',
      saveSuccess: '保存成功',
      required: '请输入Token'
    },
    database: {
      title: '数据源配置',
      select: '请选择数据表',
      noData: '暂无数据表',
      fields: '字段信息 ({total}个)',
      fieldsEmpty: '暂无字段信息'
    },
    workflow: {
      title: 'AI工作流配置', 
      select: '请选择工作流',
      noData: '暂无工作流',
      params: '参数信息 ({total}个)',
      paramsEmpty: '暂无参数信息'
    },
    mapping: {
      title: '参数映射配置',
      input: '输入参数',
      output: '输出参数',
      field: '字段',
      required: '请完成参数映射'
    },
    execute: {
      button: '执行',
      success: '执行成功',
      fail: '执行失败',
      processing: '执行中...'
    },
    error: {
      network: '网络错误',
      unknown: '未知错误'
    }
  },
  en: {
    token: {
      title: 'YingDao AI Power Token',
      placeholder: 'Please enter AI Power Token',
      get: 'Get Token',
      save: 'Save',
      saveSuccess: 'Saved successfully',
      required: 'Token is required'
    },
    database: {
      title: 'Data Source',
      select: 'Select Data Table',
      noData: 'No data table available',
      fields: 'Fields ({total})',
      fieldsEmpty: 'No fields available'
    },
    workflow: {
      title: 'AI Workflow',
      select: 'Select Workflow',
      noData: 'No workflow available',
      params: 'Parameters ({total})',
      paramsEmpty: 'No parameters available'
    },
    mapping: {
      title: 'Parameter Mapping',
      input: 'Input Parameters',
      output: 'Output Parameters', 
      field: 'Field',
      required: 'Please complete parameter mapping'
    },
    execute: {
      button: 'Execute',
      success: 'Execution successful',
      fail: 'Execution failed',
      processing: 'Processing...'
    },
    error: {
      network: 'Network error',
      unknown: 'Unknown error'
    }
  }
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 备用语言
  messages
})

export default i18n 