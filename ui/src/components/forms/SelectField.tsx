import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { AnyFieldApi, useForm } from "@tanstack/react-form"
import type { ZodEnum } from "zod"
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field"

type FormType = ReturnType<typeof useForm>

interface SelectFieldProps {
    form: FormType | any
    name: string
    label: string
    options: ZodEnum
}

export default function SelectField({ form, name, label, options }: SelectFieldProps) {
    return (
        <form.Field
            name={name}
            children={(field: AnyFieldApi) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                    <Field orientation="responsive" data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                        <Select name={field.name} value={field.state.value} onValueChange={field.handleChange}>
                            <SelectTrigger id={field.name} aria-invalid={isInvalid} className="min-w-[120px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="item-aligned">
                                {Object.values(options.enum).map((option) => {
                                    const optionStr = String(option)

                                    return (
                                        <SelectItem key={optionStr} value={optionStr}>
                                            {optionStr}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                        <FieldContent>{isInvalid && <FieldError errors={field.state.meta.errors} />}</FieldContent>
                    </Field>
                )
            }}
        />
    )
}
