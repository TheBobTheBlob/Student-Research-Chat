import type { AnyFieldApi, useForm } from "@tanstack/react-form"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type FormType = ReturnType<typeof useForm>

interface TextFieldProps {
    form: FormType | any
    name: string
    label: string
    type?: string
    placeholder?: string
}

export default function TextField({ form, name, label, type, placeholder }: TextFieldProps) {
    return (
        <form.Field
            name={name}
            children={(field: AnyFieldApi) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                return (
                    <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                        <Input
                            type={type}
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                            placeholder={placeholder}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                )
            }}
        />
    )
}
