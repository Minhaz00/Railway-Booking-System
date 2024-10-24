const trainService = require('../services/trainService');

class TrainController {
  async getAllTrains(req, res) {
    try {
      const trains = await trainService.getAllTrains();
      res.json(trains);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTrainById(req, res) {
    try {
      const train = await trainService.getTrainById(req.params.id);
      if (!train) {
        return res.status(404).json({ error: 'Train not found' });
      }
      res.json(train);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTrain(req, res) {
    try {
      const train = await trainService.createTrain(req.body);
      res.status(201).json(train);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTrain(req, res) {
    try {
      const train = await trainService.updateTrain(req.params.id, req.body);
      if (!train) {
        return res.status(404).json({ error: 'Train not found' });
      }
      res.json(train);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTrain(req, res) {
    try {
      const success = await trainService.deleteTrain(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Train not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TrainController();