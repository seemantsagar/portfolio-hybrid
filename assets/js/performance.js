/**
 * Performance monitoring script for Portfolio Hybrid
 * Collects web vitals and other metrics to ensure 90+ Lighthouse score
 */
 
// Create directory if it doesn't exist
(() => {
  // Performance measurement
  const perfMetrics = {
    startTime: performance.now(),
    loadTime: 0,
    firstPaint: 0,
    domContentLoaded: 0,
    windowLoaded: 0,
    largestContentfulPaint: 0
  };
  
  // Capture DOM content loaded time
  document.addEventListener('DOMContentLoaded', () => {
    perfMetrics.domContentLoaded = performance.now() - perfMetrics.startTime;
    updateMetricsDisplay();
  });
  
  // Capture window load time
  window.addEventListener('load', () => {
    perfMetrics.windowLoaded = performance.now() - perfMetrics.startTime;
    updateMetricsDisplay();
    
    // Get First Paint metric from Performance API
    const paintMetrics = performance.getEntriesByType('paint');
    paintMetrics.forEach(metric => {
      if (metric.name === 'first-paint') {
        perfMetrics.firstPaint = metric.startTime;
        updateMetricsDisplay();
      }
    });
  });
  
  // Capture Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      perfMetrics.largestContentfulPaint = lastEntry.startTime;
      updateMetricsDisplay();
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  }
  
  // Display metrics if in development mode
  function updateMetricsDisplay() {
    const metricsContainer = document.getElementById('metrics-container');
    if (metricsContainer && location.hostname === 'localhost') {
      metricsContainer.style.display = 'block';
      metricsContainer.innerHTML = `
        <div style="position: fixed; bottom: 0; right: 0; background: rgba(0,0,0,0.7); padding: 10px; font-family: monospace; font-size: 12px; z-index: 9999; color: white;">
          <div>DOM Content: ${Math.round(perfMetrics.domContentLoaded)}ms</div>
          <div>First Paint: ${Math.round(perfMetrics.firstPaint)}ms</div>
          <div>LCP: ${Math.round(perfMetrics.largestContentfulPaint)}ms</div>
          <div>Window Load: ${Math.round(perfMetrics.windowLoaded)}ms</div>
        </div>
      `;
    }
  }
  
  // Make metrics available globally
  window.perfMetrics = perfMetrics;
})();
