'use client'

import { ReactNode } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"


interface ModalProps {

    modalTitle: string
    modalBody: ReactNode
    modalShow: boolean;


}

export const ModalSimple = ({ modalTitle, modalBody, modalShow }: ModalProps) => {

    return (
        <Dialog open={modalShow} >
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>{modalTitle}</DialogTitle>
                </DialogHeader>
                {modalBody}

            </DialogContent>
        </Dialog>
    )

}
