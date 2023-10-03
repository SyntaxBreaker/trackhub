function secondsToDhms(time: number) {
  let d = Math.floor(time / (3600 * 24));
  let h = Math.floor((time % (3600 * 24)) / 3600);
  let m = Math.floor((time % 3600) / 60);
  let s = Math.floor(time % 60);

  let dDisplay = d > 0 ? d + "D " : "";
  let hDisplay = h > 0 ? h + "H " : "";
  let mDisplay = m > 0 ? m + "M " : "";
  let sDisplay = s > 0 ? s + "S" : "";

  return dDisplay + hDisplay + mDisplay + sDisplay;
}

export { secondsToDhms };
