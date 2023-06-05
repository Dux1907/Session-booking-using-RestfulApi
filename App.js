const express = require("express");
const { v4: uuidv4 } = require("uuid");
const User = require("./userSchema");
const Session = require("./sessionSchema");
const authMiddleware = require("./authMiddleware");
const db = require("./db");
//creates the instance of the express application.here the app is the application itself.
const app = express();
app.use(express.json());
app.post("/register", async (req, res) => {
  try {
    const { universityId, password } = req.body;
    const user = new User({
      universityId,
      password,
    });
    let a = await user.save();
    res.send(a);
  } catch (error) {
    res.send({ error: "Internal server error" });
  }
});
// Generate token for student A
app.post("/student/login", async (req, res) => {
  try {
    const { universityId, password } = req.body;
    const user = await User.findOne({ universityId, password });
    if (user) {
      const token = uuidv4();
      user.token = token;
      await user.save();
      res.send({ token });
    } else {
      res.send({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.send({ error: "Internal server error" });
  }
});
app.post('/sessions', async (req, res) => {
    try {
      const { date, day, time, id, booked,student } = req.body;
      const session = new Session({ date, day, time, id, booked,student });
      await session.save();
      res.send({ message: 'Session created successfully' });
    } catch (error) {
      console.error(error);
      res.send({ error: 'Failed to create session' });
    }
  });

// Get available sessions with the dean
app.get('/student/sessions',authMiddleware, async (req, res) => {
    try {
      const sessions = await Session.find({booked:false},{});
      res.send({ sessions });
    } catch (error) {
      console.error(error);
      res.send({ error: 'Failed to retrieve sessions' });
    }
  });

// Book a session with the dean
app.post("/student/book-session", authMiddleware, async (req, res) => {
    const { sessionId } = req.body;
   // console.log(sessionId)
  try {
      const session = await Session.findOne({ id: sessionId }, {});
     // console.log(session)
    if (session && !session.booked) {
        session.booked = true;
     //   console.log(req)
      session.student = req.user.universityId;
      await session.save();
      res.send({ message: "Session booked successfully" });
    } else {
      res.send({ error: "Invalid session or already booked" });
    }
  } catch (error) {
    res.send({ error: "Internal server error" });
  }
});

// Generate token for the dean
app.post("/dean/login", async (req, res) => {
    try {
        const { universityId, password } = req.body;
        const user = await User.findOne({ universityId, password });
        if (user) {
          const token = uuidv4();
          user.token = token;
          await user.save();
          res.send({ token });
        } else {
          res.send({ error: "Invalid credentials" });
        }
      } catch (error) {
        res.send({ error: "Internal server error" });
      }
});
// Get pending sessions for the dean
app.get("/dean/pending-sessions", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({
      booked: true,
    });
    res.send({ sessions });
  } catch (error) {
    res.send({ error: "Internal server error" });
  }
});

// Initialize the database connection
db.connect();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('connected');
});
