import express, { text } from 'express'
import { MongoClient, ObjectId} from 'mongodb';
const app = express()
const port = process.env.PORT || 5000;

app.use(express.json());

const mongoUri = "mongodb+srv://paul:acasZuLrCfGydbSh@clouddb.axlt7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
await client.connect();
const database = client.db('todos');
const tasks = database.collection('tasks');

app.get('/', async (req, res) => {
  res.sendStatus(200);
})

app.get('/getAllTasks', async (req, res) => {
    const result = await tasks.find().toArray();
    
    res.json(result)
})

app.get('/getCategoryTasks', async (req, res) => {
  const result = await tasks.find({ "category": parseInt(req.query.id) }).toArray();
  
  res.json(result)
})

app.get('/getUserTasks', async (req, res) => {
  const result = await tasks.find({ "user": parseInt(req.query.id) }).toArray();
  
  res.json(result)
})

app.get('/getTask', async (req, res) => {
  const result = await tasks.findOne({ "_id": ObjectId(req.query.id)});
  
  if(result == null) {
    res.json({
      "success": true, 
      "count": 0
    })
  } else {
    res.json(result)
  }
})

app.post('/addTask', async (req, res) => {
  const task = {
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    user: req.body.user
  }

  const result = await tasks.insertOne(task);

  res.json({
    success: true,
    id: result.insertedId
  })
})

app.put('/updateTaskStatus', async (req, res) => {
  const update = {
    $set: {
      status: req.body.status
    }
  }

  const result = await tasks.updateOne({ "_id": ObjectId(req.query.id)}, update);

  res.json({
    success: true,
    modifiedCount: result.modifiedCount
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
