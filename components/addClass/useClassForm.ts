import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

export default function useClassForm() {
    const schema = yup
        .object({
            Title: yup.string().required(),
            Description: yup.string().required(),
        })
        .required();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    return {register, handleSubmit, errors};
}