const crypto = require("crypto");
const axios = require("axios");
const path = require("path");

const keyDir = path.join(__dirname, "keys");
if (!fs.existsSync(keyDir)) {
    fs.mkdirSync(keyDir);
}

// generating asymmetric keypair and storing it
const generateKeypair = async () => {
    const keypair = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });
    const publicKey = keypair.publicKey;
    const privateKey = keypair.privateKey;

    fs.writeFileSync(path.join(keyDir, "public.pem"), publicKey);
    fs.writeFileSync(path.join(keyDir, "private.pem"), privateKey);

    console.log('Key pair generated and stored in keys directory.');
};


// CLI handling
const [, , command, ...args] = process.argv;

switch (command) {
    case 'generate-keypair':
        generateKeypair();
        break;

    default:
        console.error('Unknown command. Use "generate-keypair", "register", "sign", or "verify".');
        break;
}