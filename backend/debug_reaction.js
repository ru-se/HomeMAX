const axios = require('axios');

const BASE_URL = 'http://localhost:8000'; // Port 8000
let cookie = '';

async function run() {
    try {
        console.log("=== 1. Signup / Login ===");
        const email = `debug_${Date.now()}@example.com`;
        const password = 'password123';
        console.log(`Creating user: ${email}`);

        // Signup: /auth/signup
        try {
            await axios.post(`${BASE_URL}/auth/signup`, {
                email, password, username: 'DebugUser'
            });
            console.log("Signup success.");
        } catch (e) {
            console.log("Signup skipped (maybe exists):", e.response ? e.response.data : e.message);
        }

        // Login: /auth/login
        console.log("Logging in...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email, password
        });

        const setCookie = loginRes.headers['set-cookie'];
        if (setCookie) {
            // set-cookie header needs parsing for subsequent requests
            cookie = setCookie.map(s => s.split(';')[0]).join('; ');
            console.log("Cookie acquired:", cookie);
        } else {
            console.error("No cookie returned!");
            return;
        }

        const userId = loginRes.data.user.user_id;
        console.log("UserId:", userId);

        console.log("\n=== 2. Generate Compliment ===");
        // /api/compliment/generate (Note: app.js defines /api/compliment)
        const compRes = await axios.post(`${BASE_URL}/api/compliment/generate`, {
            user_id: userId, // Body requires user_id as per controller
            letter_message: "Test message for reaction debugging",
            mode: "normal"
        }, { headers: { Cookie: cookie, 'Content-Type': 'application/json' } });

        const happinessId = compRes.data.happiness_id;
        console.log("Generated Happiness ID:", happinessId);

        if (!happinessId) {
            console.error("Failed to generate, no happiness_id. Response:", compRes.data);
            return;
        }

        console.log("\n=== 3. Create Share Link ===");
        // /share/create
        const shareRes = await axios.post(`${BASE_URL}/share/create`, {
            happiness_id: happinessId
        }, { headers: { Cookie: cookie, 'Content-Type': 'application/json' } });

        const shareToken = shareRes.data.share_token;
        console.log("Share Token:", shareToken);

        console.log("\n=== 4. Add Reaction (Public) ===");
        // /share/:token/react
        const reactRes = await axios.post(`${BASE_URL}/share/${shareToken}/react`, {
            guest_name: "DebugGuest",
            reaction_type: "fire",
            message: "Debug reaction message"
        });
        console.log("Reaction Result:", reactRes.data);

        console.log("\n=== 5. Get History (Authed) ===");
        // /api/compliment/history
        const historyRes = await axios.get(`${BASE_URL}/api/compliment/history`, {
            headers: { Cookie: cookie },
            params: { user_id: userId }
        });

        const history = historyRes.data;
        console.log("History Items Count:", history.length);

        if (history.length > 0) {
            const item = history.find(h => String(h.happiness_id) === String(happinessId) || String(h.id) === String(happinessId));

            if (item) {
                console.log("Found item in history.");
                // Check Raw reactions
                console.log("Item Reactions:", JSON.stringify(item.reactions, null, 2));

                if (item.reactions && item.reactions.length > 0) {
                    console.log("SUCCESS: Reaction is present in history.");
                } else {
                    console.error("FAILURE: Reaction is MISSING in history!");
                    console.log("Item Keys:", Object.keys(item));
                    console.log("Item ID values:", item.id, item.happiness_id);
                }
            } else {
                console.error("Item NOT found in history!");
                console.log("Available IDs:", history.map(h => h.id || h.happiness_id));
            }
        } else {
            console.error("History is empty!");
        }

    } catch (e) {
        console.error("Script Error:", e.message);
        if (e.response) {
            console.error("Response Status:", e.response.status);
            console.error("Response Data:", e.response.data);
        } else if (e.request) {
            console.error("No Response Received");
        }
    }
}

run();
