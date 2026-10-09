(function(){
 'use strict';
 document.querySelectorAll('.mobile-nav').forEach(menu=>{
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.open=false;}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
 });
 document.querySelectorAll('.day').forEach(day=>{const openHash=()=>{if(location.hash==='#'+day.id)day.open=true;};openHash();window.addEventListener('hashchange',openHash);});
 document.querySelectorAll('[data-copy-email]').forEach(button=>button.addEventListener('click',async()=>{
  const address=button.dataset.copyEmail;const status=button.parentElement.querySelector('.email-status');
  try{if(!navigator.clipboard||!window.isSecureContext)throw new Error('clipboard unavailable');await navigator.clipboard.writeText(address);status.textContent='Correo copiado.';}catch{const text=button.parentElement.querySelector('.email-address');const range=document.createRange();range.selectNodeContents(text);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);status.textContent='Correo seleccionado. Cópialo con Ctrl+C o mantén presionado en el celular.';}
 }));
 document.querySelectorAll('[data-calculator]').forEach(calculator=>{
  const form=calculator.querySelector('.calc-form'),result=calculator.querySelector('.calc-result'),status=calculator.querySelector('.calc-status');
  const keys=['sex','age','weight','height','activity','goal'];
  const field=key=>form.querySelector('[name="'+key+'"]');
  const error=key=>field(key).closest('.field').querySelector('.field-error');
  function clear(){result.hidden=true;status.textContent='';for(const key of keys){field(key).removeAttribute('aria-invalid');error(key).textContent='';}}
  function invalidate(){const wasVisible=!result.hidden;clear();if(wasVisible)status.textContent='Cambiaste los datos. Vuelve a calcular para ver una nueva estimación.';}
  form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
  function calculate(){
   clear();const values={};keys.forEach(key=>values[key]=field(key).value);
   const data=window.FitnessCalculator.calculate(values);
   if(!data.ok){
    let first;for(const [key,message] of Object.entries(data.errors)){error(key).textContent=message;field(key).setAttribute('aria-invalid','true');if(!first)first=field(key);}
    status.textContent=data.message||'Revisa los campos indicados antes de calcular.';
    if(first)first.focus();status.scrollIntoView({block:'center'});return;
   }
   const fmt=new Intl.NumberFormat('es-CL',{maximumFractionDigits:0});
   for(const key of ['bmr','tdee','target','protein','fat','carbs'])result.querySelector('[data-result="'+key+'"]').textContent=fmt.format(Math.round(data[key]));
   result.querySelector('[data-result="goal"]').textContent=data.goal;
   result.hidden=false;status.textContent='Estimación calculada. Consulta el resultado y sus límites.';result.focus();result.scrollIntoView({block:'center'});
  }
  calculator.querySelector('[data-calculate]').addEventListener('click',calculate);
  form.addEventListener('keydown',event=>{if(event.key==='Enter'&&event.target.tagName==='INPUT'){event.preventDefault();calculate();}});
 });
})();
