require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`app is running in ${process.env.NODE_ENV} on port ${port}`);
});
