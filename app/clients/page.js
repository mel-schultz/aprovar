'use client'
import { useEffect,useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Clients(){
 const [clients,setClients]=useState([])
 const [name,setName]=useState('')

 const load=async()=>{
  const {data}=await supabase.from('clients').select('*')
  setClients(data||[])
 }

 const create=async()=>{
  await supabase.from('clients').insert({name})
  setName('')
  load()
 }

 useEffect(()=>{load()},[])

 return (
  <div>
   <h1>Clientes</h1>
   <input value={name} onChange={e=>setName(e.target.value)} />
   <button onClick={create}>Adicionar</button>
   {clients.map(c=><div key={c.id}>{c.name}</div>)}
  </div>
 )
}