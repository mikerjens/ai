/** Deploy as a Web App: execute as mk@fixer.fo; access Anyone.
 * Every request is checked against a long random secret in Script Properties.
 * Do not publish the spreadsheet itself. Do not store the secret in source code.
 */
const SHEET_ID='1vCKfMTNwqCJ8DNY12yg1at4jUDjnTBJnTpRgFLvbiCk';
const RANGES=['OVERBLIK!A1:J100','OPTAGEFORSLAG!A1:L100','SCENER!A1:K200',"'SPA DAG'!A1:F100",'OPGAVER!A1:E500','TEAM!A1:F100','GEAR!A1:I200','GANTT!A1:AB100','KALENDER!A1:G500'];
function doPost(event){
 try{
  const input=JSON.parse(event.postData.contents),key=PropertiesService.getScriptProperties().getProperty('GOOGLE_APPS_SCRIPT_SECRET');
  if(!key||key.length<32||input.secret!==key)return output({ok:false,error:'Unauthorized'});
  const book=SpreadsheetApp.openById(SHEET_ID),tabs={};
  RANGES.forEach(function(range){const pair=range.split('!'),name=pair[0].replace(/^'|'$/g,''),sheet=book.getSheetByName(name);if(!sheet)throw new Error('Missing sheet');const values=sheet.getRange(pair[1]).getDisplayValues();while(values.length>5&&values[values.length-1].every(function(v){return v==='';}))values.pop();tabs[name]=values;});
  return output({ok:true,plan:{spreadsheetId:SHEET_ID,sourceAt:new Date().toISOString(),syncEnabled:true,tabs:tabs}});
 }catch(error){return output({ok:false,error:'Spreadsheet read failed'});}
}
function doGet(){return output({ok:false,error:'Use authenticated POST'});}
function output(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
