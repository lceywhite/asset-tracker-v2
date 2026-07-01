import { openDB } from "idb"
const DB_NAME = "asset-tracker-db", DB_VERSION = 3
let dbPromise = null
function getDb() {
  if (!dbPromise) dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains("items")) {
        const s = db.createObjectStore("items", { keyPath: "id" })
        s.createIndex("name","name"); s.createIndex("category","category")
        s.createIndex("status","status"); s.createIndex("tags","tags",{multiEntry:true})
        s.createIndex("roomId","roomId"); s.createIndex("bagId","bagId")
      }
      if (!db.objectStoreNames.contains("checklists")) {
        const s = db.createObjectStore("checklists", { keyPath: "id" })
        s.createIndex("type","type"); s.createIndex("status","status")
      }
      if (!db.objectStoreNames.contains("templates")) db.createObjectStore("templates", { keyPath: "id" })
      if (!db.objectStoreNames.contains("rooms")) {
        const s = db.createObjectStore("rooms", { keyPath: "id" })
        s.createIndex("name","name",{unique:true})
      }
      if (!db.objectStoreNames.contains("bags")) {
        const s = db.createObjectStore("bags", { keyPath: "id" })
        s.createIndex("name","name",{unique:true})
      }
      if (!db.objectStoreNames.contains("locationRecords")) {
        const s = db.createObjectStore("locationRecords", { keyPath: "id" })
        s.createIndex("itemId","itemId"); s.createIndex("timestamp","timestamp")
      }
      if (!db.objectStoreNames.contains("activities")) {
        db.createObjectStore("activities", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("activityItems")) {
        db.createObjectStore("activityItems", { keyPath: "id" })
      }
      if (oldVersion < 2) {
        import("./seed").then(m => m.seedAll(db))
      }
    }
  })
  return dbPromise
}
export const getAll = s => getDb().then(db => db.getAll(s))
export const get = (s,id) => getDb().then(db => db.get(s,id))
export const add = (s,v) => getDb().then(db => db.add(s,v))
export const put = (s,v) => getDb().then(db => db.put(s,v))
export const del = (s,id) => getDb().then(db => db.delete(s,id))
export const clear = s => getDb().then(db => db.clear(s))
export const getAllByIndex = (s,idx,val) => getDb().then(db => db.getAllFromIndex(s,idx,val))