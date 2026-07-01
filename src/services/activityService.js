import * as db from "./db"; import { generateId } from "@/utils/id"
const S = "activities"
const SI = "activityItems"
export const getAll = () => db.getAll(S)
export const get = id => db.get(S, id)
export const getByMonth = (year, month) => {
  const start = `${year}-${String(month).padStart(2,"0")}-01`
  const end = `${year}-${String(month).padStart(2,"0")}-31`
  return db.getAllByIndexRange(S, "startDate", start, end)
}
export async function create(data) {
  const now = new Date().toISOString()
  const act = { id: generateId(), title: data.title, type: data.type||"custom", startDate: data.startDate, endDate: data.endDate||data.startDate, startTime: data.startTime||"", endTime: data.endTime||"", destination: data.destination||"", description: data.description||"", isRecurring: data.isRecurring||false, recurringType: data.recurringType||"", status: data.status||"active", bagIds: data.bagIds||[], packingItems: data.packingItems||[], createdAt: now, updatedAt: now }
  await db.add(S, act)
  if (data.packingItems?.length) {
    for (const pi of data.packingItems) { pi.id = generateId(); pi.activityId = act.id; await db.add(SI, pi) }
    act.packingItems = data.packingItems
  }
  return act
}
export async function update(id, data) {
  const e = await db.get(S, id); const u = { ...e, ...data, id, updatedAt: new Date().toISOString() }
  await db.put(S, u); return u
}
export const del = id => db.del(S, id)
export async function addPackingItem(activityId, item) {
  const pi = { id: generateId(), activityId, name: item.name, category: item.category||"", quantity: item.quantity||1, checked: false, reminderType: item.reminderType||"none" }
  await db.add(SI, pi); return pi
}
export async function togglePackingItem(id) {
  const pi = await db.get(SI, id); pi.checked = !pi.checked; await db.put(SI, pi); return pi
}
export async function getPackingItems(activityId) {
  return db.getAllByIndex(SI, "activityId", activityId)
}