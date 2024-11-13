import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserSession(WrappedComponent: React.FC) {

    const AuthenticatedComponent = (props: any) => {
        const [user, setUser] = useState<any>(null);
        

        useEffect(() => {

            const usuarioDados = sessionStorage.getItem('user');
            const token = sessionStorage.getItem('token')
            if (token) {
                if (usuarioDados) {
                    const usuarioDadosParse = JSON.parse(usuarioDados);
                    setUser(usuarioDadosParse);
                }
            }
            

        }, []);



        return <WrappedComponent {...props} />;


    }

    return AuthenticatedComponent;



}