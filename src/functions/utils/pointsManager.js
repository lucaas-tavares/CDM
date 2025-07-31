const Users = require('../../database/models/users');


function generatePoints() {
  const rng = Math.random();
  if (rng < 0.6) return randomBetween(5, 15); //comum (60%)
  if (rng < 0.9) return randomBetween(16, 25); // raro (30%)
  return randomBetween(26, 50); // lendário (10%)
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Number}  userId Parâmetro obrigatório - ID do usuário
 * @param {Number} amount Parâmetro obrigatório - Quantia *inteira* a ser removida
 * @param {String} reason Parâmetro obrigatório - Motivo de remover pontos
 */
async function addPoints(userId, amount, reason = 'Sistema') {
  if (amount <= 0) return false;
  const userDb = await Users.findById(userId);
  if (!userDb) return false;

  userDb.points = Math.floor((userDb.points || 0) + amount);
  await userDb.save();

  console.log(`[PONTOS] +${amount} para ${userId} - Motivo: ${reason}`);
  return true;
}

/**
 * @param {Number}  userId Parâmetro obrigatório - ID do usuário
 * @param {Number} amount Parâmetro obrigatório - Quantia *inteira* a ser removida
 * @param {String} reason Parâmetro obrigatório - Motivo de remover pontos
 */
async function removePoints(userId, amount, reason = 'Sistema') {
  if (amount <= 0) return false;
  const userDb = await Users.findById(userId);
  if (!userDb) return false;

  userDb.points = Math.max(0, userDb.points - amount);
  await userDb.save();

  console.log(`[PONTOS] -${amount} de ${userId} - Motivo: ${reason}`);
  return true;
}


function bonus(level) {
  const table = {
    10: 100,
    20: 200,
    30: 300,
    40: 400,
    50: 500,
    60: 600,
    70: 700,
    80: 800,
    90: 900,
    100: 1000,
  };
  return table[level] || 0;
}

module.exports = { generatePoints, addPoints, removePoints, bonus };