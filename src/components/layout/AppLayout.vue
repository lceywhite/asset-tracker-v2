<script setup>
import { ref, computed } from "vue"; import { useRoute, useRouter } from "vue-router"
import ItemEditSheet from "@/components/item/ItemEditSheet.vue"
const route=useRoute(); const router=useRouter()
const showFab=ref(false); const showCreate=ref(false); const createBagId=ref(""); const createRoomId=ref("")
const tabs = [
  { key:"home", path:"/home", label:"物品" },
  { key:"trips", path:"/trips", label:"行程" },
  { key:"_fab", isFab:true },
  { key:"settings", path:"/settings", label:"设置" },
]
const currentTab = computed(() => {
  const p=route.path
  if(p.startsWith("/home")||p.startsWith("/bag")||p.startsWith("/room")||p.startsWith("/item"))return"home"
  if(p.startsWith("/trips"))return"trips"
  if(p.startsWith("/settings"))return"settings"
  return"home"
})
function onFab() { showFab.value=!showFab.value }
function openCreate(bagId,roomId) { createBagId.value=bagId||""; createRoomId.value=roomId||""; showFab.value=false; showCreate.value=true }
function onCreated(item) { showCreate.value=false; router.push("/item/"+item.id) }
</script>
<template>
<div class="flex flex-col h-screen" style="background:var(--color-bg)">
  <main class="flex-1 overflow-y-auto"><router-view /></main>
  <nav class="flex items-end justify-around bg-white border-t px-2 pb-1 pt-1" style="border-color:var(--color-border);padding-bottom:env(safe-area-inset-bottom,4px);min-height:56px">
    <div v-for="tab in tabs" :key="tab.key" class="flex-1 flex flex-col items-center justify-center py-1 gap-0.5 cursor-pointer select-none"
      :class="tab.isFab?'relative':''" @click="tab.isFab?onFab():router.push(tab.path)">
      <template v-if="tab.key==='home'">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="currentTab==='home'?'var(--brand-primary)':'var(--color-text-tertiary)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
        <span class="text-[10px]" :style="{color:currentTab==='home'?'var(--brand-primary)':'var(--color-text-tertiary)',fontWeight:currentTab==='home'?600:400}">物品</span>
      </template>
      <template v-else-if="tab.key==='trips'">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="currentTab==='trips'?'var(--brand-primary)':'var(--color-text-tertiary)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span class="text-[10px]" :style="{color:currentTab==='trips'?'var(--brand-primary)':'var(--color-text-tertiary)',fontWeight:currentTab==='trips'?600:400}">行程</span>
      </template>
      <template v-else-if="tab.isFab">
        <div class="w-11 h-11 rounded-xl flex items-center justify-center -mt-3 transition-transform" :class="showFab?'rotate-45':''" style="background:var(--brand-primary);box-shadow:var(--shadow-lg)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
      </template>
      <template v-else-if="tab.key==='settings'">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="currentTab==='settings'?'var(--brand-primary)':'var(--color-text-tertiary)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span class="text-[10px]" :style="{color:currentTab==='settings'?'var(--brand-primary)':'var(--color-text-tertiary)',fontWeight:currentTab==='settings'?600:400}">设置</span>
      </template>
    </div>
  </nav>
  <!-- FAB menu -->
  <div v-if="showFab" class="fixed inset-0 z-40" @click="showFab=false">
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="absolute bottom-20 right-4 flex flex-col items-end gap-2">
      <div @click="openCreate('','')" class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg cursor-pointer hover:bg-gray-50"><span class="text-lg">📝</span><span class="text-sm font-medium">文字录入</span></div>
      <div @click="openCreate('','')" class="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg cursor-pointer hover:bg-gray-50"><span class="text-lg">📷</span><span class="text-sm font-medium">拍照录入</span></div>
    </div>
  </div>
  <ItemEditSheet :show="showCreate" :preset-bag-id="createBagId" :preset-room-id="createRoomId" @close="showCreate=false" @created="onCreated"/>
</div>
</template>