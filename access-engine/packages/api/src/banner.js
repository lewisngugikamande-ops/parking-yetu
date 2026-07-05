const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function printBanner(config) {
  const { port, repositoryProvider, authProvider, firestoreEmulator, metricsPort } = config;
  const localIP = getLocalIP();
  
  const banner = `
╔══════════════════════════════════════════════════════════════════╗
║                   ACCESS ENGINE OS                              ║
╠══════════════════════════════════════════════════════════════════╣
║  API              http://localhost:${port}                      ║
║  API (Network)    http://${localIP}:${port}                     ║
║  Health           http://localhost:${port}/health               ║
║  Metrics          ${metricsPort ? `http://localhost:${metricsPort}/metrics` : 'disabled'}  
║  Repository       ${repositoryProvider}                        
║  Auth             ${authProvider}                              
║  Firestore        ${firestoreEmulator || 'not configured'}     
╚══════════════════════════════════════════════════════════════════╝
`;
  
  console.log(banner);
}

module.exports = { printBanner };
