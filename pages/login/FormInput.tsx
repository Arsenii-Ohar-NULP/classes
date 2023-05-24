import PropTypes from "prop-types";
import React from "react";
import {Message} from "react-hook-form";

export function FormInput({errorMessage, id, placeholder, registration, ...other}: {
    errorMessage?: Message;
    id: string;
    placeholder: string;
    registration: object;
    type: string;
}) {
    return <div className="my-2 has-validation">
        <input
            placeholder={placeholder}
            id={id}
            className={"form-control-lg rounded-4 p-1 px-2" + (errorMessage ? " invalid-input" : "")}
            data-testid={id}
            {...registration}
            {...other}
        />
        <div className={'invalid'} data-testid={`${id}-Error`}>{errorMessage ? errorMessage : ""}</div>
    </div>
}

