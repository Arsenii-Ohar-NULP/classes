import React from 'react';
import {TransparentField} from "./TransparentField";
import clsx from "clsx";
import TransparentTextArea from "./TransparentTextArea";
import SaveEditButton from "./SaveEditButton";
import CancelEditButton from "./CancelEditButton";
import {IClassData, useClassForm} from "./useClassForm";
import Class from "components/classes/Class";
import {useEditClassMutation} from "../redux/classesApi";

interface EditClassInfoFormProps {
    cls: Class;
    joined: boolean;
    stop: VoidFunction;
}

export function EditClassInfoForm({cls, joined, stop}: EditClassInfoFormProps) {
    const {register, handleSubmit} = useClassForm();
    const [editClass, response] = useEditClassMutation();

    const cleanChangedData = (data: IClassData) => {
        const changedData = {};
        if (!cls) {
            return changedData;
        }
        for (const key of Object.keys(data)) {
            if (cls[key.toLowerCase()] !== data[key] && data[key] !== '') {
                changedData[key.toLowerCase()] = data[key];
            }
        }

        return changedData;
    };

    const hasDataChanged = (data) => {
        return Object.keys(data).length !== 0;
    };

    function saveEditing(data) {
        const changedData = cleanChangedData(data);
        changedData['id'] = cls.id;

        if (!hasDataChanged(changedData)) {
            alert('Class information has not been changed');
            return;
        }
        editClass(changedData)
            .unwrap()
            .then(() => {
                stop()
            })
            .catch(error => {
                console.log(error);
            })
    }

    return <div className="d-flex flex-column align-items-start flex-grow-1">
        <form className="w-100 px-3">
            <div className="pt-lg-3 pb-0">
                <p className="m-0 fs-3">
                    <div className={'d-inline-block'}>
                        <TransparentField
                            defaultValue={cls.title}
                            placeholder={'Enter a title'}
                            id={'titleInput'}
                            register={register('Title')}
                            className={clsx('p-0 m-0')}
                        />
                    </div>

                    {joined && (
                        <span className="badge badge-primary align-middle text-dark bg-primary fs-6 me-2">
                Joined
              </span>
                    )}

                </p>
            </div>
            <div>
                <a>
                    <p className="fs-5 my-0">{`${cls['teacher_first_name']} ${cls['teacher_last_name']}`}</p>
                </a>
            </div>
            <div>
                <p>{cls?.students_number} {cls?.students_number == 1 ? 'student' : 'students'}</p>
            </div>
            <div>
                <TransparentTextArea
                    placeholder="Enter a description"
                    id={'descriptionInput'}
                    defaultValue={cls.description}
                    rows={3}
                    register={register('Description')}
                    className={'p-0 m-0'}
                />
            </div>
                <div className="d-flex flex-sm-row flex-lg-row gap-1">
                    <SaveEditButton
                        handleClick={handleSubmit(saveEditing)}
                        isSaving={response.isLoading}
                    />
                    <CancelEditButton
                        handleClick={stop}
                        isSaving={response.isLoading}
                    />
                </div>
        </form>
    </div>
}