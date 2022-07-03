const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const app = express()
const port = 4000;

app.use(express.json())
app.use(cors())

// mongodb connect


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wawxe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const database = client.db('Voluntiar');
      const voluntiarCollection = database.collection('addVoluntiar');
      const eventCollection =  database.collection('events')
    //   const adminCollection = database.collection('admin')

    // post api
      app.post("/add-voluntiar", async(req,res)=>{
            const body = req.body
            const results =  await voluntiarCollection.insertOne(body)
            res.json(results)
      })

    //   get api 
        app.get("/add-voluntiar" , async(req,res)=>{
            const cursor =  voluntiarCollection.find({})
            const results =  await cursor.toArray()
            res.send(results)
        })
    //   get api for specipic id
        app.get("/events/:id",async(req,res)=>{
                const id = req.params.id;
                const query =  {_id :  ObjectId(id)}
                const result  = await voluntiarCollection.findOne(query)
                res.send(result)        
        })
 
        // register post api
        app.post("/events",async(req,res)=>{
            const body = req.body
            const result =  await eventCollection.insertOne(body)
            res.json(result)
        })

        // geting show all events and all user information
         app.get('/all-events-show',async(req,res)=>{
            const cursors =  eventCollection.find({})
            const result =  await cursors.toArray()
            res.send(result)
         })
        // events geting
        app.get('/show-events-by-mail',async(req,res)=>{
          const cursor = eventCollection.find({email:req.headers.email})
            const result = await cursor.toArray()
            res.send(result)
        })
        //  delete api
         app.delete('/events/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await eventCollection.deleteOne(query)
            res.json(result)
         })
        //   delete api for remove events information from all events(of admin)

         app.delete("/allEvents/:id",async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await eventCollection.deleteOne(query)
            res.json(result)
        })

        //  addmin added in database (put api)
         app.put('/users/admin',async(req,res)=>{
                const user = req.body;
                const filter = {email : user.email}
                const updateDoc = {$set: {role: "admin"}};
                const result = await eventCollection.updateOne(filter,updateDoc)
                res.json(result)
                
         })
        //   check admin user or admin (get api)
         app.get('/users/:email',async(req,res)=>{
              const email = req.params.email
              const query = {email:email}
              const user = await eventCollection.findOne(query)
              let isAdmin = false;
              if (user?.role === "admin") {
                    isAdmin = true
               }
               res.json({admin : isAdmin})
         })
        
        //  put api for Will the product be pending or approve
        app.put("/update-status",async(req, res) => {
            const {id,status} = req.body
            const filter = {_id : ObjectId(id)}
            const updateDoc = {
                 $set:{
                    status 
                 }
            }
            const result = await eventCollection.updateOne(filter,updateDoc)
            res.json(result)
        });
 
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("helo voluntiar backend,,i am comming sooon ")
})

app.listen(port , ()=>{
    console.log('app running this port' , port);
})