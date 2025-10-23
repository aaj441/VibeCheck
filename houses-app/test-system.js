#!/usr/bin/env node

/**
 * Simple test script to verify the coaching system works end-to-end
 */

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001/api/coaching';

async function testCoachingSystem() {
  console.log('🧪 Testing Social Interaction Coach System...\n');

  try {
    // Test 1: Create a new session
    console.log('1️⃣ Creating new coaching session...');
    const sessionResponse = await fetch(`${BASE_URL}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'test-user' })
    });
    
    if (!sessionResponse.ok) {
      throw new Error(`Failed to create session: ${sessionResponse.status}`);
    }
    
    const session = await sessionResponse.json();
    console.log(`✅ Session created: ${session.id}\n`);

    // Test 2: Context Check-In
    console.log('2️⃣ Testing context check-in...');
    const contextResponse = await fetch(`${BASE_URL}/session/${session.id}/context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'date',
        feelings: 'nervous but excited',
        setting: 'in-person',
        attendees: 'my date Sarah',
        goal: 'have a good conversation and see if we connect'
      })
    });
    
    if (!contextResponse.ok) {
      throw new Error(`Context check-in failed: ${contextResponse.status}`);
    }
    
    const updatedSession = await contextResponse.json();
    console.log(`✅ Context check-in completed, moved to step ${updatedSession.currentStep}\n`);

    // Test 3: Emotional Calibration
    console.log('3️⃣ Testing emotional calibration...');
    const emotionalResponse = await fetch(`${BASE_URL}/session/${session.id}/emotional-calibration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anxiety: 7,
        excitement: 6,
        energy: 5,
        focus: 6,
        worries: ['Awkward pauses in conversation', 'Not knowing what to say'],
        triggers: ['Loud noises', 'Crowded spaces']
      })
    });
    
    if (!emotionalResponse.ok) {
      throw new Error(`Emotional calibration failed: ${emotionalResponse.status}`);
    }
    
    const emotionalSession = await emotionalResponse.json();
    console.log(`✅ Emotional calibration completed, moved to step ${emotionalSession.currentStep}\n`);

    // Test 4: Generate Checklist
    console.log('4️⃣ Testing checklist generation...');
    const checklistResponse = await fetch(`${BASE_URL}/session/${session.id}/checklist`);
    
    if (!checklistResponse.ok) {
      throw new Error(`Checklist generation failed: ${checklistResponse.status}`);
    }
    
    const checklistData = await checklistResponse.json();
    console.log(`✅ Generated ${checklistData.checklist.length} checklist items\n`);

    // Test 5: Practice Scenarios
    console.log('5️⃣ Testing practice scenarios...');
    const scenariosResponse = await fetch(`${BASE_URL}/session/${session.id}/practice-scenarios`);
    
    if (!scenariosResponse.ok) {
      throw new Error(`Practice scenarios failed: ${scenariosResponse.status}`);
    }
    
    const scenariosData = await scenariosResponse.json();
    console.log(`✅ Generated ${scenariosData.scenarios.length} practice scenarios\n`);

    // Test 6: Live Support
    console.log('6️⃣ Testing live support...');
    const liveResponse = await fetch(`${BASE_URL}/session/${session.id}/live-support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput: 'feeling nervous, the conversation is going okay but I\'m worried about awkward pauses'
      })
    });
    
    if (!liveResponse.ok) {
      throw new Error(`Live support failed: ${liveResponse.status}`);
    }
    
    const liveData = await liveResponse.json();
    console.log(`✅ Live support provided: "${liveData.suggestion}"\n`);

    // Test 7: Post Reflection
    console.log('7️⃣ Testing post-reflection...');
    const reflectionResponse = await fetch(`${BASE_URL}/session/${session.id}/reflection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whatWorked: 'I asked good questions and stayed calm',
        whatWasTough: 'There were a few awkward pauses that made me anxious',
        additionalFeedback: 'Overall it went better than expected'
      })
    });
    
    if (!reflectionResponse.ok) {
      throw new Error(`Post reflection failed: ${reflectionResponse.status}`);
    }
    
    const reflectionData = await reflectionResponse.json();
    console.log(`✅ Post-reflection completed with ${reflectionData.followUpActions.length} follow-up actions\n`);

    // Test 8: Neurodivergent Adaptations
    console.log('8️⃣ Testing neurodivergent adaptations...');
    const adaptationsResponse = await fetch(`${BASE_URL}/adaptations/ADHD`);
    
    if (!adaptationsResponse.ok) {
      throw new Error(`Adaptations failed: ${adaptationsResponse.status}`);
    }
    
    const adaptationsData = await adaptationsResponse.json();
    console.log(`✅ Retrieved ${adaptationsData.adaptations.length} ADHD adaptations\n`);

    console.log('🎉 All tests passed! The Social Interaction Coach system is working correctly.\n');
    
    console.log('📋 Test Summary:');
    console.log('  ✅ Session creation');
    console.log('  ✅ Context check-in');
    console.log('  ✅ Emotional calibration');
    console.log('  ✅ Checklist generation');
    console.log('  ✅ Practice scenarios');
    console.log('  ✅ Live support');
    console.log('  ✅ Post-reflection');
    console.log('  ✅ Neurodivergent adaptations');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Backend server is not running on localhost:3001');
    console.log('Please start the server first:');
    console.log('  cd houses-app/backend');
    console.log('  npm install');
    console.log('  npm run dev');
    process.exit(1);
  }
  
  await testCoachingSystem();
}

main();