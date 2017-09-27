const ObjectID = require('mongodb').ObjectId;

module.exports = function(app, db){
    app.get('/students', (req,res) => {

        db.collection('students').find().toArray((err, data) => {
            if (err) throw error;

            res.send({"Success": true, data})
        });

    });

    app.delete('/students/:id', (req,res) => {
        const id = req.params.id;
        const details = {
            '_id': new ObjectID(id)
        };
        db.collection('students').remove(details, (err, item) => {
            if(err){
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send('Student ' + id + ' deleted!');
            }
        })
    });

    app.put('/students/:id', (req, res) => {
        const id = req.params.id;
        const details = {
            '_id': new ObjectID(id)
        };
        const students = {
            name: req.body.name,
            course: req.body.course,
            grade: req.body.grade
        };
        db.collection('students').update(details, students, (err, result) => {
            if(err){
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(students);
            }
        })
    });


    app.post('/students', (req, res) => {
        const students = {
            id:Number(req.body.id),
            name: req.body.name,
            course: req.body.course,
            grade:Number(req.body.grade)
        };
        console.log("students are:????",req);
        db.collection('students').insert(students, (err, result) => {
            if(err){
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });
};