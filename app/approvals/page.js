'use client'
import { useEffect,useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Approvals(){
 const [posts,setPosts]=useState([])

 const load=async()=>{
  const {data}=await supabase.from('posts').select('*')
  setPosts(data||[])
 }

 const approve=async(id)=>{
  await supabase.from('posts').update({status:'approved'}).eq('id',id)
  load()
 }

 const reject=async(id)=>{
  await supabase.from('posts').update({status:'rejected'}).eq('id',id)
  load()
 }

 useEffect(()=>{load()},[])

 return (
  <div>
   <h1>Aprovações</h1>
   {posts.map(p=>(
    <div key={p.id} style={{border:'1px solid #ccc',margin:10,padding:10}}>
     <p>{p.content}</p>
     <button onClick={()=>approve(p.id)}>Aprovar</button>
     <button onClick={()=>reject(p.id)}>Reprovar</button>
    </div>
   ))}
  </div>
 )
}