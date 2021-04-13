self.addEventListener("message", async srcs => {
  const url = srcs.data;
  const image = await fetch(url);
  const imageBlob = await image.blob();

  self.postMessage({
    url: url,
    image: await imageBlob
  });
});
