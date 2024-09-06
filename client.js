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
    try {
        console.log('Generating key pair...');
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
    } catch (error) {
        console.error('Error generating key pair:', error);
    }
};


const setPublicKey = async (password) => {
    try {
        const publicKey = fs.readFileSync(path.join(keyDir, 'public.pem'), 'utf8');
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
    try {
        const privateKey = fs.readFileSync(path.join(keyDir, 'private.pem'), 'utf8');
        // using crypto to sign the message with the private key and print the signature and message to the console
        const signature = crypto.createSign('sha256').update(message).sign(privateKey, 'hex');
        console.log({
            message,
            signature
        })
    } catch (error) {
        console.error('Error signing message:', error);
    }
}

const verifyMessage = async (message, signature) => {
    try {
        const response = await axios.post('http://localhost:3000/verify-message', {
            message,
            signature
        });
        console.log(response.data.message);
    } catch (error) {
        console.error('Verification failed:', error.response.data.error);
    }

}

// CLI handling
const [, , command, ...args] = process.argv;

switch (command) {
    case 'generate-keypair':
        generateKeypair();
        break;
    case 'set-public-key':
        {
            const password = args[0];
            if (!password) {
                console.error('Password is required to set public key');
                break;
            }
            setPublicKey(password);
        }
        break;

    case 'sign-message':
        {
            const message = args.concat('').join(' ');
            if (!message || message === '') {
                console.error('Message is required to sign');
                break;
            }
            signMessage(message.trim());
        }
        break;
    case 'verify-message':
        {
            const arguments = args.concat('').join(' ');
            if (arguments.indexOf('+') === -1) {
                console.error('Message and signature are required to verify, use + to separate them, message + signature');
                break;
            }

            const [message, signature] = arguments.split('+');

            if (!message || !signature) {
                console.error('Message and signature are required to verify');
                break;
            }

            verifyMessage(message.trim(), signature.trim());
        }
        break;
    default:
        console.error('Unknown command. Use "generate-keypair", "set-public-key", "sign-message"');
        break;
}