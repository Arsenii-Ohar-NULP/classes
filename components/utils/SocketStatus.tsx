import React, { FunctionComponent, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client';
import styles from './SocketStatus.module.scss';
import SocketStatusText from './SocketStatusText';
import clsx from 'clsx';
interface SocketStatusProps {
    socket: Socket
}
 
const SocketStatus: FunctionComponent<SocketStatusProps> = ({socket}) => {
    const [connected, setConnected] = useState<boolean>();

    function changeStatus() {
        setConnected(socket.connected);
    }

    useEffect(() => {
        changeStatus();
        socket.on('connect', changeStatus)
        socket.on('disconnect', changeStatus);

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        }
    }, [connected])

    return ( 
        <div className={styles['socket-status-box']}>
            <div className={
                clsx(
                    styles['socket-status'],
                        connected && styles['socket-status-connected'],
                        !connected && styles['socket-status-disconnected']
                )
                }>
                <SocketStatusText connected={connected}/>
            </div>
        </div>    
     );
}
 
export default SocketStatus;