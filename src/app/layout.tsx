import './globals.css'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "../components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ModalProvider } from '@/components/errors/errorContext';
import GlobalModal from "@/components/errors/GlobalModal";
import { ChakraProvider } from '@chakra-ui/react'
import { ModalEditUserProvider } from '@/components/user-modals-edit/EditUserContext';
import EditUserModal from '@/components/user-modals-edit/EditUserModal';



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ACADEMIAS IMOOGI",
  description: "Academia da Familia Brasileira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body className={inter.className}>


        <ChakraProvider>
          <ModalEditUserProvider>
            <ModalProvider>
              {children}
              <GlobalModal />
              <EditUserModal />
            </ModalProvider>
          </ModalEditUserProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
