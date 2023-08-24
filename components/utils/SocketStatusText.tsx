import React, { FunctionComponent } from 'react'
import styles from './SocketStatus.module.scss';

interface SocketStatusTextProps {
    connected: boolean;
}
 
const SocketStatusText: FunctionComponent<SocketStatusTextProps> = ({connected}) => {
    return ( 
        <div className={styles['socket-status-text']}>
            {connected ? 'Connected' : 'Disconnected'}
        </div>
     );
}
 
export default SocketStatusText;