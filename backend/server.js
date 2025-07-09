const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const threatsRoutes = require('./routes/threats.js');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // 🛠 allow cross-origin requests
app.use(express.json());

app.use('/api/threats', threatsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
