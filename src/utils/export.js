export function exportToJSON(data, filename='asset-backup.json') {
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'}); const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
}
export function importJSON(file) {
  return new Promise((resolve,reject) => { const r = new FileReader(); r.onload = e => { try { resolve(JSON.parse(e.target.result)) } catch { reject(new Error('JSON格式错误')) } }; r.onerror = () => reject(new Error('文件读取失败')); r.readAsText(file) })
}