'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useModal } from './errorContext';

const GlobalModal = () => {
    const { modalShow, modalTitle, modalBody, hideModal } = useModal();

    return (
        <Dialog open={modalShow} onOpenChange={hideModal}>
            <DialogContent className="sm:max-w-[425px] w-[60vw] min-w-[300px] max-w-[90vw] p-6 sm:p-4 sm:w-[90vw]">
                <DialogHeader>
                    <DialogTitle>{modalTitle}</DialogTitle>
                </DialogHeader>
                <div>{modalBody}</div>
                <DialogFooter>
                    <Button variant="imoogi" onClick={hideModal}>
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GlobalModal;