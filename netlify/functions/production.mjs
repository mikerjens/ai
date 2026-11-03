const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
const response=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
export default async function production(request,context){
 if(request.method!=='GET')return response({error:'Method not allowed'},405);
 // Requires Netlify private/team login. Never trust an identity header from the browser.
 if(!context?.user)return response({error:'Log ind via portalens Netlify adgang for at se planen.'},401);
 const source=Netlify.env.get('GOOGLE_APPS_SCRIPT_URL'),secret=Netlify.env.get('GOOGLE_APPS_SCRIPT_SECRET');
 if(!source||!secret)return response({error:'Google forbindelsen mangler opsætning.'},503);
 let url;try{url=new URL(source);if(url.origin!=='https://script.google.com'||!/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname))throw Error()}catch{return response({error:'Google forbindelsen har en ugyldig adresse.'},503)}
 try{
  const upstream=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret}),signal:AbortSignal.timeout(20000),redirect:'follow'});
  if(!upstream.ok)throw Error();const result=await upstream.json();
  if(result.ok!==true||!result.plan?.tabs?.KALENDER||!result.plan?.tabs?.SCENER||!Number.isFinite(Date.parse(result.plan.sourceAt)))throw Error();
  return response({...result.plan,syncEnabled:true});
 }catch{return response({error:'Planen kunne ikke hentes fra Google Sheets. Sidste viste plan kan være forældet.'},502)}
}
export const config={path:'/api/production',method:['GET']};
