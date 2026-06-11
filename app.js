/**
 * APP.JS - Refined for Cinnamon Hotels & Resorts Indoor Navigator
 * Handles 8-bubble dial math, onboarding timers, split-view screens, dropdown navigation, and WebRTC AR compass tracking.
 */

// --- Cinnamon Life Indoor Location & Timeline Data ---
const LOCATIONS = {
  lobby: {
    id: 'lobby',
    title: 'Main Lobby',
    building: 'Level 2 Lobby',
    distance: 80,
    targetHeading: 45,
    dialAngle: 0,
    steps: [
      { label: 'Start Point', name: 'MAIN ENTRANCE' },
      { label: 'Security Track', name: 'FOYER CHECKPOINT' },
      { label: 'Arrival Walk', name: 'L2 LOBBY LOUNGE' },
      { label: 'Destination', name: 'RECEPTION DESK' }
    ]
  },
  mall: {
    id: 'mall',
    title: 'Atrium Mall',
    building: 'Level 3 Retail',
    distance: 180,
    targetHeading: 90,
    dialAngle: 45,
    steps: [
      { label: 'Start Point', name: 'MAIN ENTRANCE' },
      { label: 'Checkpoint', name: 'L2 LOBBY' },
      { label: 'Escalator Up', name: 'GRAND PROMENADE' },
      { label: 'Destination', name: 'ATRIUM MALL GATES' }
    ]
  },
  casino: {
    id: 'casino',
    title: 'Casino Lobby',
    building: 'Level 3 Entertainment',
    distance: 290,
    targetHeading: 135,
    dialAngle: 90,
    steps: [
      { label: 'Start Point', name: 'MAIN ENTRANCE' },
      { label: 'Elevators B', name: 'L2 ELEVATOR BANK' },
      { label: 'Ascend L3', name: 'GOLD CORRIDOR' },
      { label: 'Destination', name: 'NUSTAR CASINO CHECK' }
    ]
  },
  restaurant: {
    id: 'restaurant',
    title: 'Fine Dining',
    building: 'Level 4 Promenade',
    distance: 210,
    targetHeading: 180,
    dialAngle: 135,
    steps: [
      { label: 'Start Point', name: 'MAIN ENTRANCE' },
      { label: 'Checkpoint', name: 'L2 LOBBY' },
      { label: 'Bubble Elevators', name: 'GALLERY LOBBY' },
      { label: 'Destination', name: 'SIGNATURE DINING' }
    ]
  },
  suites: {
    id: 'suites',
    title: 'Luxury Suites',
    building: 'Level 8 Residence',
    distance: 350,
    targetHeading: 225,
    dialAngle: 180,
    steps: [
      { label: 'Start Point', name: 'MAIN ENTRANCE' },
      { label: 'Access Gate', name: 'RESIDENTIAL ENTRANCE' },
      { label: 'Suite Elevators', name: 'BANK C ELEVATORS' },
      { label: 'Destination', name: 'L8 EXECUTIVE CORRIDOR' }
    ]
  },
  lumina: {
    id: 'lumina',
    title: 'LUMINA',
    building: 'BALLROOM',
    distance: 120,
    targetHeading: 270, // Matches 270 deg for center HUD view
    dialAngle: 225,
    steps: [
      { label: 'Checkpoint', name: 'ENTRANCE' },
      { label: 'Foyer', name: 'L2 LOBBY' },
      { label: 'Transit', name: 'ARRIVALS WALK' },
      { label: 'Elevators', name: 'LEVEL 12 ELEVATORS' },
      { label: 'Exit Point', name: 'EXIT 1 ELEVATORS' },
      { label: 'Destination', name: 'LUMINA BALLROOM ENTRANCE' }
    ]
  },
  pool: {
    id: 'pool',
    title: 'Rooftop Pool',
    building: 'Level 25 Sky deck',
    distance: 420,
    targetHeading: 315,
    dialAngle: 270,
    steps: [
      { label: 'Start Point', name: 'MAIN ENTRANCE' },
      { label: 'Check in', name: 'EXECUTIVE LOBBY' },
      { label: 'High Speed Lift', name: 'L25 ELEVATORS' },
      { label: 'Destination', name: 'INFINITY POOL ENTRY' }
    ]
  },
  garden: {
    id: 'garden',
    title: 'Sky Garden',
    building: 'Level 12 Terraces',
    distance: 310,
    targetHeading: 0,
    dialAngle: 315,
    steps: [
      { label: 'Start Point', name: 'MAIN ENTRANCE' },
      { label: 'Checkpoint', name: 'L2 LOBBY' },
      { label: 'Elevators A', name: 'LEVEL 12 ELEVATORS' },
      { label: 'Destination', name: 'SKY GARDEN PROMENADE' }
    ]
  }
};

// --- Guided Tour Stops ---
const GUIDED_TOURS = [
  {
    id: 'lobby',
    stopNumber: 1,
    name: 'GRAND LOBBY',
    subtitle: 'Level 2 · Main Atrium',
    description: 'Begin your journey at the sweeping marble atrium — the heart of Cinnamon Life. Admire the cascading chandelier installation rising six stories above.',
    emoji: '🏛️',
    accentColor: '#5D2D91',
    duration: '~2 min walk'
  },
  {
    id: 'mall',
    stopNumber: 2,
    name: 'ATRIUM MALL',
    subtitle: 'Level 3 · Retail Promenade',
    description: 'Over 200 luxury boutiques line the grand promenade. From global fashion houses to local artisan galleries — a curated retail experience awaits.',
    emoji: '🛍️',
    accentColor: '#8B44C0',
    duration: '~3 min walk'
  },
  {
    id: 'restaurant',
    stopNumber: 3,
    name: 'SIGNATURE DINING',
    subtitle: 'Level 4 · Fine Dining Terrace',
    description: 'Savour contemporary Sri Lankan cuisine fused with global influences. Award-winning executive chefs present seasonal tasting menus with panoramic city views.',
    emoji: '🍽️',
    accentColor: '#C0444A',
    duration: '~5 min walk'
  },
  {
    id: 'garden',
    stopNumber: 4,
    name: 'SKY GARDEN',
    subtitle: 'Level 12 · Terraced Promenade',
    description: 'An elevated tropical oasis with curated botanical gardens, reflection pools, and open-air lounges offering unobstructed views of Colombo's skyline.',
    emoji: '🌿',
    accentColor: '#2E8B57',
    duration: '~7 min walk'
  },
  {
    id: 'pool',
    stopNumber: 5,
    name: 'INFINITY POOL',
    subtitle: 'Level 25 · Sky Deck',
    description: 'Sri Lanka's highest infinity pool merges seamlessly with the horizon. Relax on sun-loungers as the Indian Ocean stretches before you in every direction.',
    emoji: '🌊',
    accentColor: '#1A6FA6',
    duration: '~10 min walk'
  },
  {
    id: 'lumina',
    stopNumber: 6,
    name: 'LUMINA BALLROOM',
    subtitle: 'Event Wing · Grand Ballroom',
    description: 'The crown jewel of Cinnamon Life — a 2,000-seat pillarless ballroom draped in cascading crystal. Sri Lanka's most prestigious events venue.',
    emoji: '✨',
    accentColor: '#C5A047',
    duration: '~12 min walk'
  }
];

// --- App State ---
const state = {
  currentDestId: 'lumina',
  appStateMode: 'dial',         // 'dial' | 'route' | 'tour'
  orientationMode: 'horizontal', // 'horizontal' (tinted) or 'vertical' (AR translucent)
  simulatedHeading: 180,
  cameraActive: false,
  cameraStream: null,
  dialBaseRotation: 0,
  activeDialAngle: 0,
  tourStopIndex: 0              // active stop in guided tour
};

// --- DOM Elements ---
const body = document.body;
const onboarding = document.getElementById('onboarding');
const dropdownMenu = document.getElementById('dropdown-menu');
const mainDialWheel = document.getElementById('main-dial-wheel');
const dialBubbles = document.querySelectorAll('.dial-bubble-item');

// Split View Screens
const routeDestName = document.getElementById('route-destination-name');
const routeBuildingTag = document.querySelector('.route-building-tag');
const routeTimelineSteps = document.getElementById('route-timeline-steps');
const circlePathDot = document.getElementById('circle-path-dot');

// HUD Toggles & Elements
const arVideo = document.getElementById('ar-video');
const arWaypoint = document.getElementById('ar-waypoint');
const waypointTitle = document.getElementById('waypoint-title');
const waypointDistance = document.getElementById('waypoint-distance');
const hudTicks = document.getElementById('hud-ticks');
const hintLeft = document.getElementById('hud-hint-left');
const hintRight = document.getElementById('hud-hint-right');
const hintTextLeft = document.getElementById('hud-hint-text-left');
const hintTextRight = document.getElementById('hud-hint-text-right');

// Triggers
const menuBtnLeft = document.getElementById('menu-btn-left');
const menuBtnRight = document.getElementById('menu-btn-right');
const dropdownCloseBtn = document.getElementById('dropdown-close-btn');
const logoHomeTrigger = document.getElementById('logo-home-trigger');
const confirmSelectBtn = document.getElementById('confirm-select-btn');
const startTourBtn = document.getElementById('start-tour-btn');
const backToDialBtn = document.getElementById('back-to-dial-btn');

// Sim Buttons
const simBtnStateDial = document.getElementById('sim-btn-state-dial');
const simBtnStateRoute = document.getElementById('sim-btn-state-route');
const simBtnHoriz = document.getElementById('sim-btn-horiz');
const simBtnVert = document.getElementById('sim-btn-vert');
const simDestSelect = document.getElementById('sim-dest-select');
const simHeadingSlider = document.getElementById('sim-heading-slider');
const headingVal = document.getElementById('heading-val');
const camBadge = document.getElementById('cam-badge');
const camToggleAction = document.getElementById('cam-toggle-action');

// --- Initialization ---
function init() {
  // 1. Run Onboarding Timer (fades out after 1.8 seconds)
  setTimeout(() => {
    onboarding.classList.add('fade-out');
    // Clean up DOM after transition finishes
    setTimeout(() => onboarding.style.display = 'none', 600);
  }, 1800);

  setupEventListeners();
  
  // 2. Set default screen state to dial selection and select Lumina
  setAppState('dial');
  selectDestination('lumina', false);
  setOrientationMode('horizontal');
  
  // Start the frame animation loop
  requestAnimationFrame(updateARHUDFrame);
  
  // Initialize device sensor listeners
  setupDeviceOrientationEvents();
}

// --- Event Listeners ---
function setupEventListeners() {
  // Dial bubbles
  dialBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
      const id = bubble.getAttribute('data-id');
      selectDestination(id, true);
    });
  });

  // Action Buttons
  confirmSelectBtn.addEventListener('click', () => setAppState('route'));
  startTourBtn.addEventListener('click', () => {
    state.tourStopIndex = 0;
    renderTourCard(state.tourStopIndex);
    setAppState('tour');
  });
  backToDialBtn.addEventListener('click', () => setAppState('dial'));
  logoHomeTrigger.addEventListener('click', () => setAppState('dial'));
  document.getElementById('tour-back-btn').addEventListener('click', () => setAppState('dial'));

  // Guided Tour Navigation
  document.getElementById('tour-prev-btn').addEventListener('click', () => {
    if (state.tourStopIndex > 0) {
      state.tourStopIndex--;
      renderTourCard(state.tourStopIndex);
    }
  });
  document.getElementById('tour-next-btn').addEventListener('click', () => {
    if (state.tourStopIndex < GUIDED_TOURS.length - 1) {
      state.tourStopIndex++;
      renderTourCard(state.tourStopIndex);
    }
  });
  document.getElementById('tour-go-btn').addEventListener('click', () => {
    const stop = GUIDED_TOURS[state.tourStopIndex];
    selectDestination(stop.id, true);
    setAppState('route');
  });

  // Header Dropdown Trigger
  const toggleDropdown = () => dropdownMenu.classList.toggle('active');
  menuBtnLeft.addEventListener('click', toggleDropdown);
  menuBtnRight.addEventListener('click', toggleDropdown);
  dropdownCloseBtn.addEventListener('click', () => dropdownMenu.classList.remove('active'));

  // Dropdown Links
  document.querySelectorAll('.dropdown-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-id');
      if (id) {
        selectDestination(id, true);
        setAppState('route');
      }
      dropdownMenu.classList.remove('active');
    });
  });

  // Simulator Panels Toggle
  document.getElementById('sim-toggle-btn').addEventListener('click', () => {
    document.getElementById('sim-panel').classList.add('collapsed');
  });
  document.getElementById('sim-launcher-btn').addEventListener('click', () => {
    document.getElementById('sim-panel').classList.remove('collapsed');
  });

  // Simulator Events
  simBtnStateDial.addEventListener('click', () => setAppState('dial'));
  simBtnStateRoute.addEventListener('click', () => setAppState('route'));
  simBtnHoriz.addEventListener('click', () => setOrientationMode('horizontal'));
  simBtnVert.addEventListener('click', () => setOrientationMode('vertical'));
  
  simDestSelect.addEventListener('change', (e) => {
    selectDestination(e.target.value, true);
  });
  
  simHeadingSlider.addEventListener('input', (e) => {
    const heading = parseInt(e.target.value);
    state.simulatedHeading = heading;
    headingVal.textContent = `${heading}°`;
  });

  camToggleAction.addEventListener('click', toggleCamera);
  
  // Waypoint tap behavior
  arWaypoint.querySelector('.waypoint-icon').addEventListener('click', () => {
    setAppState('route');
  });

  // Turn towards waypoint on edge arrow tap
  hintLeft.addEventListener('click', () => snapToHeading('left'));
  hintRight.addEventListener('click', () => snapToHeading('right'));
}

// --- App State Switcher ---
function setAppState(mode) {
  state.appStateMode = mode;

  // Hide all state containers
  body.classList.remove('state-dial', 'state-route', 'state-tour');

  if (mode === 'dial') {
    body.classList.add('state-dial');
    simBtnStateDial.classList.add('active');
    simBtnStateRoute.classList.remove('active');
  } else if (mode === 'route') {
    body.classList.add('state-route');
    simBtnStateRoute.classList.add('active');
    simBtnStateDial.classList.remove('active');
  } else if (mode === 'tour') {
    body.classList.add('state-tour');
    simBtnStateDial.classList.remove('active');
    simBtnStateRoute.classList.remove('active');
  }
}

// --- Guided Tour Renderer ---
function renderTourCard(index) {
  const stop = GUIDED_TOURS[index];
  const track = document.getElementById('tour-cards-track');

  // Animate out then in
  track.style.opacity = '0';
  track.style.transform = 'translateY(12px)';

  setTimeout(() => {
    track.innerHTML = `
      <div class="tour-card" style="--tour-accent: ${stop.accentColor}">
        <div class="tour-card-emoji">${stop.emoji}</div>
        <div class="tour-card-stop-tag">STOP ${stop.stopNumber} OF ${GUIDED_TOURS.length}</div>
        <h3 class="tour-card-name">${stop.name}</h3>
        <p class="tour-card-subtitle">${stop.subtitle}</p>
        <p class="tour-card-description">${stop.description}</p>
        <div class="tour-card-meta">
          <span class="tour-card-duration">🚶 ${stop.duration}</span>
        </div>
        <div class="tour-dot-indicators">
          ${GUIDED_TOURS.map((_, i) => `<div class="tour-dot${i === index ? ' active' : ''}"></div>`).join('')}
        </div>
      </div>
    `;

    track.style.opacity = '1';
    track.style.transform = 'translateY(0)';
  }, 160);

  // Update counter
  document.getElementById('tour-current-stop').textContent = index + 1;
  document.getElementById('tour-total-stops').textContent = GUIDED_TOURS.length;

  // Update progress bar
  const pct = ((index + 1) / GUIDED_TOURS.length) * 100;
  document.getElementById('tour-progress-fill').style.width = `${pct}%`;

  // Update button states
  document.getElementById('tour-prev-btn').style.opacity = index === 0 ? '0.35' : '1';
  document.getElementById('tour-next-btn').style.opacity = index === GUIDED_TOURS.length - 1 ? '0.35' : '1';
}

// --- Destination Selector Logic ---
function selectDestination(id, animate = true) {
  const dest = LOCATIONS[id];
  if (!dest) return;
  
  state.currentDestId = id;

  // 1. Rotate Dial Wheel
  const currentActive = document.querySelector('.dial-bubble-item.active');
  if (currentActive) currentActive.classList.remove('active');
  
  const targetBubble = document.querySelector(`.dial-bubble-item[data-id="${id}"]`);
  if (targetBubble) targetBubble.classList.add('active');
  
  // Shortest path angle rotation
  const targetAngle = dest.dialAngle;
  let diff = (targetAngle - state.activeDialAngle) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  
  state.dialBaseRotation = state.dialBaseRotation - diff;
  state.activeDialAngle = targetAngle;
  
  mainDialWheel.style.setProperty('--dial-rotation', `${state.dialBaseRotation}deg`);
  
  // Sync reverse rotation of bubble button labels in real time
  dialBubbles.forEach(b => {
    const btn = b.querySelector('.bubble-btn');
    const angle = parseFloat(b.style.getPropertyValue('--angle'));
    btn.style.transform = `rotate(calc(-1 * (${angle}deg + ${state.dialBaseRotation}deg)))`;
  });

  // 2. Populate Circular Route Timeline Steps (Figma screenshot spec)
  routeDestName.textContent = dest.title;
  routeBuildingTag.textContent = dest.building;
  
  routeTimelineSteps.innerHTML = '';
  dest.steps.forEach((step, idx) => {
    const li = document.createElement('li');
    // First step is always active checkpoint on route load
    li.className = `timeline-item${idx === 0 ? ' active' : ''}`;
    
    li.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        ${step.label ? `<span class="timeline-label">${step.label}</span>` : ''}
        <h4 class="timeline-title">${step.name}</h4>
      </div>
    `;
    routeTimelineSteps.appendChild(li);
  });

  // 3. Sync AR Waypoint Detail strings
  waypointTitle.textContent = dest.title;
  waypointDistance.textContent = `${dest.distance}m • ${Math.round(dest.distance / 70)} mins`;

  // 4. Sync Simulator Panel
  simDestSelect.value = id;

  // 5. Animate dynamic visual path inside map circle element
  animateCircleMapPath();
}

// --- Circle Map Path Animation ---
function animateCircleMapPath() {
  // Simple periodic step simulation on path
  let stepIdx = 0;
  const items = routeTimelineSteps.querySelectorAll('.timeline-item');
  
  function triggerNextTimelineStep() {
    if (state.appStateMode !== 'route') return;
    
    items.forEach(i => i.classList.remove('active'));
    items[stepIdx].classList.add('active');
    
    // Scale SVG tracker dot
    circlePathDot.setAttribute('cx', 30 + (stepIdx * 24));
    
    stepIdx = (stepIdx + 1) % items.length;
  }
  
  // Run step updates every 4 seconds in details mode
  if (window.stepInterval) clearInterval(window.stepInterval);
  window.stepInterval = setInterval(triggerNextTimelineStep, 4000);
}

// --- Orientation Manager ---
function setOrientationMode(mode) {
  state.orientationMode = mode;
  
  if (mode === 'horizontal') {
    body.classList.remove('vertical-mode');
    body.classList.add('horizontal-mode');
    
    simBtnHoriz.classList.add('active');
    simBtnVert.classList.remove('active');
    
    // Disable headings controls in flat layout
    document.getElementById('sim-heading-group').style.opacity = '0.4';
    document.getElementById('sim-heading-group').style.pointerEvents = 'none';
  } else {
    body.classList.remove('horizontal-mode');
    body.classList.add('vertical-mode');
    
    simBtnVert.classList.add('active');
    simBtnHoriz.classList.remove('active');
    
    document.getElementById('sim-heading-group').style.opacity = '1';
    document.getElementById('sim-heading-group').style.pointerEvents = 'auto';
    
    // Auto start camera if needed in portrait mode
    if (!state.cameraActive) {
      toggleCamera();
    }
  }
}

// --- WebRTC Back Camera Connection ---
async function toggleCamera() {
  if (state.cameraActive) {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
    }
    arVideo.srcObject = null;
    arVideo.style.opacity = '0';
    state.cameraActive = false;
    camBadge.textContent = 'OFF';
    camBadge.className = 'status-badge error';
    camToggleAction.textContent = 'ACTIVATE CAMERA';
  } else {
    try {
      camBadge.textContent = 'CONNECTING...';
      camBadge.className = 'status-badge info';
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      state.cameraStream = stream;
      arVideo.srcObject = stream;
      arVideo.style.opacity = '1';
      state.cameraActive = true;
      
      camBadge.textContent = 'LIVE';
      camBadge.className = 'status-badge success';
      camToggleAction.textContent = 'DEACTIVATE CAMERA';
    } catch (err) {
      console.warn("Unable to access system camera. Displaying fallback gradient backdrop.", err);
      state.cameraActive = false;
      camBadge.textContent = 'BLOCKED';
      camBadge.className = 'status-badge error';
      camToggleAction.textContent = 'RETRY CAMERA';
      arVideo.style.opacity = '0';
    }
  }
}

// --- AR Waypoint Positioning update loops ---
function updateARHUDFrame() {
  if (state.orientationMode === 'vertical') {
    const dest = LOCATIONS[state.currentDestId];
    if (dest) {
      const heading = state.simulatedHeading;
      const targetHeading = dest.targetHeading;
      
      // Update compass tape translation
      const offset = -(heading * 1.5);
      hudTicks.style.transform = `translateX(${offset}px)`;
      
      // Normalize heading diff to [-180, 180]
      let diff = (targetHeading - heading) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      
      const FOV = 45; // camera horizontal field of view scope
      
      if (Math.abs(diff) <= FOV) {
        // Waypoint inside screen bounds!
        arWaypoint.style.opacity = '1';
        arWaypoint.style.visibility = 'visible';
        
        const screenWidth = window.innerWidth;
        const xOffset = (diff / FOV) * (screenWidth * 0.44);
        
        const scale = 1.15 - (Math.abs(diff) / FOV) * 0.25;
        const opacity = 1.0 - (Math.abs(diff) / FOV) * 0.4;
        
        arWaypoint.style.transform = `translate(-50%, -50%) translate3d(${xOffset}px, 0, 0) scale(${scale})`;
        arWaypoint.style.opacity = opacity;
        
        // Disable screen arrows
        hintLeft.style.opacity = '0';
        hintLeft.style.visibility = 'hidden';
        hintRight.style.opacity = '0';
        hintRight.style.visibility = 'hidden';
      } else {
        // Waypoint is off-screen. Show edge direction indicator arrows.
        arWaypoint.style.opacity = '0';
        arWaypoint.style.visibility = 'hidden';
        
        const textDist = `${dest.title} (${dest.distance}m)`;
        
        if (diff < 0) {
          // Left Side arrow hint
          hintLeft.style.opacity = '1';
          hintLeft.style.visibility = 'visible';
          hintTextLeft.textContent = textDist;
          
          hintRight.style.opacity = '0';
          hintRight.style.visibility = 'hidden';
        } else {
          // Right Side arrow hint
          hintRight.style.opacity = '1';
          hintRight.style.visibility = 'visible';
          hintTextRight.textContent = textDist;
          
          hintLeft.style.opacity = '0';
          hintLeft.style.visibility = 'hidden';
        }
      }
    }
  }
  
  requestAnimationFrame(updateARHUDFrame);
}

// --- Snap heading towards target (called on hint tap) ---
function snapToHeading(direction) {
  const dest = LOCATIONS[state.currentDestId];
  if (!dest) return;
  
  let targetAngle = dest.targetHeading;
  if (direction === 'left') {
    state.simulatedHeading = (targetAngle - 10 + 360) % 360;
  } else {
    state.simulatedHeading = (targetAngle + 10) % 360;
  }
  
  // Sync slider GUI components
  simHeadingSlider.value = state.simulatedHeading;
  headingVal.textContent = `${state.simulatedHeading}°`;
}

// --- Mobile Gyroscope callbacks ---
function setupDeviceOrientationEvents() {
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      simBtnVert.addEventListener('click', requestGyroscopePermission);
    } else {
      window.addEventListener('deviceorientation', handleOrientationChange, true);
    }
  }
  
  window.addEventListener('orientationchange', () => {
    if (window.orientation === 90 || window.orientation === -90) {
      setOrientationMode('horizontal');
    } else if (window.orientation === 0) {
      setOrientationMode('vertical');
    }
  });
}

function requestGyroscopePermission() {
  DeviceOrientationEvent.requestPermission()
    .then(permissionState => {
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', handleOrientationChange, true);
      }
    })
    .catch(console.error);
}

function handleOrientationChange(event) {
  if (event.alpha !== null) {
    let heading = Math.round(event.alpha);
    state.simulatedHeading = heading;
    
    simHeadingSlider.value = heading;
    headingVal.textContent = `${heading}°`;
  }
  
  if (event.beta !== null) {
    const pitch = Math.abs(event.beta);
    // Flat orientation toggles map, vertical matches AR HUD
    if (pitch < 30 && state.orientationMode !== 'horizontal') {
      setOrientationMode('horizontal');
    } else if (pitch > 60 && state.orientationMode !== 'vertical') {
      setOrientationMode('vertical');
    }
  }
}

// Run app
window.addEventListener('DOMContentLoaded', init);
