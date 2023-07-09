import React, {useState} from "react";

export function RememberMe({onChange}: { onChange: (boolean) => void }) {
    const [isRemember, setRememberMe] = useState(true);
    return <div className="form-check d-inline-block justify-content-center align-items-center">
        <input
            id="remember-me"
            name="remember-me"
            className="form-check-input"
            type="checkbox"
            data-testid={'remember-me'}
            onChange={() => {
                onChange(!isRemember)
                setRememberMe(!isRemember)
            }}
            formNoValidate
            defaultChecked
        />
        <label htmlFor="remember-me" className="form-check-label">
            Remember me
        </label>
    </div>
}