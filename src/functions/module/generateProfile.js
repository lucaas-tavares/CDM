const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { drawCoverImage } = require("../utils/drawCover");

module.exports = async function generateProfile(client, user, userDB, Users) {
  const canvas = createCanvas(1280, 960);
  const ctx = canvas.getContext("2d");
  const avatar = user.avatarURL({
    extension: "png",
    dynamic: true,
    size: 2048,
  });

  const layoutProfile = await loadImage("https://i.imgur.com/UHJHIyQ.png");

  const bannerUrl =
    userDB?.banner && userDB.banner.startsWith("http")
      ? userDB.banner
      : user.bannerURL({ size: 2048, dynamic: true }) ||
        "https://i.imgur.com/lThmzF6.png";

  const bannerProfile = await loadImage(bannerUrl);

  drawCoverImage(ctx, bannerProfile, 0, 0, canvas.width, 350);
  ctx.drawImage(layoutProfile, 0, 0);

  const userAvatar = await loadImage(avatar);

  const x = 186;
  const y = 300;
  const radius = 126;
  ctx.save();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(userAvatar, x - radius, y - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.strokeStyle = "#4c4c4c";
  ctx.lineWidth = 4;
  ctx.stroke();

  const text = user.displayName;
  const fontSize = 50;
  const fontFamily = "Impact";
  const startX = 340;
  const yy = 360;
  const letterSpacing = 5;

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  let xx = startX;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    ctx.fillText(char, xx, yy);
    const metrics = ctx.measureText(char);
    xx += metrics.width + letterSpacing;
  }

  ctx.font = `16px Arial`;
  ctx.fillStyle = "#b9b9b9ff";
  ctx.fillText(user.id, 372, 382);

  ctx.font = `22px Impact`;
  ctx.fillStyle = "#b9b9b9ff";
  ctx.fillText(userDB.points.toLocaleString(), 490, 474);

  const allUsers = await Users.find().sort({ points: -1 });
  const rank = allUsers.findIndex((x) => x._id == user.id) + 1;

  ctx.font = `22px Impact`;
  ctx.fillStyle = "#b9b9b9ff";
  ctx.fillText(`#${rank.toLocaleString()}`, 710, 474);

  const level = userDB.level.toLocaleString();

  ctx.font = `50px Impact`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(level.split("").length < 2 ? `0${level}` : level, 1150, 340);

  ctx.font = `12px Arial`;
  ctx.fillStyle = "#b9b9b9ff";
  ctx.fillText(userDB.xp.toLocaleString(), 1160, 365);

  const xpMultiplier = 1.2;
  const baseXp = 1000;
  const nextLevelXp = Math.floor(baseXp * userDB.level ** xpMultiplier);

  ctx.font = `12px Arial`;
  ctx.fillStyle = "#b9b9b9ff";
  ctx.fillText(nextLevelXp.toLocaleString(), 1160, 385);

  function limitText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  let aboutme = limitText(
    userDB.aboutme || "Mude o que vai aqui utilizando o botão abaixo.",
    260
  );
  let maxChar = 100;
  let lineHeight = 30;
  let textStartX = 65;
  let textStartY = 600;

  ctx.font = "23px Arial";
  ctx.fillStyle = "#b9b9b9ff";

  let lines = [];
  let currentLine = "";

  for (let i = 0; i < aboutme.length; i++) {
    if (i !== 0 && i % maxChar === 0) {
      lines.push(currentLine);
      currentLine = "";
    }
    currentLine += aboutme[i];
  }
  lines.push(currentLine);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], textStartX, textStartY + i * lineHeight);
  }

  ctx.font = `bold 25px Arial`;
  ctx.fillStyle = "#b9b9b9ff";
  ctx.fillText("Nenhuma", 215, 784);

  ctx.font = `bold 25px Arial`;
  ctx.fillStyle = "#b9b9b9ff";
  ctx.fillText(userDB.bumps.toLocaleString(), 745, 784);

  ctx.font = `bold 25px Arial`;
  ctx.fillStyle = "#b9b9b9ff";
  ctx.fillText("Não", 165, 850);

  ctx.font = `bold 25px Arial`;
  ctx.fillStyle = "#b9b9b9ff";
  ctx.fillText(userDB.achievements.length, 805, 850);

  return canvas.toBuffer("image/png");
};
