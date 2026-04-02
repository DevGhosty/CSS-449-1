document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('survey');
  const result = document.getElementById('result');
  const resetBtn = document.getElementById('resetBtn');
  const unitsMetric = document.getElementById('units_metric');
  const unitsImperial = document.getElementById('units_imperial');
  const metricGroup = document.querySelectorAll('.metric-only');
  const imperialGroup = document.querySelectorAll('.imperial-only');

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = readForm();
    const analysis = estimateLifespan(data);
    renderResult(analysis, data);
  });

  // Units toggle behavior
  function setUnitsUI(isMetric){
    metricGroup.forEach(el=>el.style.display = isMetric ? '' : 'none');
    imperialGroup.forEach(el=>el.style.display = isMetric ? 'none' : '');
  }

  unitsMetric.addEventListener('change', ()=> setUnitsUI(true));
  unitsImperial.addEventListener('change', ()=> setUnitsUI(false));

  resetBtn.addEventListener('click', ()=>{
    form.reset();
    result.innerHTML='';
  });

  function readForm(){
    const age = Number(document.getElementById('age').value || 0);
    const sex = document.getElementById('sex').value;
    const selectedUnits = document.querySelector('input[name="units"]:checked').value || 'metric';
    let height = Number(document.getElementById('height').value || 0);
    let weight = Number(document.getElementById('weight').value || 0);
    if(selectedUnits === 'imperial'){
      // convert ft/in and lb to cm/kg
      const ft = Number(document.getElementById('height_ft').value || 0);
      const inch = Number(document.getElementById('height_in').value || 0);
      const lb = Number(document.getElementById('weight_lb').value || 0);
      const totalInches = ft*12 + inch;
      height = Math.round(totalInches * 2.54 * 10)/10; // cm
      weight = Math.round(lb * 0.45359237 * 10)/10; // kg
    }
    const exercise = Number(document.getElementById('exercise').value || 0);
    const smoke = document.getElementById('smoke').value;
    const alcohol = document.getElementById('alcohol').value;
    const diet = document.getElementById('diet').value;
    const sleep = Number(document.getElementById('sleep').value || 0);
    const stress = document.getElementById('stress').value;
    const familyHistory = document.getElementById('familyHistory').value;
    const cond_diabetes = document.getElementById('cond_diabetes').checked;
    const cond_heart = document.getElementById('cond_heart').checked;
    const cond_cancer = document.getElementById('cond_cancer').checked;
    const cond_none = document.getElementById('cond_none').checked;
  // New fields
  const country = (document.getElementById('country') && document.getElementById('country').value) || '';
  const education = (document.getElementById('education') && document.getElementById('education').value) || 'secondary';
  const income = (document.getElementById('income') && document.getElementById('income').value) || 'middle';
  const urban = (document.getElementById('urban') && document.getElementById('urban').value) || 'urban';
  const occ_risk = (document.getElementById('occ_risk') && document.getElementById('occ_risk').checked) || false;
  const social = (document.getElementById('social') && document.getElementById('social').value) || 'some';
  const sedentary = Number(document.getElementById('sedentary') && document.getElementById('sedentary').value || 0);
  const regular_checkups = (document.getElementById('regular_checkups') && document.getElementById('regular_checkups').checked) || false;

    return {age,sex,height,weight,exercise,smoke,alcohol,diet,sleep,stress,familyHistory,cond_diabetes,cond_heart,cond_cancer,cond_none,units:selectedUnits,
      country,education,income,urban,occ_risk,social,sedentary,regular_checkups};
  }

  function estimateLifespan(d){
    // Base life expectancy by sex (simple assumption)
    let base = 80; // default
    if(d.sex === 'female') base = 83;
    if(d.sex === 'male') base = 79;

    const adjustments = [];

    // Sex modifier (already baked into base) - explain
    adjustments.push({label:'Sex baseline',value:0});

    // BMI
    let bmi = null;
    if(d.height>0 && d.weight>0){
      const m = d.height/100;
      bmi = d.weight/(m*m);
      if(bmi < 18.5) adjustments.push({label:`BMI ${bmi.toFixed(1)} (underweight)`, value:-1.5});
      else if(bmi < 25) adjustments.push({label:`BMI ${bmi.toFixed(1)} (healthy)`, value:+0.7});
      else if(bmi < 30) adjustments.push({label:`BMI ${bmi.toFixed(1)} (overweight)`, value:-1.0});
      else adjustments.push({label:`BMI ${bmi.toFixed(1)} (obese)`, value:-3.0});
    } else adjustments.push({label:'BMI (missing height/weight)',value:0});

    // Smoking
    if(d.smoke === 'never') adjustments.push({label:'Never smoked', value:+0.5});
    else if(d.smoke === 'former') adjustments.push({label:'Former smoker', value:-1.5});
    else if(d.smoke === 'light') adjustments.push({label:'Light smoker', value:-3.0});
    else if(d.smoke === 'heavy') adjustments.push({label:'Heavy smoker', value:-8.0});

    // Alcohol
    if(d.alcohol === 'none') adjustments.push({label:'No alcohol', value:+0.5});
    else if(d.alcohol === 'low') adjustments.push({label:'Low alcohol', value:+0.4});
    else if(d.alcohol === 'moderate') adjustments.push({label:'Moderate alcohol', value:0});
    else if(d.alcohol === 'high') adjustments.push({label:'High alcohol', value:-1.5});

    // Diet
    if(d.diet === 'poor') adjustments.push({label:'Poor diet', value:-2.0});
    else if(d.diet === 'average') adjustments.push({label:'Average diet', value:0});
    else if(d.diet === 'good') adjustments.push({label:'Good diet', value:+1.2});
    else if(d.diet === 'excellent') adjustments.push({label:'Excellent diet', value:+2.0});

    // Exercise
    if(d.exercise <= 0) adjustments.push({label:'No exercise', value:-2.0});
    else if(d.exercise <= 2) adjustments.push({label:`${d.exercise} days/week exercise`, value:-0.8});
    else if(d.exercise <=5) adjustments.push({label:`${d.exercise} days/week exercise`, value:+1.2});
    else adjustments.push({label:`${d.exercise} days/week exercise`, value:+1.6});

    // Sleep
    if(d.sleep < 6) adjustments.push({label:`Short sleep (${d.sleep} h)`, value:-1.5});
    else if(d.sleep <=8) adjustments.push({label:`Healthy sleep (${d.sleep} h)`, value:+0.5});
    else adjustments.push({label:`Long sleep (${d.sleep} h)`, value:-0.5});

    // Stress
    if(d.stress === 'low') adjustments.push({label:'Low stress', value:+0.5});
    else if(d.stress === 'medium') adjustments.push({label:'Medium stress', value:-0.5});
    else adjustments.push({label:'High stress', value:-1.5});

    // Family history
    if(d.familyHistory === 'yes') adjustments.push({label:'Family history of early death', value:-2.0});
    else if(d.familyHistory === 'unknown') adjustments.push({label:'Family history unknown', value:-0.5});

    // Chronic conditions
    let condPenalty = 0;
    const conditions = [];
    if(d.cond_none){
      // if 'none' is checked but others are also checked, ignore 'none'
      if(!(d.cond_diabetes || d.cond_heart || d.cond_cancer)){
        conditions.push('None');
      }
    }
    if(d.cond_diabetes){ conditions.push('Diabetes'); condPenalty -= 3.0; }
    if(d.cond_heart){ conditions.push('Heart disease'); condPenalty -= 5.0; }
    if(d.cond_cancer){ conditions.push('Cancer (history)'); condPenalty -= 4.0; }
    if(condPenalty !== 0) adjustments.push({label:`Chronic conditions: ${conditions.join(', ')}`, value:condPenalty});

  // Socioeconomic & environment effects (small adjustments)
  if(d.education === 'bachelor') adjustments.push({label:'Higher education', value:+0.6});
  if(d.education === 'postgrad') adjustments.push({label:'Postgraduate education', value:+1.0});
  if(d.income === 'high') adjustments.push({label:'Higher income', value:+0.8});
  if(d.income === 'low') adjustments.push({label:'Lower income', value:-0.8});
  if(d.urban === 'urban') adjustments.push({label:'Urban living (access to care)', value:+0.3});
  if(d.urban === 'rural') adjustments.push({label:'Rural living (reduced access)', value:-0.4});
  if(d.occ_risk) adjustments.push({label:'High-risk occupation', value:-2.0});

  // Social & sedentary
  if(d.social === 'often') adjustments.push({label:'Strong social connections', value:+1.0});
  if(d.social === 'lonely') adjustments.push({label:'Low social connections', value:-1.0});
  if(d.sedentary >= 10) adjustments.push({label:`Very sedentary (${d.sedentary} h/day)`, value:-2.0});
  else if(d.sedentary >= 7) adjustments.push({label:`Sedentary (${d.sedentary} h/day)`, value:-1.0});
  else adjustments.push({label:`Active (${d.sedentary} h/day sedentary)`, value:+0.2});
  if(d.regular_checkups) adjustments.push({label:'Regular medical check-ups', value:+0.6});


    // Sum adjustments
    const totalAdj = adjustments.reduce((s,a)=>s + (a.value || 0), 0);
    let estimated = base + totalAdj;

    // Small sex-based final tweak (female tends to have longer life expectancy historically)
    if(d.sex === 'female') estimated += 0; // already baked

    // Floor/ceiling: ensure not less than current age +1 and not crazy high
    if(estimated < d.age + 1) estimated = d.age + 1;
    if(estimated > 110) estimated = 110;

    return {
      base,
      adjustments,
      totalAdj: Number(totalAdj.toFixed(2)),
      estimated: Number(estimated.toFixed(1)),
      bmi: bmi ? Number(bmi.toFixed(1)) : null
    };
  }

  function renderResult(analysis, d){
    const yearsRemaining = Math.max(0, (analysis.estimated - d.age).toFixed(1));
    let html = `
      <div class="summary">
        <div class="estimate">Estimated age at death: ${analysis.estimated} years</div>
        <div class="explain">Years remaining (approx): <strong>${yearsRemaining}</strong></div>
        <div class="explain">Displayed values use <strong>${d.units === 'imperial' ? 'Imperial (converted)' : 'Metric'}</strong> units.</div>
      </div>
      <details open class="details">
        <summary>How this was calculated</summary>
        <div class="explain">
          <p>Base life expectancy used: <strong>${analysis.base}</strong> years (sex baseline).</p>
          <p>Modifiers applied:</p>
          <ul>
            ${analysis.adjustments.map(a=>`<li>${escapeHtml(a.label)}: ${a.value > 0 ? '+'+a.value : a.value} years</li>`).join('')}
          </ul>
          <p><strong>Total adjustment:</strong> ${analysis.totalAdj > 0 ? '+'+analysis.totalAdj : analysis.totalAdj} years</p>
        </div>
      </details>
      <div class="advice">
        <h3>Quick tips to improve life expectancy</h3>
        <ul>
          <li>Stop smoking — it has one of the largest negative impacts.</li>
          <li>Maintain a healthy weight and exercise regularly.</li>
          <li>Eat a balanced diet rich in whole foods and manage stress.</li>
          <li>Manage chronic conditions with your healthcare provider.</li>
        </ul>
      </div>
    `;

    result.innerHTML = html;
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"
    }[c]));
  }

  // Animated background blobs: random smooth movement
  (function animateBlobs(){
    const blobs = Array.from(document.querySelectorAll('.visuals .blob'));
    if(!blobs.length) return;

    function randomRange(min,max){ return Math.random()*(max-min)+min; }

    function moveOnce(){
      blobs.forEach((b, i)=>{
        // compute a random translate range based on viewport size
        const vx = window.innerWidth;
        const vy = window.innerHeight;
        // range in px: move within +/- 15% of viewport in x/y
        const maxX = Math.max(150, vx * 0.18);
        const maxY = Math.max(100, vy * 0.14);
        const tx = Math.round(randomRange(-maxX, maxX));
        const ty = Math.round(randomRange(-maxY, maxY));
        const rot = Math.round(randomRange(-12,12));
        const scale = randomRange(0.85, 1.2);
        const duration = randomRange(8, 16);
        b.style.transition = `transform ${duration}s cubic-bezier(.2,.8,.2,1)`;
        b.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`;
        // tweak opacity slightly per move to keep it dynamic
        b.style.opacity = (0.45 + Math.random()*0.25).toFixed(2);
      });
    }

    // initial positioning small offset so movement starts from base
    blobs.forEach((b,i)=>{
      b.style.transform = 'translate(0,0) scale(1)';
    });

    // move first time after a short delay
    setTimeout(moveOnce, 400);

    // schedule periodic moves every 6-9 seconds
    setInterval(moveOnce, 6000 + Math.floor(Math.random()*3500));

    // recompute when resizing to keep ranges sensible
    window.addEventListener('resize', ()=> moveOnce());
  })();
});
