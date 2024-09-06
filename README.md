# CLI Keypair, Message Signing, and Verification Tool

This project demonstrates a simple system for generating key pairs, signing messages, and verifying the signature against a server's public key.

## Getting Started

### Prerequisites

- Node.js installed on your system.
- Clone the project and `cd` into the project directory:

```bash
git clone <repository-url>
cd <project-directory>
```

### Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### Run the Server

Run the following command to start the server:

```bash
node server.js your-password
```

The password should be provided as an argument when running the server.
If no password is provided, the server will use the default password "azeem@2024".

### Run the Client

The client can be run with different CLI arguments for various functionalities.

Step 1: Generate a Keypair
To generate a public-private key pair:

```bash
node client.js generate-keypair
```

Step 2: Set Public Key
To send the generated public key to the server, run the following command, replacing your-password with the server's password:

```bash
node client.js set-public-key your-password
```

Step 3: Sign a Message
To sign a message using the pre-generated private key, run:

```bash
node client.js sign-message "Your messgae here"
```

The output will be a JSON object containing the message and its signature.

Step 4: Verify a Message and Signature
To verify a message and its signature with the server's public key:

```bash
node client.js verify-message "Your message here" "Your signature here"
```

if the signature is valid, the output will be Message verified successfully. Otherwise, you'll get Invalid signature.

License
This project is licensed under the MIT License - see the LICENSE file for details.
