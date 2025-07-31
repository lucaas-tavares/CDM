function drawCoverImage(
  ctx,
  image,
  targetX,
  targetY,
  targetWidth,
  targetHeight
) {
  const imageAspect = image.width / image.height;
  const targetAspect = targetWidth / targetHeight;

  let sourceX, sourceY, sourceWidth, sourceHeight;

  if (imageAspect > targetAspect) {
    sourceHeight = image.height;
    sourceWidth = image.height * targetAspect;
    sourceX = (image.width - sourceWidth) / 2;
    sourceY = 0;
  } else {
    sourceWidth = image.width;
    sourceHeight = image.width / targetAspect;
    sourceX = 0;
    sourceY = (image.height - sourceHeight) / 2;
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    targetX,
    targetY,
    targetWidth,
    targetHeight
  );
}

module.exports = { drawCoverImage };
