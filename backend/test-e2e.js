async function runTest() {
  const API_URL = 'http://127.0.0.1:3001/api';
  console.log("Starting End-to-End API Test...");

  try {
    // 1. Submit a Need
    console.log("\\n1. Submitting a new need...");
    const needRes = await fetch(`${API_URL}/needs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zone: 'Zone C',
        category: 'Medical',
        description: 'Need emergency first aid kits',
        urgency: 4
      })
    });
    const need = await needRes.json();
    console.log("Created Need:", need);

    // 2. Fetch Matches
    console.log("\\n2. Finding matches for Need ID:", need.id);
    const matchRes = await fetch(`${API_URL}/matches/${need.id}`);
    const matches = await matchRes.json();
    console.log("Found matches:", matches.map(m => `${m.volunteer.name} (Score: ${m.score})`));

    // 3. Assign Volunteer
    const bestMatch = matches[0];
    console.log("\\n3. Assigning best match:", bestMatch.volunteer.name);
    const assignRes = await fetch(`${API_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        need_id: need.id,
        volunteer_id: bestMatch.volunteer.id,
        match_score: bestMatch.score
      })
    });
    const assignment = await assignRes.json();
    console.log("Created Assignment:", assignment);

    // 4. Verify Need Status
    console.log("\\n4. Verifying need status is now 'assigned'...");
    const verifyRes = await fetch(`${API_URL}/needs/${need.id}`);
    const verifiedNeed = await verifyRes.json();
    console.log("Final Need Status:", verifiedNeed.status);

    if (verifiedNeed.status === 'assigned') {
      console.log("\\n✅ END-TO-END TEST PASSED!");
    } else {
      console.error("\\n❌ Test failed: Status is not 'assigned'.");
    }

  } catch (err) {
    console.error("Test failed with error:", err.message);
  }
}

runTest();
