import { AnimatePresence, motion } from "framer-motion";
import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, Paper, SxProps } from "@mui/material";

export interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  sx?: SxProps;
  containerSx?: SxProps;
}
const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  sx,
  containerSx,
  children,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          slotProps={{
            backdrop: {
              sx: { display: "none" },
            },
          }}
          sx={{
            overflowY: "scroll",
          }}
        >
          <>
            {/* Custom faded backdrop  */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3, type: "tween" }}
              style={{
                position: "fixed",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
              onClick={onClose}
            ></motion.div>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                ...containerSx,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, type: "tween" }}
              >
                <Paper sx={sx}>
                  <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", right: 10, top: 10 }}
                  >
                    <Close />
                  </IconButton>
                  {children}
                </Paper>
              </motion.div>
            </Box>
          </>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
