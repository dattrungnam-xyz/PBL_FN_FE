export function getPlaceholderImage(width: number, height: number) {
  return `https://placehold.co/${width}x${height}`;
}

export function file2Base64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function fileList2Base64(fileList: FileList): Promise<string> {
  return file2Base64(fileList[0]);
}

export function hasFileData(data: unknown) {
  return data instanceof FileList && data.length > 0;
}

export function checkFileTypeIfExistValue(
  fileList: FileList | undefined,
  fileType: string
) {
  if (fileList && fileList.length > 0) {
    const file = fileList[0];
    return file.type.includes(fileType);
  }

  return true;
}

export function mustBeImageIfExistValue(fileList?: FileList) {
  return checkFileTypeIfExistValue(fileList, "image");
}

export function mustBeAudioIfExistValue(fileList?: FileList) {
  return checkFileTypeIfExistValue(fileList, "audio");
}

export function shuffleArray<T>(array: T[]): T[] {
  const cloneArr = [...array];
  for (let i = cloneArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
    [cloneArr[i], cloneArr[j]] = [cloneArr[j], cloneArr[i]]; // Swap elements
  }
  return cloneArr;
}

export function secondToMinuteSecondFormat(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function validateEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
