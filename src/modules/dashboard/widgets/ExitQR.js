export function ExitQR({ data }) {
  const visit = data?.currentVisit;
  
  if (!visit || !visit.hasActiveVisit) {
    return `
      <div class="widget widget-qr" data-widget="ExitQR">
        <div class="widget-header">
          <span class="widget-icon">📷</span>
          <span class="widget-title">Exit QR</span>
        </div>
        <div class="widget-body">
          <div class="qr-empty">Start a visit to generate exit QR</div>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="widget widget-qr" data-widget="ExitQR">
      <div class="widget-header">
        <span class="widget-icon">📷</span>
        <span class="widget-title">Exit QR</span>
      </div>
      <div class="widget-body">
        <div class="qr-code">
          <div style="background:white;padding:20px;border-radius:12px;text-align:center;">
            <div style="font-size:48px;margin-bottom:8px;">🚪</div>
            <div style="color:#000;font-size:12px;font-weight:600;">${visit.session?.vehiclePlate || 'Vehicle'}</div>
            <div style="color:#666;font-size:10px;">Scan this QR at the gate to exit</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
