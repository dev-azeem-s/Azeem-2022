const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const port = 3000;
const app = express();
app.use(express.json());

let storedPublicKey = null;
let hashedPassword = null;

// verifyPassword logic
const verifyPassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

// Helper function to verify a signature
const verifySignature = (publicKey, message, signature) => {
    console.log(`${message}`);
    console.log(`${signature}`);

    const verify = crypto.createVerify('sha256').update(message).end();
    return verify.verify(publicKey, signature, 'hex');
};

app.post("/set-public-key", async (req, res) => {
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


// Endpoint to verify a message signature (no authentication required)
app.post('/verify-message', (req, res) => {
    const { message, signature } = req.body;
    if (!message || !signature) {
        return res.status(400).json({ error: 'Message and signature are required' });
    }

    if (!storedPublicKey) {
        return res.status(400).json({ error: 'Public key is not set on server' });
    }

    const validSignature = verifySignature(storedPublicKey, message, signature);
    if (!validSignature) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    res.status(200).json({ message: 'Message verified successfully' });
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