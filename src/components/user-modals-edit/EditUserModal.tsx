'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useUserEditModal } from './EditUserContext';
import '../../Assets/css/components-styles/UserModals-style.css'

const EditUserModal = () => {
    const { modalShow, modalTitle, modalBody, hideModal } = useUserEditModal();

    return (
        <Dialog open={modalShow} onOpenChange={hideModal}>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>{modalTitle}</DialogTitle>
                </DialogHeader>
                {modalBody}
              
            </DialogContent>
        </Dialog>
    );
};

export default EditUserModal;