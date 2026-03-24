import Sidebar from '../components/layout/Sidebar'

export default function RootLayout({children}){
 return (
  <html>
   <body style={{display:'flex'}}>
    <Sidebar />
    <div style={{flex:1,padding:20}}>
     {children}
    </div>
   </body>
  </html>
 )
}