const express = require('express');
const cors = require('cors');


const errorHandler = require('./src/middleware/errorHandler');
const authRouter = require('./src/routes/auth');
const postsRouter = require('./src/routes/posts');
const versionsRouter = require('./src/routes/versions');
const searchRouter = require('./src/routes/search');

const app = express();

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', apiRouter);
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/posts', versionsRouter);
app.use('/api/search', searchRouter);

app.use(errorHandler);

module.exports = app;
