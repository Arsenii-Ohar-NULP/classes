import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

function useClassForm() {
    const schema = yup.object(
        {
            Title: yup.string(),
            Description: yup.string(),
            Image: yup.object().required()
        }
    ).required();
    const {register, handleSubmit, formState: {errors}, getValues} = useForm({
        resolver: yupResolver(schema)
    });
    
    return {register, handleSubmit, errors, getValues};
    
}

export interface IClassData {
    Title: string;
    Description: string;
}

export { useClassForm };