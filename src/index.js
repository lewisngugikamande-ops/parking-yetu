import { auth, db } from './core/firebase/config.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { ParkingService } from './modules/parking/service.js';

// ============================================
// DOM REFS
// ============================================
const $ = (id) => document.getElementById(id);

// ============================================
// APP STATE
// ============================================
let currentUser = null;
let currentUserRole = null;
let currentOrganizationId = 'org_church_a';
let currentLocation = 'church_a';
let parkingService = null;

// ============================================
// HELPER FUNCTIONS
// ============================================
function showError(message) {
  const errorDiv = $('errorMsg');
  errorDiv.textContent = '❌ ' + message;
  errorDiv.style.display = 'block';
  setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
}

function showSuccess(message) {
  const successDiv = $('successMsg');
  successDiv.textContent = '✅ ' + message;
  successDiv.style.display = 'block';
  setTimeout(() => { errorDiv.style.display = 'none'; }, 4000);
}

// ============================================
// AUTH FUNCTIONS
// ============================================
window.handleLogin = async function() {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const email = $('loginEmail').value.trim();
  const password = $('loginPassword').value.trim();
  const errorDiv = $('loginError');
  errorDiv.classList.remove('show');

  if (!email || !password) {
    errorDiv.textContent = 'Please fill in all fields';
    errorDiv.classList.add('show');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.add('show');
  }
};

window.handleRegister = async function() {
  const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
  const { setDoc } = await import('firebase/firestore');
  const name = $('registerName').value.trim();
  const email = $('registerEmail').value.trim();
  const password = $('registerPassword').value.trim();
  const role = $('registerRole').value;
  const errorDiv = $('registerError');
  errorDiv.classList.remove('show');

  if (!name || !email || !password) {
    errorDiv.textContent = 'Please fill in all fields';
    errorDiv.classList.add('show');
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = 'Password must be at least 6 characters';
    errorDiv.classList.add('show');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      role: role,
      organizationId: currentOrganizationId,
      locationId: currentLocation,
      isActive: true,
      createdAt: new Date()
    });
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.add('show');
  }
};

window.switchAuthMode = function(mode) {
  const loginForm = $('loginForm');
  const registerForm = $('registerForm');
  const authSubtitle = $('authSubtitle');
  if (mode === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    authSubtitle.textContent = 'Welcome Back';
    $('loginError').classList.remove('show');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    authSubtitle.textContent = 'Create Account';
    $('registerError').classList.remove('show');
  }
};

window.handleLogout = async function() {
  try {
    await signOut(auth);
    window.location.reload();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// ============================================
// PARK CAR
// ============================================
window.parkCar = async function() {
  const plateInput = $('plateInput').value;
  const driverName = $('driverNameInput').value.trim();
  const driverPhone = $('driverPhoneInput').value.trim();
  const driverId = $('driverIdInput').value.trim();
  const entryGate = $('gateSelect').value;
  const selectedVehicleType = $('selectedVehicleType').value;
  const isVIP = $('vipToggle').textContent.includes('Yes');
  const isStaff = $('staffToggle').textContent.includes('Yes');

  if (!plateInput || !driverName || !driverPhone) {
    showError('Please fill in all fields');
    return;
  }

  try {
    $('loadingSpinner').style.display = 'block';
    
    const result = await parkingService.enterVehicle(
      { licensePlate: plateInput, type: selectedVehicleType },
      { name: driverName, phone: driverPhone, id: driverId, isVIP, isStaff },
      entryGate,
      currentUser?.uid
    );

    // Generate QR
    const qrData = result.session.vehicleSnapshot.plate + '|' + new Date().toISOString() + '|' + currentLocation + '|' + entryGate;
    const qrCard = $('qrCard');
    const qrDisplay = $('qrDisplay');
    qrCard.style.display = 'block';
    qrDisplay.innerHTML = `
      <img src="https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=250">
      <div style="margin-top:10px;font-family:Orbitron,monospace;font-size:22px;font-weight:700;letter-spacing:1px;">
        ${result.session.vehicleSnapshot.plate}
      </div>
      <div style="font-size:13px;color:var(--text-muted);">
        👤 ${driverName} • 📱 ${driverPhone}
      </div>
      <div style="font-size:13px;color:var(--text-muted);">
        📍 ${currentLocation} • 🚪 ${entryGate}
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:5px;opacity:0.6;">
        🔑 ${result.correlationId}
      </div>
    `;

    // Reset form
    $('plateInput').value = '';
    $('driverNameInput').value = '';
    $('driverPhoneInput').value = '';
    $('driverIdInput').value = '';
    $('vipToggle').textContent = '⭐ VIP: No';
    $('staffToggle').textContent = '👤 Staff: No';

    showSuccess('✅ ' + result.session.vehicleSnapshot.plate + ' checked in!');
    $('loadingSpinner').style.display = 'none';
  } catch (error) {
    showError(error.message);
    $('loadingSpinner').style.display = 'none';
  }
};

// ============================================
// TOGGLES
// ============================================
window.toggleVIP = function() {
  const btn = $('vipToggle');
  const isVIP = btn.textContent.includes('Yes');
  btn.textContent = '⭐ VIP: ' + (isVIP ? 'No' : 'Yes');
  btn.style.borderColor = isVIP ? 'var(--glass-border)' : '#FFD700';
  btn.style.color = isVIP ? 'var(--text-secondary)' : '#FFD700';
};

window.toggleStaff = function() {
  const btn = $('staffToggle');
  const isStaff = btn.textContent.includes('Yes');
  btn.textContent = '👤 Staff: ' + (isStaff ? 'No' : 'Yes');
  btn.style.borderColor = isStaff ? 'var(--glass-border)' : '#00D4FF';
  btn.style.color = isStaff ? 'var(--text-secondary)' : '#00D4FF';
};

window.selectVehicleType = function(btn) {
  document.querySelectorAll('.vehicle-grid button').forEach(b => b.classList.remove('vehicle-active'));
  btn.classList.add('vehicle-active');
  $('selectedVehicleType').value = btn.dataset.type;
};

// ============================================
// SEARCH FOR EXIT
// ============================================
window.searchForExit = async function() {
  const plate = $('exitPlateInput').value.toUpperCase().trim();
  if (!plate) {
    showError('Enter a plate number');
    return;
  }

  try {
    $('loadingSpinner').style.display = 'block';
    const car = await parkingService.findVehicleForExit(plate);
    
    if (!car) {
      showError('Car ' + plate + ' not found');
      $('loadingSpinner').style.display = 'none';
      return;
    }

    const duration = calculateDuration(car.entryTime);
    const carPlate = car.vehicleSnapshot?.plate || car.plate || 'N/A';

    $('exitPlateDisplay').textContent = carPlate;
    $('exitTimeDisplay').textContent = formatTime(car.entryTime);
    $('exitGateDisplay').textContent = car.entryGate || 'N/A';
    $('exitVehicleDisplay').textContent = car.vehicleSnapshot?.type || car.vehicleType || 'Sedan';
    $('exitDriverDisplay').textContent = car.driverName || 'N/A';
    $('exitPhoneDisplay').textContent = car.driverPhone || 'N/A';
    $('exitDurationDisplay').textContent = duration.text + ' (' + duration.minutes + ' mins)';

    $('exitVIPRow').style.display = car.isVIP ? 'flex' : 'none';
    $('exitStaffRow').style.display = car.isStaff ? 'flex' : 'none';
    $('exitPreview').style.display = 'block';
    $('exitPreview').dataset.sessionId = car.id;
    $('exitPreview').dataset.plate = carPlate;

    showSuccess('🔍 Car found! Duration: ' + duration.text);
    $('loadingSpinner').style.display = 'none';
  } catch (error) {
    showError(error.message);
    $('loadingSpinner').style.display = 'none';
  }
};

// ============================================
// INIT APP
// ============================================
async function initApp() {
  
  // Initialize parking service
  parkingService = new ParkingService(currentOrganizationId, currentLocation);
  
  // Load initial data
  const sessions = await parkingService.getActiveSessions();
  updateParkedCars(sessions);
  
  // Subscribe to real-time updates
  parkingService.subscribeToActive((sessions) => {
    updateParkedCars(sessions);
  });
}

function updateParkedCars(cars) {
  const logDiv = $('logDisplay');
  if (!cars || cars.length === 0) {
    logDiv.innerHTML = '📋 No cars parked';
    return;
  }

  let html = '🚗 <b>' + cars.length + ' cars parked</b><br><br>';
  cars.forEach(c => {
    const duration = calculateDuration(c.entryTime);
    const plate = c.vehicleSnapshot?.plate || c.plate || 'N/A';
    html += '<div class="log-item">';
    html += '<div class="plate">' + plate + '</div>';
    html += '<div class="time">🕐 ' + formatTime(c.entryTime) + '</div>';
    html += '<div class="time">👤 ' + (c.driverName || 'N/A') + '</div>';
    html += '<div class="duration">⏱️ ' + duration.text + '</div>';
    html += '</div>';
  });
  logDiv.innerHTML = html;
}

// ============================================
// AUTH STATE OBSERVER
// ============================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        currentUserRole = userData.role || 'driver';
        currentLocation = userData.locationId || 'church_a';
        currentOrganizationId = userData.organizationId || 'org_church_a';
        
        $('userDisplayName').textContent = userData.name || user.displayName || 'User';
        $('userRoleBadge').textContent = currentUserRole.toUpperCase();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    
    $('authScreen').style.display = 'none';
    $('appContainer').style.display = 'block';
    await initApp();
  } else {
    $('authScreen').style.display = 'flex';
    $('appContainer').style.display = 'none';
  }
});

