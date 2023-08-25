import React from 'react';
import {useRouter} from 'next/navigation';
import {Button, Modal} from 'react-bootstrap';
import {useLogout} from 'components/login/AuthService';
import {useDeleteClassByIdMutation} from "../redux/classesApi";


export default function DeleteClassModal({
                                             classId,
                                             show,
                                             close
                                         }: {
    classId: number;
    show: boolean;
    close: () => void;
}) {
    const [removeClass, {isLoading: isDeleting}] = useDeleteClassByIdMutation();
    const router = useRouter();
    const logout = useLogout();

    function deleteClass() {
        removeClass(classId).unwrap().then(() => {
            router.push('/main/classes');
        })
            .catch((error) => {
                if ("status" in error){
                    const status = error['status'];

                    if (status === 401){
                        logout()
                    }
                }
            })
    }

    return (
        <>
            <Modal show={show} backdrop={true} onHide={close} keyboard={false}>
                <Modal.Header closeButton={!isDeleting}>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The class will be deleted and there is no way to undo this. Are you
                    sure?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={deleteClass} disabled={isDeleting}>
                        Delete
                    </Button>
                    <Button variant="success" onClick={close} disabled={isDeleting}>
                        No, take me back
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}