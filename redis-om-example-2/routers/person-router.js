import { Router } from 'express'
import { personRepository } from '../om/person.js'

export const router = Router();

router.post('/', async (req, res) => {
    const person = await personRepository.save(req.body)
    res.send(person)
});

router.get('/:id', async (req, res) => {
    const person = await personRepository.fetch(req.params.id)
    res.send(person)
});


router.delete('/:id', async (req, res) => {
    await personRepository.remove(req.params.id)
    res.send({ entityId: req.params.id })
})