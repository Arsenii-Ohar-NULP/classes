import React from "react";
import {useRouter} from "next/navigation";
import {useAppDispatch} from "components/redux/store";
import InvalidCredentials from "components/errors/InvalidCredentials";
import {logout} from "components/login/AuthService";
import {Button, Modal} from "react-bootstrap";
import {ClassUserDTO} from "components/class/students/ClassUserDTO";
import {useDeleteStudentByIdMutation} from "../../redux/classesApi";

export default function DeleteStudentModal({
                                               classUser,
                                               onDelete,
                                               show,
                                               close,
                                           }: {
    classUser: ClassUserDTO;
    onDelete: () => void;
    show: boolean;
    close: () => void;
}) {
    const [
        deleteStudent,
        {isLoading: isDeleting}
    ] = useDeleteStudentByIdMutation();
    const router = useRouter();
    const dispatch = useAppDispatch();

    function onConfirm() {
        deleteStudent(classUser)
            .unwrap()
            .then(() => {
                onDelete();
                close();
            })
            .catch((error) => {
                if (error instanceof InvalidCredentials) {
                    logout(dispatch, router);
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
                    The student will be deleted and there is no way to undo this. Are you
                    sure?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
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
