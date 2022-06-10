export async function a2blob(b64: string) {
  return await (
    await fetch(b64)
  ).blob;
}
