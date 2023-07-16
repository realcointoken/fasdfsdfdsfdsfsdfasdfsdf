import Models from '../main/index'
import express from 'express'

const router = express.Router()

const newModel = new Models()

// @route POST api/swap
// @desc  swap with given direction and amount between AVA and Ethereum
router.post('/api/swap', newModel.createSwap)

// @route POST api/finalizeSwap
// @desc  finalize swap
router.post('/api/finalizeSwap', newModel.finalizeSwap)

export default router
