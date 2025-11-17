# 🎓 EduDApp: Blockchain Education Management System

EduDApp is a **decentralized application (DApp)** that demonstrates a tamper-proof, role-based system for managing an educational institution. All data, including user roles, subjects, and student marks, is stored **100% on-chain** in a Solidity smart contract, ensuring complete transparency and immutability.

---

## ✨ Key Features

* **Role-Based Access Control:** Secure authentication via **MetaMask**. The UI and available actions are unique to the Admin, Teacher, and Student roles.
* **On-Chain Registration:** New users register and enter a **"Pending"** state. The Admin must approve them before they can access their dashboard.
* **Immutable Mark Entry:** Teachers can add and update marks. The Admin can **"Publish"** these results, which permanently locks them from further edits.
* **Transparent Results:** Students can only view their marks after the Admin has **published** the results.
* **Direct Admin Control:** The Admin can bypass the registration queue and create new users (Teachers or Students) directly.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | `React`, `Chakra UI`, `Ethers.js` | User interface, styling, and blockchain interaction. |
| **Backend** | `Solidity` | Smart contract logic and data storage. |
| **Development** | `Hardhat` | Smart contract compilation and deployment framework. |
| **Local Blockchain** | `ganache-cli` | Personal Ethereum blockchain for development. |
| **Wallet** | `MetaMask` | User authentication and transaction signing. |

---

## 🚀 System Flow

The primary application flow is based on a user's status within the smart contract:

| User Status | Description | Resulting Page |
| :--- | :--- | :--- |
| **New User** | Wallet connected, but not registered. | **Register** page. |
| **Pending User** | Has registered, but not yet approved by the Admin. | **Waiting for Approval** page. |
| **Approved User** | Approved by the Admin. | **Role-specific Dashboard** (Admin, Teacher, or Student). |

---

## ⚙️ How to Run This Project Locally

Follow these steps exactly to get the project running on your machine.

### Prerequisites

* **Node.js (v18+):** Download and install from [nodejs.org](https://nodejs.org/).
* **MetaMask:** Install the browser extension from [metamask.io](https://metamask.io/).
* **ganache-cli:** Install globally via your terminal:
    ```bash
    npm install -g ganache-cli
    ```

### Part 1: Backend & Smart Contract Setup (Terminal 1 & 2)

This section sets up your local blockchain and deploys the smart contract.

1.  **Open Terminal 1 and Start Ganache:**
    ```bash
    ganache-cli
    ```
    > 📝 **Note:** Copy the **first (0) Private Key** outputted by Ganache. This is your **Admin wallet**. Keep this terminal running.

2.  **Open Terminal 2 and Navigate to the Contract Folder:**
    ```bash
    cd path/to/your/project/contracts
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Configure Admin Wallet:**
    * Open `contracts/hardhat.config.js`.
    * Find the `accounts` array in the `ganache` network.
    * Paste the Admin Private Key you copied in Step 1.

    ```javascript
    // hardhat.config.js snippet
    // ...
    networks: {
      ganache: {
        url: "[http://127.0.0.1:8545](http://127.0.0.1:8545)",
        accounts: ["YOUR_GANACHE_PRIVATE_KEY_HERE"] // <-- PASTE HERE
      },
    },
    // ...
    ```

5.  **Compile the Contract:**
    ```bash
    npx hardhat compile
    ```

6.  **Deploy the Contract:**
    ```bash
    npx hardhat run scripts/deploy.js --network ganache
    ```
    > 📝 **Note:** The terminal will output `Education contract deployed to: 0x....`. **Copy this address.**

### Part 2: Frontend & React App Setup (Terminal 3)

This section connects your React app to the deployed contract.

1.  **Open Terminal 3 and Navigate to the Client Folder:**
    ```bash
    cd path/to/your/project/client
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure the Frontend:**
    * Open the file `client/src/context/Blockchain.context.js`.

    **A. Paste the Contract Address:**
    Paste the address you copied in Part 1, Step 6.

    ```javascript
    // client/src/context/Blockchain.context.js snippet
    const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE"; // <-- PASTE ADDRESS HERE
    // ...
    ```

    **B. Paste the Contract ABI:**
    * Go to `contracts/artifacts/contracts/Education.sol/Education.json`.
    * Open this JSON file.
    * Find the key named `"abi":`.
    * **Copy the entire array** that starts with `[` and ends with `]`.
    * Paste this entire array into the `contractABI` variable in `Blockchain.context.js`.

    ```javascript
    // client/src/context/Blockchain.context.js snippet
    // ...
    const contractABI = [ // <-- PASTE THE ENTIRE ABI ARRAY HERE
      // ... full array contents ...
    ];
    ```

4.  **Start the React App:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

---

## 👨‍🏫 How to Use the Application: Testing the Workflow

### Step 1: Set Up MetaMask

1.  Open your MetaMask extension.
2.  Select the **Localhost 8545** network.
3.  Click your account icon > **"Import account"**.
4.  Paste the **Admin's Private Key** (copied in Part 1, Step 1). This is your Admin Wallet (Account 1).

### Step 2: The Admin Flow

1.  Go to `http://localhost:3000`.
2.  Click **"Connect Wallet"**. The app recognizes you as the Admin.
3.  You are redirected to the **Admin Dashboard**.

### Step 3: The Student/Teacher Registration Flow

1.  In MetaMask, switch to **Account 2** (or any other Ganache account).
2.  The website refreshes to the **Registration Page**.
3.  Fill out the form (e.g., Name: Test Teacher, Role: Teacher, Subject: Computer Science).
4.  Click **"Register"** and confirm the MetaMask transaction.
5.  You are redirected to the **"Waiting for Approval"** page.

### Step 4: The Approval Flow (Admin)

1.  In MetaMask, **switch back to the Admin account (Account 1)**.
2.  The page refreshes to the Admin Dashboard.
3.  Go to the **"Approve Users"** tab.
4.  Click the **"Approve"** button next to "Test Teacher" and confirm the transaction.

### Step 5: The Teacher Flow (Post-Approval)

1.  In MetaMask, **switch back to the Teacher's account (Account 2)**.
2.  The page refreshes to the **Teacher Dashboard**.
3.  **(Optional):** Repeat Steps 3 & 4 to register and approve a Student.
4.  As the Teacher, navigate to your dashboard to **add marks** for approved students.

### Step 6: The Results Flow (Admin & Student)

1.  **As the Teacher**, add marks for an approved student (e.g., 85).
2.  **As the Student**, log in. You will see subjects but **no marks** (since they are not published).
3.  **As the Admin**, go to the **"Operations"** tab.
4.  Click the **"Publish Results"** button and confirm the transaction.
5.  **As the Teacher**, log in. The marks are now **locked and disabled** from editing.
6.  **As the Student**, log in again. You can now **view your mark: 85**.

---

## 📄 License

This project is licensed under the **MIT License**.