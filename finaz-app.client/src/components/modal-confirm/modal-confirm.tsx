import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import { IconPlug, IconTriangleFilled } from "@tabler/icons-react";

export interface IModalConfirmProps {
  title: string;
  open: boolean;
  description: string;
  confirmText?: string;
  onClose?: () => void;
  onConfirm: () => void;
  type: "delete" | "restore";
}

const ModalConfirm = ({
  open,
  type,
  title,
  onClose,
  onConfirm,
  confirmText,
  description,
}: IModalConfirmProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          {type === "delete" ? (
            <IconTriangleFilled style={{ width: 24, height: 24 }} />
          ) : (
            <IconPlug style={{ width: 24, height: 24 }} />
          )}
          {title}
        </DialogTitle>
        <Divider />
        <DialogContent>{description}</DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            onClick={onConfirm}
            color={type === "delete" ? "danger" : "success"}
          >
            {confirmText || "Confirmar"}
          </Button>
          <Button variant="plain" color="neutral" onClick={onClose}>
            Cancelar
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default ModalConfirm;
