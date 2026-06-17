import{useState,useRef,useCallback,useEffect}from'react'
  const ALGOS=["Bubble","Selection","Insertion","Merge","Quick","Heap"] as const
  type Algo=typeof ALGOS[number]
  const rand=(n:number)=>Array.from({length:n},()=>Math.floor(Math.random()*n)+4)
  const delay=(ms:number)=>new Promise(r=>setTimeout(r,ms))
  async function bubble(arr:number[],update:(a:number[],i:number,j:number)=>Promise<boolean>){
    const a=[...arr];for(let i=0;i<a.length;i++)for(let j=0;j<a.length-i-1;j++){if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];if(!await update(a,j,j+1))return}}
  }
  async function selection(arr:number[],update:(a:number[],i:number,j:number)=>Promise<boolean>){
    const a=[...arr];for(let i=0;i<a.length;i++){let m=i;for(let j=i+1;j<a.length;j++){if(a[j]<a[m])m=j;if(!await update(a,m,j))return};[a[i],a[m]]=[a[m],a[i]];if(!await update(a,i,m))return}
  }
  async function insertion(arr:number[],update:(a:number[],i:number,j:number)=>Promise<boolean>){
    const a=[...arr];for(let i=1;i<a.length;i++){let j=i;while(j>0&&a[j-1]>a[j]){[a[j],a[j-1]]=[a[j-1],a[j]];j--;if(!await update(a,j,j+1))return}}
  }
  async function mergeSort(arr:number[],update:(a:number[],i:number,j:number)=>Promise<boolean>){
    const a=[...arr]
    async function ms(l:number,r:number){
      if(l>=r)return;const m=Math.floor((l+r)/2);await ms(l,m);await ms(m+1,r)
      const tmp=a.slice(l,r+1);let i=0,j=m-l+1,k=l
      while(i<=m-l&&j<tmp.length){a[k++]=tmp[i]<=tmp[j]?tmp[i++]:tmp[j++];if(!await update(a,k-1,k))return}
      while(i<=m-l)a[k++]=tmp[i++];while(j<tmp.length)a[k++]=tmp[j++]
    }
    await ms(0,a.length-1)
  }
  async function quick(arr:number[],update:(a:number[],i:number,j:number)=>Promise<boolean>){
    const a=[...arr]
    async function qs(l:number,r:number){
      if(l>=r)return;const p=a[r];let i=l
      for(let j=l;j<r;j++){if(a[j]<=p){[a[i],a[j]]=[a[j],a[i]];i++;if(!await update(a,i-1,j))return}}
      [a[i],a[r]]=[a[r],a[i]];if(!await update(a,i,r))return
      await qs(l,i-1);await qs(i+1,r)
    }
    await qs(0,a.length-1)
  }
  async function heap(arr:number[],update:(a:number[],i:number,j:number)=>Promise<boolean>){
    const a=[...arr],n=a.length
    async function heapify(n2:number,i:number){let lg=i,l=2*i+1,r=2*i+2;if(l<n2&&a[l]>a[lg])lg=l;if(r<n2&&a[r]>a[lg])lg=r;if(lg!==i){[a[i],a[lg]]=[a[lg],a[i]];if(!await update(a,i,lg))return;await heapify(n2,lg)}}
    for(let i=Math.floor(n/2)-1;i>=0;i--)await heapify(n,i)
    for(let i=n-1;i>0;i--){[a[0],a[i]]=[a[i],a[0]];if(!await update(a,0,i))return;await heapify(i,0)}
  }
  const ALGO_FN:{[k in Algo]:typeof bubble}={Bubble:bubble,Selection:selection,Insertion:insertion,Merge:mergeSort,Quick:quick,Heap:heap}
  const COLORS=["#38bdf8","#22c55e","#f59e0b","#ef4444","#a855f7","#ec4899"]
  export default function App(){
    const N=40
    const[src]=useState(()=>rand(N))
    const[states,setStates]=useState<{arr:number[];done:boolean}[]>(ALGOS.map(()=>({arr:[...src],done:false})))
    const[running,setRunning]=useState(false)
    const[speed,setSpeed]=useState(30)
    const stoppedRef=useRef(false)
    const run=useCallback(async()=>{
      stoppedRef.current=false;setRunning(true)
      const fresh=rand(N)
      setStates(ALGOS.map(()=>({arr:[...fresh],done:false})))
      await delay(50)
      await Promise.all(ALGOS.map((algo,ai)=>{
        const makeUpdate=(ai2:number)=>(arr:number[])=>new Promise<boolean>(resolve=>{
          if(stoppedRef.current){resolve(false);return}
          setStates(st=>st.map((s,i)=>i===ai2?{arr:[...arr],done:false}:s))
          setTimeout(()=>resolve(!stoppedRef.current),speed)
        })
        return ALGO_FN[algo]([...fresh],makeUpdate(ai)).then(()=>setStates(st=>st.map((s,i)=>i===ai?{arr:s.arr,done:true}:s)))
      }))
      setRunning(false)
    },[speed])
    const stop=()=>{stoppedRef.current=true;setRunning(false)}
    useEffect(()=>()=>{stoppedRef.current=true},[])
    const MAX=N+4
    return(
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",padding:"1.5rem"}}>
        <h1 style={{fontWeight:800,fontSize:"1.5rem",color:"#f8fafc"}}>⚡ Sorting Race</h1>
        <div style={{display:"flex",gap:"0.75rem",alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={running?stop:run} style={{padding:"0.5rem 1.5rem",background:running?"#dc2626":"#22c55e",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700}}>{running?"Stop":"Race!"}</button>
          <label style={{color:"#94a3b8",fontSize:"0.82rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>Speed: <input type="range" min="5" max="100" value={speed} onChange={e=>setSpeed(+e.target.value)} style={{accentColor:"#38bdf8"}}/></label>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.75rem",width:"100%",maxWidth:960}}>
          {ALGOS.map((algo,ai)=>(
            <div key={algo} style={{background:"#111827",border:"1px solid "+(states[ai].done?"#166534":"#1e293b"),borderRadius:10,padding:"0.75rem",transition:"border-color 0.3s"}}>
              <div style={{fontWeight:600,fontSize:"0.85rem",color:states[ai].done?"#22c55e":COLORS[ai],marginBottom:"0.5rem"}}>{algo}{states[ai].done?" ✓":""}</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:1,height:80}}>
                {states[ai].arr.map((v,i)=>(
                  <div key={i} style={{flex:1,background:states[ai].done?"#22c55e":COLORS[ai],height:(v/MAX*100)+"%",borderRadius:"2px 2px 0 0",minWidth:2,opacity:0.85}}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }