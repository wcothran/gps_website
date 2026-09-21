import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { runInNewContext } from 'node:vm';
const root=resolve('dist/pages');
const context={window:{}};
runInNewContext(await readFile(root+'/assets/catalog.js','utf8'),context);
const resources=context.window.GPS_RESOURCES;
async function files(directory){const all=[];for(const item of await readdir(directory,{withFileTypes:true})){const path=directory+'/'+item.name;if(item.isDirectory())all.push(...await files(path));else all.push(path);}return all;}
test('release contains all 18 source destinations and only public assets',async()=>{
 assert.equal(resources.length,18);assert.equal(new Set(resources.map(x=>x.id)).size,18);
 for(const resource of resources){const file=resolve(root,decodeURIComponent(resource.url));assert.ok(file.startsWith(root+'/'));assert.ok((await stat(file)).isFile(),resource.id);}
 const paths=await files(root);assert.ok(!paths.some(path=>/\/(worker|legacy|drizzle|\.openai)\//.test(path)));
 assert.ok(!paths.some(path=>path.endsWith('/live.js')));
});
test('public entry point loads local scripts and has no account or API dependency',async()=>{
 const index=await readFile(root+'/index.html','utf8');
 for(const match of index.matchAll(/(?:src|href)="([^"]+)"/g)){if(match[1].startsWith('mailto:'))continue;assert.ok((await stat(resolve(root,match[1]))).isFile(),match[1]);}
 const app=await readFile(root+'/app.js','utf8');assert.doesNotMatch(app,/GPSLive|fetch\(|\/api\/|auth\.openai|Moderator inbox|target="_blank"/);
 assert.match(app,/Help & Feedback/);assert.match(app,/mailto:gps@ed.sc.gov/);assert.match(app,/does not send or save/);
});
test('every local image and stylesheet referenced by the source guides resolves',async()=>{
 for(const file of (await files(root)).filter(path=>path.endsWith('.html'))){const source=await readFile(file,'utf8');const refs=[...source.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(x=>x[1]);refs.push(...[...source.matchAll(/["']([^"']+\.webp)["']/g)].map(x=>x[1]));
  for(const ref of refs){if(/^(?:data:|https?:|mailto:|#)/.test(ref)||!ref)continue;const path=resolve(dirname(file),decodeURIComponent(ref.split('#')[0]));assert.ok(path.startsWith(root+'/'),file+' '+ref);assert.ok((await stat(path)).isFile(),file+' '+ref);}
 }
});
test('walkthrough subsections each include 2 or 3 source-based questions',async()=>{
 const introduction=await readFile(root+'/'+decodeURIComponent(resources[0].url),'utf8');
 for(const id of ['admin-01','admin-02','admin-03','admin-04','admin-05','teach-01','teach-02','teach-03','teach-04']){
  const block=introduction.match(new RegExp('id="'+id+'"><div class="dashboard-questions">([\\s\\S]*?)</ul>'))?.[1];assert.ok(block,id);const count=[...block.matchAll(/<li>/g)].length;assert.ok(count>=2&&count<=3,id);
 }
 assert.doesNotMatch(introduction,/setTimeout\(function\(\)\{ activateTab/);
 const ois=await readFile(root+'/'+decodeURIComponent(resources[1].url),'utf8');assert.equal((ois.match(/<div class="dashboard-questions">/g)||[]).length,3);
});
test('attendance marker is descriptive and enlargement is an accessible dialog',async()=>{
 const ada=await readFile(root+'/assets/demos/ada-walkthrough.html','utf8');assert.match(ada,/<span class="hotspot"/);assert.doesNotMatch(ada,/hotspot.*onclick/);assert.match(ada,/<dialog/);assert.match(ada,/showModal\(\)/);assert.match(ada,/Synthetic demo records/);assert.match(ada,/Use Next to continue/);
});
