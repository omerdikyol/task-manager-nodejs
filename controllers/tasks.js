const { json } = require('express')
const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require("../errors/custom-error")

const getAllTasks = asyncWrapper(async (req,res) =>{
    const tasks = await Task.find({})
    res.status(200).json({ tasks})
    // res.status(200).json({ tasks, amount:tasks.length})
    // res
    // .status(200)
    // .json({ success:true, data:{tasks,nbHits:tasks.length} })
})

const createTask = asyncWrapper(async (req,res) =>{
    const task = await Task.create(req.body)
    res.status(201).json({task})
})

const getTask = asyncWrapper(async (req,res,next) =>{
    const {id:taskID} = req.params
    const task = await Task.findOne({_id: taskID})
    if(!task){
        return next(createCustomError(`No task with id: ${taskID}`,404))
        // return res.status(404).json({msg:`No task with id: ${taskID}`})
    }

    res.status(200).json({task})
})


const deleteTask = asyncWrapper(async (req,res) =>{
    const {id:taskID} = req.params
    const task = await Task.findOneAndDelete({_id: taskID})
    if(!task){
        return next(createCustomError(`No task with id: ${taskID}`,404))
    }
    
    res.status(200).json({task})
    // res.status(200).send()
    // res.status(200).json({task:null, status: 'success'})
})

const updateTask = asyncWrapper(async (req,res) =>{
    const {id:taskID} = req.params
    const task = await Task.findOneAndUpdate({_id: taskID}, req.body,
        {new:true, runValidators:true}
        )
    if(!task){
        return next(createCustomError(`No task with id: ${taskID}`,404))
    }

    res.status(200).json({task})
})

// const editTask = async (req,res) =>{     // USING PUT METHOD IN POSTMAN
//     try {
//         const {id:taskID} = req.params
//         const task = await Task.findOneAndUpdate({_id: taskID}, req.body,
//             {
//                 new:true, 
//                 runValidators:true,
//                 overwrite:true
//             })
//         if(!task){
//             return res.status(404).json({msg:`No task with id: ${taskID}`})
//         }

//         res.status(200).json({task})
//     } catch (error) {
//         res.status(500).json({ msg:error })
//     }
// }


module.exports = {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
}