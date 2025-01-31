const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour'); 

router.get('/', async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json(tours);
    } catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({ error: 'Failed to retrieve tours' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.status(200).json(tour);
    } catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).json({ error: 'Failed to retrieve tour' });
    }
});

// Create a new tour (Admin only)
router.post('/', async (req, res) => {
    try {
      const tour = new Tour(req.body);
      await tour.save();
      res.status(201).json(tour);
    } catch (error) {
      res.status(500).json({ message: 'Error creating tour', error });
    }
  });
  
  // PUT update a tour
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTour = await Tour.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedTour) {
        return res.status(404).json({ message: 'Tour not found' });
      }
      res.status(200).json(updatedTour);
    } catch (error) {
      res.status(500).json({ message: 'Error updating tour', error });
    }
  });
  
// Delete a tour (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        const tourId = req.params.id;
        const deletedTour = await Tour.findByIdAndDelete(tourId);
        if (!deletedTour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.status(200).json({ message: 'Tour deleted successfully' });
    } catch (error) {
        console.error('Error deleting tour:', error);
        res.status(500).json({ message: 'Failed to delete tour', error });
    }
});

module.exports = router;
