import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div style={{
        display: "flex",
        flexDirection: "column", 
        justifyContent: "center",
        alignItems: "center", 
        height: "100vh",
        width: "100%",
    }}>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/dashboard">Return Home</Link>
    </div>
  )
}