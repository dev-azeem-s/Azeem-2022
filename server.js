const express = require("express");
const bcrypt = require("bcrypt");

const port = 3000;
const app = express();
app.use(express.json());

let storedPublicKey = null;
let hashedPassword = null;


app.post("/set-password", async (req, res) => {
    const { username, publicKey } = req.body;
    console.log(username, publicKey);
    res.status(200).json({ message: 'Registered successfully!' });
});

app.post("/store-public-key", async (req, res) => {
    const { username, publicKey } = req.body;
    console.log(username, publicKey);
    res.status(200).json({ message: 'Registered successfully!' });
});


app.post('/verify-signature', (req, res) => {
    const { message, signature } = req.body;
    console.log(message, signature);

    res.status(200).json({ message: 'Signature is valid' });
});


// getting password from arguments passed when starting the server
const args = process.argv.slice(2);
if (args.length > 0) {
    password = args[0];
    // storing the input password in hashed form using bycrypt
    hashedPassword = bcrypt.hashSync(password, 10);
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`Password: ${hashedPassword}`);
});