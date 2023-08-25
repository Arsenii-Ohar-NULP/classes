import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

export function useEditAccountForm() {
    const schema = yup
    .object({
      Password: yup.string().notRequired(),
      Phone: yup.string().notRequired().min(8),
      Email: yup.string().email().notRequired(),
    })
    .required();

  return useForm({
    resolver: yupResolver(schema),
  });
}