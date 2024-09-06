const express = require("express");
const bcrypt = require("bcrypt");

const port = 3000;
const app = express();
app.use(express.json());

let storedPublicKey = null;
let hashedPassword = null;

// verifyPassword logic
const verifyPassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

app.post("/set-password", async (req, res) => {
    const { username, publicKey } = req.body;

    if (!username || !publicKey) {
        return res.status(400).json({ error: 'Username and public key are required' });
    }

    res.status(200).json({ message: 'Registered successfully!' });
});

app.post("/store-public-key", async (req, res) => {
    const { password, publicKey } = req.body;

    if (!password || !publicKey) {
        return res.status(400).json({ error: 'Password and public key are required' });
    }

    if (!hashedPassword) {
        return res.status(400).json({ error: 'Internal server error' });
    }

    const validPassword = await verifyPassword(password, hashedPassword);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    storedPublicKey = publicKey;

    console.log('Public key stored successfully!');
    res.status(200).json({ message: 'Public key stored successfully' });
});


app.post('/verify-signature', (req, res) => {
    const { message, signature } = req.body;
    console.log(message, signature);

    res.status(200).json({ message: 'Signature is valid' });
});


// getting password from arguments passed when starting the server
const args = process.argv.slice(2);
// default password
let password = 'azeem@2024';
if (args.length > 0) {
    password = args[0];
}
hashedPassword = bcrypt.hashSync(password, 10);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    if (password == 'azeem@2024') {
        console.log('Server started with default password: azeem@2024');
    }
});