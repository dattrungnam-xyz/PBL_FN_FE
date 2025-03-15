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

export function validateEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function getPhoneValidator(errorMessage?: string) {
  return {
    pattern: {
      value: /^[0-9]{10,11}$/,
      message: errorMessage || "Phone number must be 10 or 11 digits",
    },
  };
}
