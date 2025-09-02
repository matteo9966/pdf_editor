export const dowbloadBlob = (blob: Blob) => {
  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobURL;
  a.download = "This pdf has annotations🎉";
  a.style.display = "none";
  document.body.append(a);
  a.click();
  URL.revokeObjectURL(blobURL);
  a.remove();
};
