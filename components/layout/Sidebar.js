export default function Sidebar(){
 return (
  <div style={{width:200,background:'#eee',height:'100vh',padding:20}}>
   <h3>Approve</h3>
   <ul>
    <li><a href='/dashboard'>Dashboard</a></li>
    <li><a href='/clients'>Clientes</a></li>
    <li><a href='/posts'>Posts</a></li>
    <li><a href='/approvals'>Aprovações</a></li>
    <li><a href='/settings'>Config</a></li>
   </ul>
  </div>
 )
}