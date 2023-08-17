import React from 'react';
import {Metadata} from "next";
import 'components/_base.scss';
import 'animate.css';
import Providers from "components/Providers";

export const metadata: Metadata = {
    icons: {
        icon: 'public/favico.ico'
    }
}

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {

    return (
        <html lang={'en'}>
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}