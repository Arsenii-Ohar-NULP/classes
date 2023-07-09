import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function useSignUpForm() {
    const schema = yup.object({
      Username: yup.string().min(8).required(), // TODO: Add some RegEx
      Password: yup.string().min(8).required(),
      FirstName: yup.string().required(),
      LastName: yup.string().required(),
      Email: yup.string().email().required(),
      PhoneNumber: yup.string().required(),
    });
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      getValues,
    } = useForm({
      resolver: yupResolver(schema),
    });
  
    return { register, handleSubmit, errors, getValues };
  }