import express from 'express';
import './generated/protocol';  // Import from otherFile.ts

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});