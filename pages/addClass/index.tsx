import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

function FormInput({ errorMessage, id, placeholder, registration, ...other }:  {
    errorMessage?: string
    id: string,
    placeholder: string,
    registration: object
}) {
    return <div className="my-2 has-validation">
        <input
            placeholder={placeholder}
            id={id}
            className={"form-control-lg rounded-4 p-1 px-2" + (errorMessage ? " invalid-input" : "")}
            {...registration}
            {...other}
        />
        <div className={'invalid'}>{errorMessage ? errorMessage : ""}</div>
    </div>
}

export default function AddClassPage() {
  const schema = yup
    .object({
      Title: yup.string().required(),
      Description: yup.string().required(),
    })
    .required();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  return <div>
    <form>
        <FormInput placeholder='Enter a title' id="Title" errorMessage={errors?.Title?.message?.toString()} registration={register("Title")}/>
        <FormInput placeholder='Enter a description' id="Title" errorMessage={errors?.Title?.message?.toString()} registration={register("Title")}/>
    </form>
  </div>;
}
