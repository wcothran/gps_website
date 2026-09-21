import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';
// Publish only the static public folder. Retired service state stays outside it.
await rm('dist/pages', { recursive: true, force: true });
await mkdir('dist/pages/assets/downloads', { recursive: true });
await cp('public', 'dist/pages', { recursive: true });
await writeFile('dist/pages/.nojekyll', '');
const context={window:{}};
runInNewContext(await readFile('public/assets/catalog.js','utf8'),context);
for(const guide of context.window.GPS_RESOURCES.filter(resource=>resource.format.includes('walkthrough')||resource.id==='ada-attendance-guided-demo')){
 const source=resolve('public',decodeURIComponent(guide.url));let content=await readFile(source,'utf8');
 for(const ref of new Set([...content.matchAll(/["']([^"']+\.webp)["']/g)].map(match=>match[1]))){const data=await readFile(resolve(dirname(source),ref));content=content.replaceAll(ref,'data:image/webp;base64,'+data.toString('base64'));}
 content=content.replaceAll('../../../../index.html#demos','../../index.html#demos');
 await writeFile('dist/pages/assets/downloads/'+guide.id+'.html',content);
}
console.log('Built public GPS Hub in dist/pages, including complete offline HTML downloads.');
