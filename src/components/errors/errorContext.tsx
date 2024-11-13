'use client'
import { createContext, useContext, useState, ReactNode, FC } from 'react';

interface ModalContextType {
    modalShow: boolean;
    modalTitle: string;
    modalBody: string;
    modalServer: (title: string, body: string) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalBody, setModalBody] = useState('');

    const modalServer = (title: string, body: string ) => {
        setModalTitle(title);
        setModalBody(body);
        setModalShow(true);
    };

    const hideModal = () => setModalShow(false);

    return (
        <ModalContext.Provider value={{ modalShow, modalTitle, modalBody, modalServer, hideModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
