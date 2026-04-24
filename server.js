require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase (Pulls from your .env file or Vercel Environment Variables)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials. Check your .env file!");
}
const supabase = createClient(supabaseUrl, supabaseKey);

/* LOGIN */
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Attempt to find the user
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password);

        if (error) throw error;

        const isSuccess = data && data.length > 0;
        const fullName = isSuccess ? data[0].name : 'Unknown Attempt';

        // 2. Record the login attempt
        await supabase
            .from('login_attempts')
            .insert([{ email: email, name: fullName, status: isSuccess ? 'SUCCESS' : 'FAILED' }]);

        if (isSuccess) {
            res.json({ success: true, name: fullName });
        } else {
            res.json({ success: false });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error during login");
    }
});

/* SIGNUP */
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const { error } = await supabase
            .from('users')
            .insert([{ name, email, password }]);

        if (error) throw error;
        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});

/* GET STAFF ACCOUNTS */
app.get('/api/staff', async (req, res) => {
    try {
        const { data, error } = await supabase.from('staff_accounts').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database fetch error");
    }
});

/* CREATE STAFF ACCOUNT */
app.post('/api/staff', async (req, res) => {
    const { username, passwordHash } = req.body;
    try {
        const { error } = await supabase
            .from('staff_accounts')
            .insert([{ username: username, passwordHash: passwordHash }]);
            
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        console.error("Error creating staff:", err);
        res.status(500).send("Error saving to database");
    }
});

/* RESERVATIONS */
app.get('/reservations', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reservations')
            .select('id, name, arrivalDate, arrivalTime, tableNo');

        if (error) throw error;

        // Map columns on the fly to match your admin.html JS
        const mappedData = data.map(r => ({
            reservationNumber: r.id,
            customerName: r.name,
            arrivalDate: r.arrivalDate,
            arrivalTime: r.arrivalTime,
            bookedTable: r.tableNo,
            reservationType: 'priority'
        }));

        res.json(mappedData);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database fetch error");
    }
});

/* SAVE NEW RESERVATION */
app.post('/reserve', async (req, res) => {
    console.log("Saving new reservation for:", req.body.name);
    const { name, date, time, table } = req.body;

    try {
        const { error } = await supabase
            .from('reservations')
            .insert([{ 
                name: name, 
                arrivalDate: date, 
                arrivalTime: time, 
                tableNo: table 
            }]);

        if (error) throw error;
        res.json({ success: true });

    } catch (err) {
        console.error("Supabase Save Error:", err);
        res.status(500).send("Error saving to database");
    }
});

// Run locally if testing on your laptop
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log("Server running locally on port 3000"));
}

// Export for Vercel deployment
module.exports = app;
