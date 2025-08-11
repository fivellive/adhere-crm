import { useEffect, useState } from 'react'
import { auth, onAuthStateChanged, signOut, db, storage, collection, addDoc, getDocs, doc, setDoc, updateDoc, serverTimestamp, ref, uploadBytes, getDownloadURL, listAll, query, where, orderBy } from '../firebase'
import { useNavigate } from 'react-router-dom'

type Client = { id?: string; name: string; email?: string };
type Project = { id?: string; clientId: string; title: string; public?: boolean; createdAt?: any; token?: string };

export default function Admin() {
  const nav = useNavigate()
  const [user, setUser] = useState<any>(null)

  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [newClient, setNewClient] = useState({ name: '', email: '' })
  const [newProject, setNewProject] = useState({ clientId: '', title: '' })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [calc, setCalc] = useState({ designHours: 0, installSqft: 0, printFeet: 0 })

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) return nav('/')
      setUser(u)
      const cs = await getDocs(collection(db, 'clients'))
      setClients(cs.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
      const ps = await getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')))
      setProjects(ps.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
    })
  }, [])

  const addClient = async () => {
    if (!newClient.name) return
    const ref = await addDoc(collection(db, 'clients'), { ...newClient, createdAt: serverTimestamp() })
    setClients([{ id: ref.id, ...newClient }, ...clients])
    setNewClient({ name: '', email: '' })
  }

  const addProject = async () => {
    if (!newProject.clientId || !newProject.title) return
    const token = Math.random().toString(36).slice(2,10)
    const ref = await addDoc(collection(db, 'projects'), { ...newProject, public: false, token, createdAt: serverTimestamp() })
    setProjects([{ id: ref.id, clientId: newProject.clientId, title: newProject.title, public: false, token }, ...projects])
    setNewProject({ clientId: '', title: '' })
  }

  const togglePublic = async (p: Project) => {
    const nd = { public: !p.public }
    await updateDoc(doc(db, 'projects', p.id!), nd as any)
    setProjects(projects.map(x => x.id === p.id ? { ...x, ...nd } : x))
  }

  const uploadProjectFiles = async () => {
    if (!selectedProject || !files) return
    const folder = `projects/${selectedProject.id}`
    for (const f of Array.from(files)) {
      const r = ref(storage, `${folder}/${f.name}`)
      await uploadBytes(r, f)
    }
    alert('Uploaded. Refresh portal to see files.')
  }

  const calcTotal = () => {
    const design = calc.designHours * 65
    const install = calc.installSqft * 3.5  // example baseline
    const print = calc.printFeet * 8.0      // example baseline
    return (design + install + print).toFixed(2)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Adhere CRM Admin</h1>
        <button className="btn" onClick={() => signOut(auth)}>Sign out</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4 space-y-3">
          <h2 className="font-semibold">New Client</h2>
          <input className="input w-full" placeholder="Client name" value={newClient.name} onChange={e=>setNewClient({...newClient, name:e.target.value})} />
          <input className="input w-full" placeholder="Client email" value={newClient.email} onChange={e=>setNewClient({...newClient, email:e.target.value})} />
          <button className="btn w-full" onClick={addClient}>Add Client</button>
        </div>

        <div className="card p-4 space-y-3">
          <h2 className="font-semibold">New Project</h2>
          <select className="input w-full" value={newProject.clientId} onChange={e=>setNewProject({...newProject, clientId:e.target.value})}>
            <option value="">Select client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="input w-full" placeholder="Project title" value={newProject.title} onChange={e=>setNewProject({...newProject, title:e.target.value})} />
          <button className="btn w-full" onClick={addProject}>Add Project</button>
        </div>

        <div className="card p-4 space-y-3">
          <h2 className="font-semibold">Price Calculator</h2>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="label">Design (hrs)</div>
              <input className="input w-full" type="number" value={calc.designHours} onChange={e=>setCalc({...calc, designHours:Number(e.target.value)})} />
            </div>
            <div>
              <div className="label">Install (sqft)</div>
              <input className="input w-full" type="number" value={calc.installSqft} onChange={e=>setCalc({...calc, installSqft:Number(e.target.value)})} />
            </div>
            <div>
              <div className="label">Print (ft)</div>
              <input className="input w-full" type="number" value={calc.printFeet} onChange={e=>setCalc({...calc, printFeet:Number(e.target.value)})} />
            </div>
          </div>
          <div className="text-sm text-brand-muted">Design @ $65/hr • Install ~$3.50/sqft • Print ~$8/ft</div>
          <div className="text-xl font-bold">Total: ${calcTotal()}</div>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-semibold mb-3">Projects</h2>
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="p-4 bg-[#0f1113] rounded-xl border border-[#2a2f36]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-brand-muted">ID: {p.id}</div>
                  <div className="text-sm text-brand-muted">Portal: /portal/{p.id}?t={p.token}</div>
                </div>
                <button className="btn" onClick={() => togglePublic(p)}>{p.public ? 'Make Private' : 'Make Public'}</button>
              </div>
              <div className="mt-3">
                <input className="input w-full" type="file" multiple onChange={(e)=>setFiles(e.target.files)} />
                <button className="btn mt-2" onClick={uploadProjectFiles}>Upload Files</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
