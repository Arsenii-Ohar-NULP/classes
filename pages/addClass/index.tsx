import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createClass, uploadThumbnail } from 'components/class/ClassService';
import { useAppSelector } from 'components/redux/store';
import { useLogout } from 'components/login/AuthService';
import InvalidCredentials from 'components/errors/InvalidCredentials';
import TitleInput from '../../components/addClass/TitleInput';
import FileInput from 'components/addClass/FileInput';
import AddClassButton from '../../components/addClass/AddClassButton';
import { BadRequest } from 'components/errors/BadRequest';
import { useRouter } from 'next/router';
import DescriptionInput from 'components/addClass/DescriptionInput';

type ClassData = {
  Title: string;
  Description: string;
  Image: File[];
};

function useClassForm(){
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

  return {register, handleSubmit, errors};
}

export default function AddClassPage() {
  const {register, handleSubmit, errors} = useClassForm();
  const userId = useAppSelector((state) => state.auth?.user?.id);
  const logout = useLogout();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const onSubmit = (data: ClassData) => {
    try {
      const file = data.Image[0];
      const reader = new FileReader();

      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          setIsAdding(true);
          const classResponse = await createClass({
            title: data.Title,
            description: data.Description,
            teacher_id: userId,
          });
          await uploadThumbnail({ image: base64String, id: classResponse.id });
          await router.push('/classes');
        } catch (error) {
          if (error instanceof InvalidCredentials) {
            logout();
          }

          if (error instanceof BadRequest) {
            alert(error.message);
          }
        }
        finally{
          setIsAdding(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container p-1 d-flex flex-column align-items-center">
      <h1 className="p-2">Add a class</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TitleInput
          placeholder="Enter a title"
          id="Title"
          errorMessage={errors?.Title?.message?.toString()}
          registration={register('Title')}
        />
        <DescriptionInput
          errorMessage={errors?.Description?.message?.toString()}
          registration={register('Description')}
        />
        <FileInput
          id="ImageInput"
          placeholder="Upload a class thumbnail"
          registration={register('Image')}
        />
        <hr />
        <AddClassButton disabled={isAdding}/>
      </form>
    </div>
  );
}
