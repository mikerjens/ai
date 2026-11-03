import {readSpreadsheetPlan} from '../lib/google-sheet.mjs';
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
const response=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
export default async function production(request,context){
 if(request.method!=='GET')return response({error:'Method not allowed'},405);
 if(!context?.user)return response({error:'Log ind via portalens Netlify adgang for at se planen.'},401);
 try{return response(await readSpreadsheetPlan())}catch{return response({error:'Google arket kunne ikke hentes. Sidst viste plan kan være forældet. Kontrollér arkets læseadgang.'},502)}
}
export const config={path:'/api/production',method:['GET']};
