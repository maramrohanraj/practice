const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;


const uri = 'mongodb://localhost:27017';
const dbName = 'yourDatabaseName'; 


app.use(express.json());


let db;


MongoClient.connect(uri)
    .then((client) => {
        console.log('Database connected');
        db = client.db(dbName); 
    })
    .catch((err) => console.log(err));

app.get('/deleteRecord/:id', async (req, res) => {
    const userId = req.params.id; 

    try {
       
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 1) {
            res.json({ msg: true, acknowledgement: `User with ID ${userId} deleted successfully.` }); 
        } else {
            res.json({ msg: false, acknowledgement: `User with ID ${userId} not found.` }); 
        }
    } catch (error) {
        console.error('Error deleting record:', error);
        res.json({ msg: false, error: 'Error deleting the record' }); 
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
