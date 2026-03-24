'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login(){
 const [email,setEmail]=useState('')
 const [code,setCode]=useState('')
 const [step,setStep]=useState(1)

 const send=async()=>{
  await supabase.auth.signInWithOtp({email})
  setStep(2)
 }

 const verify=async()=>{
  await supabase.auth.verifyOtp({email,token:code,type:'email'})
  window.location.href='/dashboard'
 }

 return (
  <div style={{padding:40}}>
   <h2>Login</h2>
   {step===1 && <>
    <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
    <button onClick={send}>Enviar código</button>
   </>}
   {step===2 && <>
    <input placeholder="Código" onChange={e=>setCode(e.target.value)} />
    <button onClick={verify}>Entrar</button>
   </>}
  </div>
 )
}