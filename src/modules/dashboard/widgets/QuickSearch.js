export function QuickSearch({ data }) {
  return `
    <div class="widget widget-search">
      <div class="widget-header">
        <span class="widget-icon">🔍</span>
        <span class="widget-title">Quick Search</span>
      </div>
      <div class="widget-body">
        <input type="text" id="quickSearchInput" placeholder="Enter plate or QR code..." />
        <button id="quickSearchBtn" class="btn-primary">Search</button>
        <div id="quickSearchResults"></div>
      </div>
    </div>
  `;
}

export function initQuickSearch() {
  const input = document.getElementById('quickSearchInput');
  const btn = document.getElementById('quickSearchBtn');
  
  if (btn && input) {
    btn.addEventListener('click', () => {
      const query = input.value.trim();
      if (query) {
        console.log('Searching for:', query);
        // TODO: Implement search
      }
    });
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btn.click();
      }
    });
  }
}
