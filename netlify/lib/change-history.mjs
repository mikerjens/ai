import { getStore } from '@netlify/blobs';

// Keep this timeline shared by the entire production team, across deploys.
const storeName='production-change-history-v1';
const tracked=['Dato','Start','Slut','Status','Location'];
const valuesFromPlan=plan=>{
 const rows=plan.tabs?.KALENDER||[];
 const header=rows.findIndex(r=>r[0]==='Dato');
 if(header<0) return {};
 const occurrences={}, out={};
 for(const row of rows.slice(header+1)){
  const id=String(row[3]||'').trim();
  if(!id) continue;
  occurrences[id]=(occurrences[id]||0)+1;
  const key=id+'#'+occurrences[id];
  out[key]={id,values:[row[0]||'',row[1]||'',row[2]||'',row[4]||'',row[5]||''].map(v=>String(v).trim())};
 }
 return out;
};
const localDay=iso=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Atlantic/Faroe',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));
const clean=v=>v||'Uden dato';
function changesBetween(previous,current,when){
 const changes=[];
 for(const [key,newRecord] of Object.entries(current)){
  const oldRecord=previous[key]; if(!oldRecord)continue;
  for(let i=0;i<tracked.length;i++){
   const before=oldRecord.values[i],after=newRecord.values[i];
   if(before===after)continue;
   changes.push({at:when,day:localDay(when),scene:newRecord.id,field:tracked[i],before:clean(before),after:clean(after)});
  }
 }
 return changes;
}
export async function recordPlanChanges(plan){
 const store=getStore(storeName),snapshot=valuesFromPlan(plan);
 // Best-effort optimistic retry to avoid overwritten changes on concurrent polling.
 for(let attempt=0;attempt<4;attempt++){
  const prior=await store.getWithMetadata('history',{type:'json',consistency:'strong'});
  const data=prior?.data||{snapshot:null,events:[]};
  const before=data.snapshot;
  const now=new Date().toISOString();
  const updates=before?changesBetween(before,snapshot,now):[];
  const dayLimit=Date.now()-4*86400000;
  const previousEvents=(data.events||[]).filter(e=>Date.parse(e.at)>=dayLimit);
  if(before&&updates.length===0)return {events:previousEvents,initialized:true};
  const next={snapshot,events:[...updates,...previousEvents].slice(0,300)};
  const condition=prior?{onlyIfMatch:prior.etag}:{onlyIfNew:true};
  const result=await store.setJSON('history',next,condition);
  if(result.modified)return {events:next.events,initialized:true};
 }
 throw Error('Unable to persist change history after concurrent updates');
}
