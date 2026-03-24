'use client'
import { useState,useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Posts(){
 const [content,setContent]=useState('')
 const [posts,setPosts]=useState([])

 const load=async()=>{
  const {data}=await supabase.from('posts').select('*')
  setPosts(data||[])
 }

 const create=async()=>{
  await supabase.from('posts').insert({content})
  setContent('')
  load()
 }

 useEffect(()=>{load()},[])

 return (
  <div>
   <h1>Posts</h1>
   <textarea onChange={e=>setContent(e.target.value)} />
   <button onClick={create}>Criar</button>
   {posts.map(p=><div key={p.id}>{p.content}</div>)}
  </div>
 )
}