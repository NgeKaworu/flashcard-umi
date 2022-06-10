export const videoInfo = (file: File) =>
  new Promise<HTMLVideoElement>((resolve, reject) => {
    const ele = document.createElement('video');
    const b64 = URL.createObjectURL(file);
    ele.onloadeddata = () => {
      resolve(ele);
      URL.revokeObjectURL(b64);
    };

    ele.onerror = () => {
      reject('video 后台加载失败');
      URL.revokeObjectURL(b64);
    };

    ele.src = b64;
  });

// 截图器
export class ImageCapture {
  static canvas = document.createElement('canvas');
  static ctx = ImageCapture.canvas.getContext('2d');

  static capture(video: HTMLVideoElement) {
    const vw = video.videoWidth,
      vh = video.videoHeight;

    ImageCapture.canvas.width = vw;
    ImageCapture.canvas.height = vh;

    ImageCapture.ctx?.drawImage(video, 0, 0, vw, vh);
    return ImageCapture.canvas.toDataURL('image/png');
  }
}
