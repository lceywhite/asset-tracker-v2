<script setup>
import { ref } from 'vue'; import { useItemStore } from '@/stores/useItemStore'; import { useChecklistStore } from '@/stores/useChecklistStore'
import { exportToJSON, importJSON } from '@/utils/export'; import * as db from '@/services/db'; import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
const itemStore=useItemStore(); const checklistStore=useChecklistStore(); const importFile=ref(null); const showClear=ref(false); const msg=ref('')
function showMsg(m) { msg.value=m; setTimeout(()=>msg.value='',3000) }
async function handleExport() { const items=await db.getAll('items'); const checklists=await db.getAll('checklists'); const templates=await db.getAll('templates'); exportToJSON({items,checklists,templates,exportedAt:new Date().toISOString()}); showMsg('已导出') }
async function handleImport() { if(!importFile.value)return; try { const data=await importJSON(importFile.value); if(data.items)for(const item of data.items)await db.put('items',item); if(data.checklists)for(const cl of data.checklists)await db.put('checklists',cl); await itemStore.loadItems(); await checklistStore.loadAll(); showMsg('已导入 '+ (data.items?.length||0) +' 件物品') } catch(e) { showMsg('导入失败: '+e.message) }; importFile.value=null }
async function handleClear() { await db.clear('items'); await db.clear('checklists'); await itemStore.loadItems(); await checklistStore.loadAll(); showClear.value=false; showMsg('已清空') }
</script>
<template>
<div class="p-6 max-w-2xl mx-auto"><h2 class="text-xl font-bold mb-6">设置</h2>
  <div v-if="msg" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 text-center">{{msg}}</div>
  <section class="bg-white rounded-xl border p-6 mb-4"><h3 class="text-sm font-semibold text-gray-700 mb-4">数据管理</h3>
    <div class="space-y-3">
      <button @click="handleExport" class="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50"><div class="text-sm font-medium">导出数据 (JSON)</div><div class="text-xs text-gray-500">备份所有物品和清单</div></button>
      <div class="px-4 py-3 border rounded-lg"><div class="text-sm font-medium mb-2">导入数据</div><input type="file" accept=".json" @change="e=>importFile=e.target.files[0]" class="text-sm"/><button v-if="importFile" @click="handleImport" class="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs">导入</button></div>
      <button @click="showClear=true" class="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50"><div class="text-sm font-medium text-red-600">清空所有数据</div><div class="text-xs text-red-400">不可恢复</div></button></div></section>
  <section class="bg-white rounded-xl border p-6"><h3 class="text-sm font-semibold text-gray-700 mb-2">关于</h3><div class="text-xs text-gray-500 space-y-1"><div>资产清单 v0.1.0 Demo</div><div>数据存储在本地浏览器中</div></div></section>
  <ConfirmDialog :show="showClear" title="清空数据" message="删除所有物品和清单，不可恢复。" @confirm="handleClear" @cancel="showClear=false"/></div>
</template>