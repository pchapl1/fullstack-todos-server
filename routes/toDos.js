var express = require('express');
const { uuid } = require('uuidv4');
var router = express.Router();

const {db} = require("../../mongo")

// const mockTodos = [{
//     id: "4387f4d8-aeac-4559-9f1b-3c5d537c955c",
//     title: "Implement Fullstack ToDo List",
//     description: "Implement the fullstack todo list application.",
//     isComplete: false,
//     priority: "High",
//     creationDate: new Date(),
//     lastModified: new Date(),
//     completedDate: null
//   }, {
//     id: "e365f13c-4c1d-4ee1-8a66-3dbbbab71f0d",
//     title: "Create /all route for mock data",
//     description: "Create an express route that will respond with the mock todo list.",
//     isComplete: false,
//     priority: "High",
//     creationDate: new Date(),
//     lastModified: new Date(),
//     completedDate: null
//   }, {
//     id: "08dd1f20-7d31-4120-89ed-343d4006a7cb",
//     title: "Create a home page in the client",
//     description: "Create a Home Page in React that will display all the todos.",
//     isComplete: false,
//     priority: "High",
//     creationDate: new Date(),
//     lastModified: new Date(),
//     completedDate: null
//   }, {
//     id: "98a06f8f-50c9-4832-9d2d-daa45543db00",
//     title: "Create the todo card component",
//     description: "Create a react ToDoCard component that will be rendered for each todo on the home page.",
//     isComplete: false,
//     priority: "Medium",
//     creationDate: new Date(),
//     lastModified: new Date(),
//     completedDate: null
//   }, {
//     id: "7c5d70bb-2a00-4009-9bb8-1bb163fb501f",
//     title: "Test basic application with mock data",
//     description: "Visit the client Home Page to see the todo's displayed as a list.",
//     isComplete: false,
//     priority: "Medium",
//     creationDate: new Date(),
//     lastModified: new Date(),
//     completedDate: null
//   }]

/* GET home page. */
router.get('/all', async function(req, res, next) {
    try {

        // search the db for the todos 
        const toDos= await db().collection("todos").find({

        }).toArray()

        // if todos not found, return error message
        if (!toDos) {

            res.json({
                success: false,
                message: 'no to dos found'
            })
            return
        }

        res.json({
            success: true,
            toDos: toDos
        })


    } catch (e) {
        console.log(`error in get all todos: ${e}`)
        res.json({
            success: false,
            error: e.toString()
        })
    }


});

/* create to do */
router.post('/create-one', async function(req, res, next) {

    console.log('in create one ======================================')
    const title = req.body.title
    const description = req.body.description
    const priority = req.body.priority

    const toDoData = {
        id : uuid(),
        title,
        description,
        isComplete: false,
        priority,
        creationDate: new Date(),
        lastModified: new Date(),
        completedDate: null

    }

    await db().collection('todos').insertOne(toDoData)
    
    console.log(toDoData)

    res.json({
        success:true, 
        todo: toDoData
    })
});

router.put('/update-one/:id', async function(req, res,next){

    const toDoToUpdate = req.params.id
    const isComplete = req.body.isComplete

    if (req.body.isComplete === undefined) {
        res.json({
            success: false,
            message: "is complete must be defined"
        })
    }

    if (req.body.isComplete === true) {
        const toDo = await db().collection('todos').findOneAndUpdate({
            id: toDoToUpdate
        },
        {
            $set: {
                isComplete: false,
                completedDate: null
            }
        }
        
        )
    } else {
        
        const toDo = await db().collection('todos').findOneAndUpdate({
            id: toDoToUpdate  
        },
        {$set: {
            isComplete: true,
            completedDate: new Date()
        }
    }
    )
}

    res.json({
        success: true
    })
})


router.delete('/delete-one/:id', async function(req, res, next){

    const toDoToDelete = req.params.id

    const toDo = await db().collection('todos').deleteOne({
        id: toDoToDelete
    })

    res.json({
        success: true
    })

})

module.exports = router;