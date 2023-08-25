"use client";
import React from 'react';
import {Provider} from "react-redux";
import {setupStore} from "components/redux/store";

export default function Providers({children}: {children: React.ReactNode}){
    return <Provider store={setupStore()}>
            {children}
        </Provider>
}