import { DeviceSpecs, UserPreferences, OptimizationResult, DeviceTier, SensitivitySettings } from './types';

export function calculateSensitivity(specs: DeviceSpecs, prefs: UserPreferences): OptimizationResult {
  // 1. Determine Device Tier
  let tier: DeviceTier = 'C';
  if (specs.ram >= 8 && specs.refreshRate >= 90) tier = 'A';
  else if (specs.ram >= 6) tier = 'B';
  else if (specs.ram <= 4) tier = 'D';

  // 2. Base Values based on Tier
  let baseSens = 90;
  let baseDPI = 411;

  switch (tier) {
    case 'A': baseSens = 95; baseDPI = 500; break;
    case 'B': baseSens = 92; baseDPI = 450; break;
    case 'C': baseSens = 88; baseDPI = 411; break;
    case 'D': baseSens = 85; baseDPI = 380; break;
  }

  // 3. Adjustments based on Preferences
  let multiplier = 1.0;
  if (prefs.focus === 'headshots') multiplier += 0.05;
  if (prefs.playStyle === 'aggressive') multiplier += 0.03;
  if (prefs.deviceFeel === 'laggy') multiplier -= 0.1;
  if (specs.refreshRate >= 120) multiplier += 0.02;

  const settings: SensitivitySettings = {
    general: Math.min(100, Math.round(baseSens * multiplier)),
    redDot: Math.min(100, Math.round((baseSens - 5) * multiplier)),
    scope2x: Math.min(100, Math.round((baseSens - 10) * multiplier)),
    scope4x: Math.min(100, Math.round((baseSens - 15) * multiplier)),
    sniper: Math.min(100, Math.round(50 * multiplier)),
    freeLook: Math.min(100, Math.round(70 * multiplier)),
    dpi: Math.round(baseDPI * (multiplier > 1 ? multiplier : 1)),
  };

  if (specs.gyroscope && prefs.aimType === 'gyro') {
    settings.gyro = Math.min(400, Math.round(300 * multiplier));
  }

  // 4. AI Coach Advice & Problem Tuning
  let coachAdvice = "";
  let adjustments: string[] = [];

  if (prefs.aimProblem === 'crosshair-too-high') {
    settings.general -= 5;
    settings.redDot -= 4;
    adjustments.push("Lowered General/Red Dot to prevent over-dragging.");
  } else if (prefs.aimProblem === 'drag-too-hard') {
    settings.general += 6;
    adjustments.push("Boosted General to make drags easier.");
  } else if (prefs.aimProblem === 'overshooting') {
    settings.general -= 3;
    settings.redDot -= 2;
    adjustments.push("Reduced sensitivity for better lock-on.");
  } else if (prefs.aimProblem === 'weak-headshot-pull') {
    settings.general += 4;
    settings.redDot += 3;
    adjustments.push("Increased pull speed for headshots.");
  } else if (prefs.aimProblem === 'shaky-red-dot') {
    settings.redDot -= 6;
    adjustments.push("Stabilized Red Dot to reduce shaking.");
  } else if (prefs.aimProblem === 'stiff-movement') {
    settings.general += 5;
    adjustments.push("Increased General for more fluid movement.");
  }

  if (prefs.dragResponse === 'slow') {
    settings.general += 3;
    adjustments.push("Compensated for slow drag response.");
  } else if (prefs.dragResponse === 'fast') {
    settings.general -= 2;
    adjustments.push("Tuned down fast drag response.");
  }

  if (prefs.scopeStability === 'shaking') {
    settings.scope2x -= 4;
    settings.scope4x -= 4;
    adjustments.push("Reduced scope sensitivity for stability.");
  } else if (prefs.scopeStability === 'stiff') {
    settings.scope2x += 4;
    settings.scope4x += 4;
    adjustments.push("Increased scope sensitivity for better tracking.");
  }

  if (adjustments.length > 0) {
    coachAdvice = `AI COACH: Based on your feedback, I've made ${adjustments.length} key adjustments: ${adjustments.join(' ')} Focus on your vertical drag speed and crosshair placement.`;
  } else {
    if (prefs.focus === 'headshots') {
      coachAdvice = "AI COACH: These settings prioritize high response for fast drag headshots. If your aim overflicks, decrease General by 2 points.";
    } else {
      coachAdvice = "AI COACH: Optimized for stability and recoil control. Perfect for consistent long-range sprays.";
    }
  }

  // 5. HUD Recommendation
  const isClaw = prefs.controls === 'claw';
  const isAggressive = prefs.playStyle === 'aggressive';
  const isThumb = prefs.controls === 'thumb';
  
  const hudRecommendation = {
    layout: isClaw ? '4-Finger Claw (Pro)' : '2-Finger Thumb (Speed)',
    buttons: [
      { 
        name: 'Fire Button', 
        size: isAggressive ? '58%' : (specs.ram < 6 ? '48%' : '52%'), 
        position: 'Bottom Right (Lower)',
        description: isAggressive 
          ? 'Oversized for maximum drag surface. Essential for aggressive close-range flicking.' 
          : 'Standard size for balanced drag control and precision at mid-range.'
      },
      { 
        name: 'Jump', 
        size: isClaw ? '75%' : '65%', 
        position: isClaw ? 'Top Right' : 'Right Center',
        description: isClaw 
          ? 'Placed for right index finger. Allows jumping while aiming and firing simultaneously.' 
          : 'Placed near thumb for quick access during movement.'
      },
      { 
        name: 'Gloo Wall', 
        size: isAggressive ? '90%' : '80%', 
        position: isClaw ? 'Top Left' : 'Left Center',
        description: 'Maximum size for instant defensive deployment. Placed for ' + (isClaw ? 'left index' : 'left thumb') + ' for zero-delay protection.'
      },
      { 
        name: 'Joystick', 
        size: '12%', 
        position: 'Bottom Left',
        description: 'Minimized to prevent accidental movement locks. Enhances overall screen visibility.'
      },
      { 
        name: 'Aim/Scope', 
        size: '65%', 
        position: isClaw ? 'Top Right (Inner)' : 'Right Center (Above Fire)',
        description: isClaw 
          ? 'Secondary index finger button for fast ADS (Aim Down Sights) transitions.' 
          : 'Ergonomically placed above the fire button for quick thumb transitions.'
      },
      { 
        name: 'Crouch', 
        size: '60%', 
        position: isClaw ? 'Top Left (Inner)' : 'Bottom Right (Near Fire)',
        description: 'Essential for crouch-shots and recoil reset. ' + (isClaw ? 'Index finger' : 'Thumb') + ' optimized.'
      },
      { 
        name: 'Sprint', 
        size: '70%', 
        position: 'Top Left (Near Gloo)',
        description: 'Large size for immediate disengagement or aggressive pushes.'
      }
    ]
  };

  if (isClaw || isAggressive) {
    hudRecommendation.buttons.push({ 
      name: 'Switch Weapon', 
      size: '80%', 
      position: isClaw ? 'Top Center' : 'Bottom Center',
      description: 'Critical for fast weapon combos (Sniper + Pistol or Shotgun + SMG). Optimized for ' + (isClaw ? 'index' : 'thumb') + ' speed.'
    });
  }

  // 6. Training Plan
  let weapon = "AK47 / Woodpecker";
  let drill = "5-minute Drag Headshot practice in Training Grounds.";
  let practice = "Focus on keeping crosshair at neck level before dragging up.";

  if (isAggressive) {
    weapon = "MP40 / M1887 (Shotguns)";
    drill = "5-minute Close-Range Flick practice. Move constantly and snap to heads.";
    practice = "Red Dot: Practice 'J-Drag' movements. Start at feet and flick up in a J shape.";
  } else if (prefs.playStyle === 'long-range') {
    weapon = "SVD / Woodpecker / AWM";
    drill = "5-minute Static Target practice. Focus on 100% accuracy over speed.";
    practice = "Red Dot: Focus on micro-adjustments. Keep the dot steady on the target's head.";
  } else {
    // Balanced
    weapon = "M4A1 / SCAR / MP5";
    drill = "5-minute Mid-Range Spray control. Practice pulling down slightly while firing.";
    practice = "Red Dot: Practice tracking moving targets. Keep the dot on the enemy while they strafe.";
  }

  if (prefs.aimProblem === 'overshooting' || prefs.aimProblem === 'crosshair-too-high') {
    drill += " Focus on stopping your drag exactly at head level. Use a lighter touch.";
  } else if (prefs.aimProblem === 'weak-headshot-pull' || prefs.aimProblem === 'drag-too-hard') {
    drill += " Increase your thumb swipe speed. Practice the 'Fast-Flick' technique.";
  } else if (prefs.aimProblem === 'shaky-red-dot') {
    drill += " Practice tracking moving targets without firing to build stability.";
  }

  if (prefs.scopeStability === 'shaking') {
    practice += " Scope: Practice holding the fire button and dragging down slowly to control recoil.";
  }

  const trainingPlan = {
    weapon,
    drill,
    practice
  };

  return {
    deviceTier: tier,
    performanceType: tier === 'A' ? 'Ultra Pro' : tier === 'B' ? 'High Performance' : 'Balanced',
    settings,
    coachAdvice,
    hudRecommendation,
    trainingPlan
  };
}

export async function detectDevice(): Promise<Partial<DeviceSpecs>> {
  const specs: Partial<DeviceSpecs> = {};

  // 1. Resolution
  specs.screenSize = `${window.screen.width}x${window.screen.height}`;

  // 2. RAM (Approximate)
  if ('deviceMemory' in navigator) {
    specs.ram = (navigator as any).deviceMemory;
  }

  // 3. Refresh Rate (Estimation)
  specs.refreshRate = await new Promise<number>((resolve) => {
    let frames = 0;
    let start = performance.now();
    
    function check() {
      frames++;
      const now = performance.now();
      if (now - start >= 1000) {
        // Round to common refresh rates
        const fps = Math.round(frames);
        if (fps > 130) resolve(144);
        else if (fps > 100) resolve(120);
        else if (fps > 75) resolve(90);
        else resolve(60);
      } else {
        requestAnimationFrame(check);
      }
    }
    requestAnimationFrame(check);
  });

  // 4. Gyroscope
  specs.gyroscope = 'DeviceOrientationEvent' in window;

  // 5. Brand/Model (Best effort parsing)
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) {
    specs.brand = 'Apple';
    specs.model = ua.includes('iPhone') ? 'iPhone' : 'iPad';
  } else if (/Samsung|SM-/.test(ua)) {
    specs.brand = 'Samsung';
    specs.model = ua.match(/SM-[A-Z0-9]+/)?.[0] || 'Galaxy';
  } else if (/Redmi|Xiaomi|POCO|Mi /.test(ua)) {
    specs.brand = ua.includes('POCO') ? 'Poco' : 'Xiaomi';
    specs.model = 'Detected Device';
  } else {
    specs.brand = 'Other';
    specs.model = 'Detected Device';
  }

  return specs;
}
