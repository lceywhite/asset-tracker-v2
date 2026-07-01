<script setup>
import { ref, computed, onMounted } from "vue"; import { useRoute, useRouter } from "vue-router"
import { useActivityStore } from "@/stores/useActivityStore"; import { useBagStore } from "@/stores/useBagStore"; import TripForm from "@/components/trip/TripForm.vue"
const route=useRoute(); const router=useRouter(); const store=useActivityStore(); const bagStore=useBagStore()
const trip=ref(null); const editing=ref(false); const checkMode=ref(false); const checkIdx=ref(0); const checkDone=ref({})
const typeEmoji={travel:"✈️",daily_carry:"🚶",move:"📦"}; const typeLabels={travel:"旅行",daily_carry:"日常",move:"搬家"}

const packedGroups = computed(() => {
  if(!trip.value?.packingItems) return []
  const g={}; for(const item of trip.value.packingItems){const k=item.sourceBagId||"_other";if(!g[k])g[k]={bagId:k,bagName:"",items:[]};g[k].items.push(item)}
  for(const k of Object.keys(g)){if(k==="_other")g[k].bagName="📦 其他";else{const b=bagStore.bags.find(x=>x.id===k);g[k].bagName=b?(b.icon||"🎒")+" "+b.name:"🎒 未知"}}
  return Object.values(g).sort((a,b)=>{if(a.bagId==="_other")return 1;if(b.bagId==="_other")return -1;return 0})
})

onMounted(async()=>{await Promise.all([store.loadAll(),bagStore.loadAll()]);trip.value=store.activities.find(a=>a.id===route.params.id)||null})
function toggleReminder(item){if(!item)return;const items=trip.value?.packingItems;if(!items)return;const idx=items.indexOf(item);if(idx<0)return;const rt=["return","daily","selfcheck"];const ri=rt.indexOf(item.reminderType);items[idx]={...items[idx],reminderType:rt[(ri+1)%3]}}
function rtLabel(r){return r==="return"?"返程":r==="daily"?"每天":"自行"}
function rtStyle(r){return r==="return"?"background:var(--brand-primary-light);color:var(--brand-primary)":r==="daily"?"background:var(--state-warning-bg);color:var(--state-warning)":"background:var(--color-bg);color:var(--color-text-secondary)"}
function onEdited(){editing.value=false;store.loadAll();trip.value=store.activities.find(a=>a.id===route.params.id)}

async function deleteTrip(){if(trip.value){await store.del(trip.value.id);router.push("/trips")}}
function startCheck(){checkMode.value=true;checkIdx.value=0;checkDone.value={}}
function doCheck(c){if(trip.value?.packingItems?.[checkIdx.value])trip.value.packingItems[checkIdx.value].checked=c;checkDone.value[checkIdx.value]=c;if(checkIdx.value<(trip.value?.packingItems?.length||0)-1)checkIdx.value++;else checkMode.value=false}
function prevCheck(){if(checkIdx.value>0)checkIdx.value--}
function exitCheck(){checkMode.value=false}
</script>
<template>
<div class="flex flex-col h-full" style="background:var(--color-bg)">
  <div class="flex items-center gap-2 px-4 py-3 bg-white border-b" style="border-color:var(--color-border)">
    <button @click="router.back()" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100">&larr;</button>
    <div class="flex-1 text-base font-bold truncate" style="color:var(--color-text-primary)">{{ trip?.title||"行程" }}</div>
    <span class="text-[10px] px-2 py-0.5 rounded-full font-medium" :style="trip?.status==='completed'?'background:var(--state-success-bg);color:var(--state-success)':'background:var(--brand-primary-light);color:var(--brand-primary)'">{{ trip?.status==="completed"?"已完成":"进行中" }}</span>
  </div>

  <div class="flex-1 overflow-y-auto p-4" v-if="trip && !checkMode">
    <div class="bg-white rounded-xl p-4 mb-4" style="border:1px solid var(--color-border-light)">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-2xl">{{ typeEmoji[trip.type]||"📋" }}</span>
        <div><div class="text-base font-bold" style="color:var(--color-text-primary)">{{ trip.title }}</div>
          <div class="text-xs" style="color:var(--color-text-tertiary)">{{ typeLabels[trip.type]||trip.type }}</div></div>
      </div>
      <div class="text-xs space-y-1.5" style="color:var(--color-text-secondary)">
        <div>📅 {{ trip.startDate }}<span v-if="trip.endDate!==trip.startDate"> → {{ trip.endDate }}</span></div>
        <div v-if="trip.isRecurring">🔄 重复：{{ trip.recurringType==="daily"?"每天":trip.recurringType==="weekly"?"每周":"每月" }}</div>
        <div v-if="trip.destination">📍 {{ trip.destination }}</div>
        <div v-if="trip.description">📝 {{ trip.description }}</div>
      </div>
    </div>

    <div class="bg-white rounded-xl" style="border:1px solid var(--color-border-light)">
      <div class="flex items-center justify-between px-4 py-3 border-b" style="border-color:var(--color-divider)">
        <span class="text-sm font-semibold" style="color:var(--color-text-primary)">🎒 携带物品</span>
        <span class="text-xs" style="color:var(--color-text-tertiary)">{{ trip.packingItems?.filter(i=>i.checked).length||0 }}/{{ trip.packingItems?.length||0 }}</span>
      </div>
      <div v-if="!trip.packingItems?.length" class="p-4 text-center text-xs" style="color:var(--color-text-tertiary)">暂无物品</div>
      <template v-else>
        <div v-for="(group, gi) in packedGroups" :key="gi">
          <div class="text-xs font-semibold px-4 py-2" style="color:var(--color-text-secondary);background:var(--color-bg)">{{ group.bagName }}</div>
          <div v-for="(item, ii) in group.items" :key="ii" class="flex items-center gap-3 px-4 py-3 border-t" style="border-color:var(--color-divider)">
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" :style="item.checked?'background:var(--state-success);border-color:var(--state-success)':'border-color:var(--color-border)'"><span v-if="item.checked" class="text-white text-xs">✓</span></div>
            <div class="flex-1 min-w-0"><div class="text-sm font-medium" :style="item.checked?'text-decoration:line-through;color:var(--color-text-tertiary)':'color:var(--color-text-primary)'">{{ item.name }}</div></div>
            <button @click="toggleReminder(item)" class="px-2 py-0.5 rounded text-[10px] font-medium" :style="rtStyle(item.reminderType)">{{ rtLabel(item.reminderType) }}</button>
          </div>
        </div>
        <div class="px-4 py-3 border-t" style="border-color:var(--color-divider)">
          <button @click="startCheck" class="w-full py-2.5 border border-dashed rounded-xl text-sm font-medium" style="border-color:var(--color-border);color:var(--brand-primary)">📋 手动Check</button>
        </div>
      </template>
    </div>
  </div>

  <div v-if="!trip" class="flex-1 flex items-center justify-center text-sm" style="color:var(--color-text-tertiary)">加载中...</div>

  <div v-if="trip && !checkMode" class="px-4 py-3 bg-white border-t flex gap-2" style="border-color:var(--color-border)">
    <button @click="editing=true" class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style="background:var(--brand-primary)">编辑</button>
    
    <button @click="deleteTrip" class="py-2.5 px-5 border rounded-xl text-sm font-medium" style="border-color:var(--state-error-bg);color:var(--state-error)">删除</button>
  </div>

  <div v-if="checkMode && trip?.packingItems?.length" class="fixed inset-0 z-50 flex flex-col bg-white">
    <div class="flex items-center gap-2 px-4 py-3 border-b" style="border-color:var(--color-border)">
      <button @click="exitCheck" class="text-sm" style="color:var(--color-text-secondary)">✕ 退出</button>
      <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full rounded-full transition-all" :style="{width:((Object.keys(checkDone).length)/trip.packingItems.length*100)+'%',background:'var(--state-success)'}"></div></div>
      <span class="text-xs" style="color:var(--color-text-tertiary)">{{ Object.keys(checkDone).length }}/{{ trip.packingItems.length }}</span>
    </div>
    <div class="flex-1 flex flex-col items-center justify-center px-8">
      <div class="text-5xl mb-6">{{ typeEmoji[trip.type]||"📋" }}</div>
      <div class="text-xl font-bold mb-2 text-center" style="color:var(--color-text-primary)">{{ trip.packingItems[checkIdx]?.name }}</div>
      <div class="text-sm mb-8" style="color:var(--color-text-tertiary)">{{ checkIdx+1 }} / {{ trip.packingItems.length }}</div>
      <div class="flex gap-8">
        <button @click="doCheck(false)" class="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl" style="background:var(--state-error-bg);color:var(--state-error)">✕</button>
        <button @click="doCheck(true)" class="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl" style="background:var(--state-success-bg);color:var(--state-success)">✓</button>
      </div>
      <button @click="prevCheck" v-if="checkIdx>0" class="mt-8 text-sm" style="color:var(--color-text-tertiary)">← 上一个</button>
    </div>
  </div>
</div>
<TripForm :show="editing" :edit-trip="trip" @close="editing=false" @created="onEdited"/>
</template>