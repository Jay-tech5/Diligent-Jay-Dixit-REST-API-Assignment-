const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
