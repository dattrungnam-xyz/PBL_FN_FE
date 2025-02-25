import { useEffect, useRef, useState } from "react";
import { getFileNameFromPath } from "../features/admin/vocasets/utils/helper";

/**
 *
 * @param defaultImage default image src (url)
 * @returns
 */
export default function useFileInput(defaultImage: string = "") {
  const [fileSrc, setFileSrc] = useState<string>(defaultImage);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fileName = getFileNameFromPath(
    fileInputRef.current?.files?.[0]?.name || defaultImage,
  ) as string;

  const chooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleChangeFileInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onDoneParseFile?: (fileSrc: string) => void,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();

      // Add resolver
      reader.onload = () => {
        const parsedUrl = reader.result as string;

        setFileSrc(parsedUrl);
        onDoneParseFile?.(parsedUrl);
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setFileSrc(defaultImage);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [defaultImage]);

  return {
    fileSrc,
    fileName,
    fileInputRef,
    chooseFile,
    handleChangeFileInput,
    setFileSrc,
  };
}
