import React from 'react';

function FormField({ label, type, name, value, onChange }) {
    return (
        <div>
            <label htmlFor={name}>
                {label}
                {type === 'textarea' ? (
                    <textarea
                        type={type}
                        value={value}
                        name={name}
                        onChange={onChange}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        name={name}
                        onChange={onChange}
                    />
                )}  
            </label>
        </div>
    )
}

export default FormField;