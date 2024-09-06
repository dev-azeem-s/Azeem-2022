const crypto = require("crypto");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

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


const setPublicKey = async (password) => {
    const publicKey = fs.readFileSync(path.join(keyDir, 'public.pem'), 'utf8');
    try {
        const response = await axios.post('http://localhost:3000/set-public-key', {
            password,
            publicKey
        });
        console.log(response.data);
    } catch (error) {
        console.error(error.response.data);
    }
}

// signing a message
const signMessage = async (message) => {
    const privateKey = fs.readFileSync(path.join(keyDir, 'private.pem'), 'utf8');

    // using crypto to sign the message with the private key and print the signature and message to the console
    const signature = crypto.createSign('sha256').update(message).sign(privateKey, 'hex');
    console.log('Message: ', message);
    console.log('Signature: ', signature);
}

// CLI handling
const [, , command, ...args] = process.argv;

switch (command) {
    case 'generate-keypair':
        generateKeypair();
        break;
    case 'set-public-key':
        const password = args[0];
        if (!password) {
            console.error('Password is required to set public key');
            break;
        }
        setPublicKey(password);
        break;

    case 'sign-message': 
        const message = args.concat('').join(' ');
        if (!message) {
            console.error('Message is required to sign');
            break;
        }
        signMessage(message);
        break;
    default:
        console.error('Unknown command. Use "generate-keypair", "set-public-key", "sign-message"');
        break;
}