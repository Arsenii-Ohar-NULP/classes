import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

export function useLoginForm() {
    const schema = yup.object(
        {
            Username: yup.string().required().min(8),
            Password: yup.string().required().min(8)
        }
    ).required();
    const {register, handleSubmit, formState: {errors}, getValues} = useForm({
        resolver: yupResolver(schema)
    });

    return {register, handleSubmit, errors, getValues};
}