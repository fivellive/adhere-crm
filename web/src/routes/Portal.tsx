import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { db, storage, doc, getDoc, listAll, ref, getDownloadURL } from '../firebase'

export default function Portal() {
  const { projectId } = useParams()
  const [search] = useSearchParams()
  const [project, setProject] = useState<any>(null)
  const [files, setFiles] = useState<{name:string,url:string}[]>([])
  const token = search.get('t')

  useEffect(() => {
    (async () => {
      if (!projectId) return
      const d = await getDoc(doc(db, 'projects', projectId))
      if (!d.exists()) return
      const data = d.data()
      if (data.token !== token || !data.public) { setProject({ error: 'Link invalid or project not public.' }); return }
      setProject({ id: d.id, ...data })
      const folder = ref(storage, `projects/${projectId}`)
      const res = await listAll(folder)
      const arr: any[] = []
      for (const item of res.items) {
        const url = await getDownloadURL(item)
        arr.push({ name: item.name, url })
      }
      setFiles(arr)
    })()
  }, [projectId, token])

  if (!project) return <div className="p-6">Loading…</div>
  if (project.error) return <div className="p-6">{project.error}</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Project: {project.title}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {files.map(f => (
          <a key={f.name} className="card p-4 hover:shadow-soft" href={f.url} target="_blank">
            <div className="font-semibold">{f.name}</div>
            <div className="text-sm text-brand-muted">Click to view/download</div>
          </a>
        ))}
      </div>
    </div>
  )
}
