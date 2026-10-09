/* Shared by index.html and calculadora.html. No network or storage. */
(function(root){
 'use strict';
 const ACTIVITY=[1.2,1.375,1.55,1.725,1.9];
 const GOALS={mantenimiento:{factor:1,protein:2,label:'Mantenimiento'},deficit:{factor:0.8,protein:2.2,label:'Déficit'},superavit:{factor:1.15,protein:1.8,label:'Superávit'}};
 function calculate(data){
  const errors={};
  const ranges={age:[19,78],weight:[35,200],height:[130,220]};
  const parsed={};
  for(const key of Object.keys(ranges)){
   const raw=data[key];const n=typeof raw==='number'?raw:(typeof raw==='string'&&raw.trim()!==''?Number(raw):NaN);parsed[key]=n;
   const [min,max]=ranges[key];
   if(!Number.isFinite(n)||n<min||n>max||(key==='age'&&!Number.isInteger(n)))errors[key]=key==='age'?'Ingresa una edad entera entre 19 y 78 años.':key==='weight'?'Ingresa un peso entre 35 y 200 kg.':'Ingresa una estatura entre 130 y 220 cm.';
  }
  if(!['hombre','mujer'].includes(data.sex))errors.sex='Selecciona una opción válida.';
  const activity=Number(data.activity);
  if(!ACTIVITY.includes(activity))errors.activity='Selecciona una actividad válida.';
  if(!Object.prototype.hasOwnProperty.call(GOALS,data.goal))errors.goal='Selecciona un objetivo válido.';
  if(Object.keys(errors).length)return {ok:false,errors};
  const {age,weight,height}=parsed;
  const goal=GOALS[data.goal];
  const bmr=10*weight+6.25*height-5*age+(data.sex==='hombre'?5:-161);
  const tdee=bmr*activity,target=tdee*goal.factor;
  const protein=weight*goal.protein,proteinKcal=protein*4,fatKcal=target*.25,fat=fatKcal/9;
  const carbKcal=target-proteinKcal-fatKcal;
  if(!Number.isFinite(target)||bmr<=0||target<=0||carbKcal<0)return {ok:false,errors:{},message:'Estos datos no permiten un reparto orientativo coherente. No se muestra un resultado; revisa los datos o solicita una evaluación individual.'};
  return {ok:true,bmr,tdee,target,protein,fat,carbs:carbKcal/4,goal:goal.label};
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={calculate};
 root.FitnessCalculator={calculate};
})(typeof window==='undefined'?globalThis:window);
