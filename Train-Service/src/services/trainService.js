const Train = require('../models/train');

class TrainService {
  async getAllTrains() {
    return await Train.findAll();
  }

  async getTrainById(id) {
    return await Train.findByPk(id);
  }

  async createTrain(trainData) {
    return await Train.create(trainData);
  }

  async updateTrain(id, trainData) {
    const train = await Train.findByPk(id);
    if (!train) return null;
    return await train.update(trainData);
  }

  async deleteTrain(id) {
    const train = await Train.findByPk(id);
    if (!train) return false;
    await train.destroy();
    return true;
  }
}

module.exports = new TrainService();