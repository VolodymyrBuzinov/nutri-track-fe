import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
}

export const ConfirmationPopup = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading = false,
}: ConfirmationPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description ?? ""}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            Відміна
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Підтвердження..." : "Підтвердити"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
