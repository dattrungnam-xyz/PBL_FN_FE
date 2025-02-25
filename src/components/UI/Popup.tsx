import { Box, SxProps } from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";

export interface PopupProps {
  open?: boolean;
  onClose: () => void;
  sx?: SxProps;
  children?: React.ReactNode;
  anchorEle?: HTMLElement | null;
}

const Popup: React.FC<PopupProps> = ({
  open = true,
  onClose,
  sx,
  children,
  anchorEle,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside of popup and the anchorEle
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      // console.log("anchorEle", anchorEle);
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        (!anchorEle || !anchorEle.contains(event.target as Node))
      ) {
        onClose();
      }
    },
    [onClose, anchorEle],
  );

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <Box
      ref={popupRef}
      sx={{
        position: "absolute",
        display: open ? "block" : "none",
        zIndex: 100,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Popup;
