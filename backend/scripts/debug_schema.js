const supabase = require('../config/db');

async function debugSchema() {
    console.log("--- Starting Schema Debug ---");

    // 1. Check connection and homemax table
    console.log("\n1. Texting 'homemax' table access...");
    const { data: homemaxData, error: homemaxError } = await supabase
        .from('homemax')
        .select('happiness_id')
        .limit(1);

    if (homemaxError) {
        console.error("❌ homemax table error:", homemaxError.message);
    } else {
        console.log("✅ homemax table accessible. Rows found:", homemaxData.length);
    }

    // 2. Check reactions table existence (Select)
    console.log("\n2. Testing 'reactions' table select...");
    const { data: rData, error: rError } = await supabase
        .from('reactions')
        .select('*')
        .limit(1);

    if (rError) {
        console.error("❌ reactions select error:", rError);
        console.log("Possible causes: Table doesn't exist, RLS blocks select, or Typo.");
    } else {
        console.log("✅ reactions table accessible.");
        if (rData.length > 0) {
            console.log("Sample row keys:", Object.keys(rData[0]));
        } else {
            console.log("Table is empty, cannot verify exact column names by select *.");
        }
    }

    // 3. Check explicit column access (compliment_id)
    console.log("\n3. Testing 'reactions' specific column (compliment_id)...");
    const { error: colError } = await supabase
        .from('reactions')
        .select('compliment_id')
        .limit(1);

    if (colError) {
        console.error("❌ Failed to select 'compliment_id':", colError.message);
    } else {
        console.log("✅ 'compliment_id' column exists and is accessible.");
    }

    // 4. Check explicit column access (happiness_id - alternative name check)
    console.log("\n4. Testing 'reactions' alternative column (happiness_id)...");
    const { error: altError } = await supabase
        .from('reactions')
        .select('happiness_id')
        .limit(1);

    if (altError) {
        console.log("ℹ️ 'happiness_id' column access failed (Expected if not named this):", altError.message);
    } else {
        console.log("⚠️ Found 'happiness_id' column! The column might be named this instead of compliment_id.");
    }

    console.log("\n--- Debug Finished ---");
}

debugSchema();
