const userDB = require('../../database/models/users');


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
  const userData = await userDB.findById(userId);
  if (!userData) return false;

  userData.points = Math.floor((userData.points || 0) + amount);
  await userData.save();

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
  const userData = await userDB.findById(userId);
  if (!userData) return false;

  userData.points = Math.max(0, userData.points - amount);
  await userData.save();

  console.log(`[PONTOS] -${amount} de ${userId} - Motivo: ${reason}`);
  return true;
}


function milestoneBonus(level) {
  const table = {
    10: 100,
    25: 300,
    50: 750,
    100: 2000
  };
  return table[level] || 0;
}

module.exports = { generatePoints, addPoints, removePoints, milestoneBonus };