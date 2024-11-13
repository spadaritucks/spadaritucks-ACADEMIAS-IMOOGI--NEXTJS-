'use client'
import { createContext, useContext, useState, ReactNode, FC } from 'react';

interface ModalContextType {
    modalShow: boolean,
    modalTitle: string,
    modalBody: ReactNode
    showModal: (title: string, body: ReactNode) => void;
    hideModal: () => void;
}
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalEditUserProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState<ReactNode>(null);

    const showModal = (title: string, body: ReactNode) => {
        setModalTitle(title)
        setModalBody(body)
        setModalShow(true)
    }

    const hideModal = () => setModalShow(false);

    return (
        <ModalContext.Provider value={{modalShow,modalTitle,modalBody,showModal,hideModal}}>
            {children}
        </ModalContext.Provider>
    )

    

}

export const useUserEditModal = (): ModalContextType =>{
    const context = useContext(ModalContext);
    if(context == undefined){
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context
}




