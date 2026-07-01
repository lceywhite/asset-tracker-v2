import * as db from "./db"; import { generateId } from "@/utils/id"
const S = "rooms"
export const getAll = () => db.getAll(S)
export const get = id => db.get(S, id)
export async function create(data) {
  const now = new Date().toISOString()
  const item = { id: generateId(), name: data.name, icon: data.icon||"🚪", sortOrder: data.sortOrder||0, createdAt: now, updatedAt: now }
  await db.add(S, item); return item
}
export async function update(id, data) { const e=await db.get(S,id); const u={...e,...data,id,updatedAt:new Date().toISOString()}; await db.put(S,u); return u }
export const del = id => db.del(S, id)