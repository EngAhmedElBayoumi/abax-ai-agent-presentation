/*
 * Presentation interaction and charts definitions
 */

// Wrap main logic in DOMContentLoaded to ensure elements exist
window.addEventListener('DOMContentLoaded', () => {
  // Keep track of current slide index
  let currentIndex = 0;
  const slidesContainer = document.querySelector('.slides');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const progressBar = document.querySelector('.progress-bar');
  const totalSlides = slides.length;

  // Set background images on slides using data-bg attribute
  slides.forEach(slide => {
    const bg = slide.getAttribute('data-bg');
    if (bg) {
      slide.style.backgroundImage = `url('${bg}')`;
    }
  });
  // Set container width so that slides align horizontally
  slidesContainer.style.width = `${slides.length * 100}vw`;

  // Initialize charts storage to avoid re-creating on each slide visit
  const charts = {};

  // Show slide by index
  function showSlide(index) {
    // Clamp index within bounds
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    currentIndex = index;
    const offset = index * 100;
    slidesContainer.style.transform = `translateX(${offset}vw)`;
    // Update progress bar
    const progressPercent = ((index) / (totalSlides - 1)) * 100;
    progressBar.style.width = progressPercent + '%';
    // Build chart if not created on summary slides only
    switch (index) {
      case 1: // فهرس المحتويات
        if (!charts.agenda) createAgendaChart();
        break;
      case 2: // مقدمة وحلقة ReAct
        if (!charts.react) createReactChart();
        break;
      case 3: // وكيل العمليات (ملخص)
        if (!charts.operations) createOperationsChart();
        break;
      case 5: // وكيل المالية (ملخص)
        if (!charts.finance) createFinanceChart();
        break;
      case 7: // وكيل التسعير (ملخص)
        if (!charts.pricing) createPricingChart();
        break;
      case 9: // وكيل المخزون (ملخص)
        if (!charts.inventory) createInventoryChart();
        break;
      case 11: // وكيل التوصيات (ملخص)
        if (!charts.recommendation) createRecommendationChart();
        break;
      case 13: // وكيل الحجوزات (ملخص)
        if (!charts.reservation) createReservationChart();
        break;
      case 15: // وكيل إعادة التسكين (ملخص)
        if (!charts.relocation) createRelocationChart();
        break;
      case 17: // وكيل إعادة التخطيط (ملخص)
        if (!charts.replan) createReplanChart();
        break;
      case 19: // المساعد الذكي (ملخص)
        if (!charts.copilot) createCopilotChart();
        break;
      case 21: // تنسيق الوكلاء المتعددين
        if (!charts.multi) createMultiChart();
        break;
      default:
        // لا يوجد مخطط لهذه الشريحة
        break;
    }
  }

  // Event listeners for navigation buttons
  document.querySelector('.nav-button.prev').addEventListener('click', () => {
    showSlide(currentIndex - 1);
  });
  document.querySelector('.nav-button.next').addEventListener('click', () => {
    showSlide(currentIndex + 1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      showSlide(currentIndex - 1); // Previous in RTL
    } else if (e.key === 'ArrowLeft') {
      showSlide(currentIndex + 1); // Next in RTL
    }
  });

  // Show first slide
  showSlide(0);
});

/**
 * Chart creation functions
 * Each function uses Canvas API to draw simple charts without external libraries.
 */

function setCanvasSize(canvas) {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  return ctx;
}

function createAgendaChart() {
  const canvas = document.getElementById('agendaChart');
  const ctx = setCanvasSize(canvas);
  const labels = ['العمليات','المالية','التسعير','المخزون','التوصيات','الحجوزات','إعادة التسكين','إعادة التخطيط','المساعد','التنسيق'];
  const data = [9,8,8,8,9,9,7,8,7,4];
  const maxVal = Math.max(...data);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const barWidth = (width - 100) / data.length;
  // Draw axes
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 10);
  ctx.lineTo(50, height - 30);
  ctx.lineTo(width - 30, height - 30);
  ctx.stroke();
  // Draw bars
  data.forEach((val, i) => {
    const x = 50 + i * barWidth;
    const barHeight = ((height - 60) * val) / maxVal;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(248, 200, 0, 0.8)' : 'rgba(198, 160, 0, 0.8)';
    ctx.fillRect(x + 5, (height - 30) - barHeight, barWidth - 10, barHeight);
    // Label
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '10px Cairo, sans-serif';
    ctx.save();
    ctx.translate(x + barWidth / 2, height - 15);
    ctx.rotate(-Math.PI / 4);
    ctx.textAlign = 'right';
    ctx.fillText(labels[i], 0, 0);
    ctx.restore();
  });
  charts.agenda = true;
}

function createReactChart() {
  // Not drawing chart here; the flow diagram already illustrates ReAct
  charts.react = true;
}

function createOperationsChart() {
  const canvas = document.getElementById('operationsChart');
  const ctx = setCanvasSize(canvas);
  const labels = ['تأكيد الحجوزات','تواصل وتعيين','إدارة الشكاوى','مراقبة الرحلات'];
  const data = [30, 20, 25, 25];
  const colors = ['#f8c800','#c6a000','#f8c80080','#c6a00080'];
  const total = data.reduce((a,b) => a + b, 0);
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  const radius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.35;
  let startAngle = -Math.PI / 2;
  data.forEach((val, i) => {
    const endAngle = startAngle + (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    startAngle = endAngle;
  });
  // Inner hole
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.5, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fill();
  // Legend
  const legendX = canvas.clientWidth - 160;
  let legendY = 20;
  labels.forEach((lab, i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(legendX, legendY, 12, 12);
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    ctx.fillText(lab, legendX + 18, legendY + 10);
    legendY += 18;
  });
  charts.operations = true;
}

function createFinanceChart() {
  const canvas = document.getElementById('financeChart');
  const ctx = setCanvasSize(canvas);
  const labels = ['الفواتير والعمولات','الدفعات والاحتيال','التسوية','توقع التدفقات'];
  const data = [30, 25, 25, 20];
  const maxVal = Math.max(...data);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const barHeight = (height - 40) / data.length;
  data.forEach((val, i) => {
    const y = 20 + i * barHeight;
    const barLen = ((width - 160) * val) / maxVal;
    ctx.fillStyle = i % 2 === 0 ? '#f8c800' : '#c6a000';
    ctx.fillRect(130, y + 5, barLen, barHeight - 10);
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(labels[i], 120, y + barHeight / 2 + 4);
    ctx.textAlign = 'left';
    ctx.fillText(val + '%', 130 + barLen + 5, y + barHeight / 2 + 4);
  });
  charts.finance = true;
}

function createPricingChart() {
  const canvas = document.getElementById('pricingChart');
  const ctx = setCanvasSize(canvas);
  const days = Array.from({ length: 30 }, (_, i) => 30 - i);
  const recommended = days.map(d => 100 + 30 * Math.exp(-d / 10));
  const competitor = days.map(d => 95 + 25 * Math.exp(-d / 12));
  const current = days.map(() => 100);
  const allVals = recommended.concat(competitor).concat(current);
  const maxVal = Math.max(...allVals);
  const minVal = Math.min(...allVals);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const margin = 40;
  const plotWidth = width - 2 * margin;
  const plotHeight = height - 2 * margin;
  // Draw axes
  ctx.strokeStyle = '#555';
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, margin + plotHeight);
  ctx.lineTo(margin + plotWidth, margin + plotHeight);
  ctx.stroke();
  // Helper to map value
  const mapX = (i) => margin + (i / (days.length - 1)) * plotWidth;
  const mapY = (val) => margin + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;
  // Draw lines
  function drawLine(dataArray, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    dataArray.forEach((val, i) => {
      const x = mapX(i);
      const y = mapY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  drawLine(recommended, '#f8c800');
  drawLine(competitor, '#c6a000');
  // Draw dashed line for current
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.setLineDash([5,5]);
  drawLine(current, 'rgba(255,255,255,0.5)');
  ctx.setLineDash([]);
  // Draw legend
  const legendX = width - 180;
  let legendY = margin;
  const legendItems = [
    { label: 'السعر الموصى به', color: '#f8c800' },
    { label: 'سعر المنافس', color: '#c6a000' },
    { label: 'السعر الحالي', color: 'rgba(255,255,255,0.5)' }
  ];
  legendItems.forEach(item => {
    ctx.fillStyle = item.color;
    ctx.fillRect(legendX, legendY, 12, 12);
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    ctx.fillText(item.label, legendX + 18, legendY + 10);
    legendY += 18;
  });
  charts.pricing = true;
}

function createInventoryChart() {
  const canvas = document.getElementById('inventoryChart');
  const ctx = setCanvasSize(canvas);
  const categories = ['طيران','فنادق','أنشطة','رحلات'];
  const available = [200,150,80,120];
  const sold = [160,100,50,90];
  const maxVal = Math.max(...available.concat(sold));
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const groupWidth = (width - 100) / categories.length;
  const barWidth = groupWidth / 3;
  categories.forEach((cat, i) => {
    const xGroup = 50 + i * groupWidth;
    // Available bar
    const avHeight = ((height - 60) * available[i]) / maxVal;
    ctx.fillStyle = '#f8c800';
    ctx.fillRect(xGroup + barWidth, (height - 30) - avHeight, barWidth - 4, avHeight);
    // Sold bar
    const soldHeight = ((height - 60) * sold[i]) / maxVal;
    ctx.fillStyle = '#c6a000';
    ctx.fillRect(xGroup + 2 * barWidth, (height - 30) - soldHeight, barWidth - 4, soldHeight);
    // Labels
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cat, xGroup + groupWidth / 2, height - 12);
  });
  // Legend
  ctx.fillStyle = '#f8c800';
  ctx.fillRect(width - 160, 20, 12, 12);
  ctx.fillStyle = '#f5f5f5';
  ctx.font = '12px Cairo, sans-serif';
  ctx.fillText('المتاح', width - 140, 30);
  ctx.fillStyle = '#c6a000';
  ctx.fillRect(width - 160, 40, 12, 12);
  ctx.fillStyle = '#f5f5f5';
  ctx.fillText('المباع', width - 140, 50);
  charts.inventory = true;
}

function createRecommendationChart() {
  const canvas = document.getElementById('recommendationChart');
  const ctx = setCanvasSize(canvas);
  const labels = ['رحلات إضافية','ترقيات الفنادق','منتجات أخرى'];
  const data = [45,35,20];
  const colors = ['#f8c800','#c6a000','#f8c80080'];
  const total = data.reduce((a,b) => a + b, 0);
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  const radius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.35;
  let angle = -Math.PI / 2;
  data.forEach((val,i) => {
    const end = angle + (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    angle = end;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.5, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fill();
  // Legend
  let ly = 20;
  labels.forEach((lab,i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(canvas.clientWidth - 160, ly, 12, 12);
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    ctx.fillText(lab, canvas.clientWidth - 140, ly + 10);
    ly += 18;
  });
  charts.recommendation = true;
}

function createReservationChart() {
  const canvas = document.getElementById('reservationChart');
  const ctx = setCanvasSize(canvas);
  const labels = ['إنشاء','تعديل','إلغاء'];
  const data = [50,30,20];
  const colors = ['#f8c800','#c6a000','#f8c80080'];
  const total = data.reduce((a,b) => a+b,0);
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  const radius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.35;
  let ang = -Math.PI / 2;
  data.forEach((val,i) => {
    const end = ang + (val/total)*2*Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,radius,ang,end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ang = end;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, radius*0.5, 0, 2*Math.PI);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fill();
  // Legend
  let ly = 20;
  labels.forEach((lab,i) => {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(canvas.clientWidth - 160, ly, 12, 12);
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    ctx.fillText(lab, canvas.clientWidth - 140, ly + 10);
    ly += 18;
  });
  charts.reservation = true;
}

function createRelocationChart() {
  const canvas = document.getElementById('relocationChart');
  const ctx = setCanvasSize(canvas);
  const labels = ['رحلات جوية','فنادق','أنشطة','تعويض'];
  const data = [40,35,15,10];
  const maxVal = Math.max(...data);
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  const radius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.35;
  const angleStep = (2 * Math.PI) / data.length;
  // Draw spider grid
  for (let ring=1; ring<=4; ring++) {
    const r = (radius / 4) * ring;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.moveTo(cx + r, cy);
    for(let j=1; j<=data.length; j++){
      const angle = -Math.PI/2 + j*angleStep;
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    }
    ctx.closePath();
    ctx.stroke();
  }
  // Draw axes
  labels.forEach((lab, i) => {
    const angle = -Math.PI/2 + i * angleStep;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.stroke();
    // Label
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    const labelX = cx + (radius + 10) * Math.cos(angle);
    const labelY = cy + (radius + 10) * Math.sin(angle);
    ctx.textAlign = labelX < cx ? 'right' : 'left';
    ctx.textBaseline = labelY < cy ? 'bottom' : 'top';
    ctx.fillText(lab, labelX, labelY);
  });
  // Plot data polygon
  ctx.beginPath();
  data.forEach((val, i) => {
    const angle = -Math.PI/2 + i * angleStep;
    const r = (val / maxVal) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(248, 200, 0, 0.3)';
  ctx.fill();
  ctx.strokeStyle = '#f8c800';
  ctx.lineWidth = 2;
  ctx.stroke();
  charts.relocation = true;
}

function createReplanChart() {
  const canvas = document.getElementById('replanChart');
  const ctx = setCanvasSize(canvas);
  const labels = ['إعادة جدولة الأنشطة','تغيير الفندق','حساب التكلفة','موافقة العميل'];
  const data = [30,25,25,20];
  const maxVal = Math.max(...data);
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  const radius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.35;
  const angleStep = (2 * Math.PI) / data.length;
  // Grid
  for (let ring=1; ring<=4; ring++) {
    const r = (radius / 4) * ring;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.moveTo(cx + r, cy);
    for(let j=1; j<=data.length; j++){
      const angle = -Math.PI/2 + j*angleStep;
      ctx.lineTo(cx + r*Math.cos(angle), cy + r*Math.sin(angle));
    }
    ctx.closePath();
    ctx.stroke();
  }
  // Axes and labels
  labels.forEach((lab,i) => {
    const angle = -Math.PI/2 + i*angleStep;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx + radius*Math.cos(angle), cy + radius*Math.sin(angle));
    ctx.stroke();
    // Label
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    const lx = cx + (radius + 10) * Math.cos(angle);
    const ly = cy + (radius + 10) * Math.sin(angle);
    ctx.textAlign = lx < cx ? 'right' : 'left';
    ctx.textBaseline = ly < cy ? 'bottom' : 'top';
    ctx.fillText(lab, lx, ly);
  });
  // Polygon
  ctx.beginPath();
  data.forEach((val,i) => {
    const angle = -Math.PI/2 + i*angleStep;
    const r = (val/maxVal)*radius;
    const x = cx + r*Math.cos(angle);
    const y = cy + r*Math.sin(angle);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(198, 160, 0, 0.3)';
  ctx.fill();
  ctx.strokeStyle = '#c6a000';
  ctx.lineWidth = 2;
  ctx.stroke();
  charts.replan = true;
}

function createCopilotChart() {
  const canvas = document.getElementById('copilotChart');
  const ctx = setCanvasSize(canvas);
  const labels = ['الإجابة على الأسئلة','مراقبة المؤشرات','كشف الشذوذات','تنسيق الإجراءات'];
  const data = [35,30,20,15];
  const maxVal = Math.max(...data);
  const cx = canvas.clientWidth / 2;
  const cy = canvas.clientHeight / 2;
  const radius = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.35;
  const angleStep = (2 * Math.PI) / data.length;
  // Grid
  for(let ring=1; ring<=4; ring++){
    const r = (radius/4)*ring;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.moveTo(cx + r, cy);
    for(let j=1; j<=data.length; j++){
      const ang = -Math.PI/2 + j*angleStep;
      ctx.lineTo(cx + r*Math.cos(ang), cy + r*Math.sin(ang));
    }
    ctx.closePath();
    ctx.stroke();
  }
  // Axes and labels
  labels.forEach((lab,i) => {
    const ang = -Math.PI/2 + i*angleStep;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx + radius*Math.cos(ang), cy + radius*Math.sin(ang));
    ctx.stroke();
    // Label
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    const lx = cx + (radius + 10) * Math.cos(ang);
    const ly = cy + (radius + 10) * Math.sin(ang);
    ctx.textAlign = lx < cx ? 'right' : 'left';
    ctx.textBaseline = ly < cy ? 'bottom' : 'top';
    ctx.fillText(lab, lx, ly);
  });
  // Data polygon
  ctx.beginPath();
  data.forEach((val,i) => {
    const ang = -Math.PI/2 + i*angleStep;
    const r = (val/maxVal)*radius;
    const x = cx + r*Math.cos(ang);
    const y = cy + r*Math.sin(ang);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(248,200,0,0.3)';
  ctx.fill();
  ctx.strokeStyle = '#f8c800';
  ctx.lineWidth = 2;
  ctx.stroke();
  charts.copilot = true;
}

function createMultiChart() {
  const canvas = document.getElementById('multiChart');
  const ctx = setCanvasSize(canvas);
  const labels = ['تغير السعر','مزامنة المخزون','تحديثات المالية','تفعيل توصيات'];
  const data = [20,15,12,8];
  const maxVal = Math.max(...data);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const barWidth = (width - 100) / data.length;
  data.forEach((val,i) => {
    const x = 50 + i * barWidth;
    const barHeight = ((height - 60) * val) / maxVal;
    ctx.fillStyle = i % 2 === 0 ? '#f8c800' : '#c6a000';
    ctx.fillRect(x + 5, (height - 30) - barHeight, barWidth - 10, barHeight);
    // Label
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '12px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barWidth / 2, height - 10);
  });
  charts.multi = true;
}