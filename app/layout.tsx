"use client";
import React from 'react';
import {useBootstrap} from "components/utils/hooks";
import {Provider} from "react-redux";
import store from "components/redux/store";
import {Metadata} from "next";
import 'components/_base.scss';
import 'animate.css';

export const metadata: Metadata = {
    icons: {
        icon: 'public/favico.ico'
    }
}

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {
    useBootstrap();

    return (
        <html lang={'en'}>
        <body>
        <Provider store={store}>
            {children}
        </Provider>
        </body>
        </html>
    )
}