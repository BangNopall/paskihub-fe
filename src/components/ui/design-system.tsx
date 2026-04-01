import React from "react";
import {
  Button as BaseButton,
  ButtonProps as BaseButtonProps,
  TextInput as BaseTextInput,
  TextInputProps as BaseTextInputProps,
  Badge as BaseBadge,
  BadgeProps as BaseBadgeProps,
  Checkbox as BaseCheckbox,
  CheckboxProps as BaseCheckboxProps,
} from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react/types";

// ==========================================
// 1. BUTTON COMPONENT
// ==========================================
export interface ButtonProps extends Omit<BaseButtonProps, "color"> {
  variant?: "Primary" | "Secondary";
}

const customButtonTheme: CustomFlowbiteTheme["button"] = {
  base: "group flex items-center justify-center font-['Poppins',sans-serif] transition-all duration-200 outline-none focus:ring-4",
  color: {
    Primary:
      "bg-[#ff7558] text-white hover:bg-[#e86a50] active:bg-[#b5533e] focus:ring-[#ffd4cb] disabled:bg-[#c1c1c1] disabled:border disabled:border-[#c1c1c1] disabled:text-[#7a7a7a] disabled:cursor-not-allowed",
    Secondary:
      "bg-[#fff1ee] border border-[#ff7558] text-[#ff7558] hover:bg-[#ffd4cb] active:bg-[#ffc0b2] focus:ring-[#ffd4cb] disabled:opacity-50 disabled:cursor-not-allowed",
  },
};

export function Button({ variant = "Primary", className, children, ...props }: ButtonProps) {
  // Figma spec: Height 48px, Padding 28px horizontal, 16px vertical, Radius 50px
  const variantFontWeight = variant === "Primary" ? "font-bold" : "font-semibold";
  
  return (
    <BaseButton
      theme={customButtonTheme}
      color={variant}
      className={`h-12 px-7 rounded-[50px] text-[16px] leading-6 border-none ${variantFontWeight} ${className || ""}`}
      {...props}
    >
      {children}
    </BaseButton>
  );
}

// ==========================================
// 2. TEXT INPUT COMPONENT
// ==========================================
export interface TextInputProps extends Omit<BaseTextInputProps, "color"> {
  label?: string;
  hint?: string;
  isInvalid?: boolean;
}

const customTextInputTheme: CustomFlowbiteTheme["textInput"] = {
  field: {
    input: {
      base: "block w-full border font-['Poppins',sans-serif] rounded-[8px] text-[16px] outline-none transition-colors px-[16px] py-[13px] box-border",
      colors: {
        default:
          "bg-white border-[#ececf0] text-[#383838] focus:border-[#91cefc] focus:ring-1 focus:ring-[#91cefc] placeholder-[#c1c1c1]",
        error:
          "bg-white border-[#e52f2f] text-[#383838] focus:border-[#e52f2f] focus:ring-1 focus:ring-[#e52f2f] placeholder-[#c1c1c1]",
      },
    },
  },
};

export function TextInput({
  label,
  hint,
  isInvalid,
  disabled,
  className,
  ...props
}: TextInputProps) {
  return (
    <div className={`flex flex-col flex-start gap-2 w-full max-w-82 ${disabled ? "opacity-50" : ""} ${className || ""}`}>
      {label && (
        <label className="text-[16px] font-medium font-['Poppins',sans-serif] text-neutral-500 leading-6">
          {label}
        </label>
      )}
      <BaseTextInput
        theme={customTextInputTheme}
        color={isInvalid ? "error" : "default"}
        disabled={disabled}
        aria-invalid={isInvalid}
        sizing="md"
        {...props}
      />
      {hint && (
        <span
          className={`text-[12px] font-['Poppins',sans-serif] leading-4 ${
            isInvalid ? "text-[#e52f2f]" : "text-neutral-300"
          }`}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

// ==========================================
// 3. STATUS LABEL COMPONENT
// ==========================================
export interface StatusLabelProps extends Omit<BaseBadgeProps, "color"> {
  status?:
    | "approved"
    | "pending"
    | "rejected"
    | "pengurangan"
    | "belum_lunas"
    | "info";
  children?: React.ReactNode;
}

const customBadgeTheme: CustomFlowbiteTheme["badge"] = {
  root: {
    base: "flex h-fit items-center justify-center border border-solid font-['Poppins',sans-serif] text-[12px] leading-[18px]",
    color: {
      approved: "bg-[#e9f9ef] border-[#22c55e] text-[#22c55e]",
      pending: "bg-[#fdf7e6] border-[#eab308] text-[#eab308]",
      rejected: "bg-[#fdecec] border-[#ef4444] text-[#ef4444]",
      pengurangan: "bg-[#f9fafb] border-[#c1c1c1] text-[#c1c1c1]",
      belum_lunas: "bg-[#fff1ee] border-[#ff7558] text-[#ff7558]",
      info: "bg-[#ebf2fe] border-[#3b81f4] text-[#3b81f4]",
    },
  },
};

export function StatusLabel({
  status = "approved",
  className,
  children,
  ...props
}: StatusLabelProps) {
  const defaultLabels = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Menunggu",
    pengurangan: "Pengurangan",
    belum_lunas: "Belum Lunas/DP",
    info: "Info",
  };

  return (
    <BaseBadge
      theme={customBadgeTheme}
      color={status}
      className={`px-2 py-1 rounded-xl whitespace-nowrap w-max ${className || ""}`}
      {...props}
    >
      {children || defaultLabels[status]}
    </BaseBadge>
  );
}

// ==========================================
// 4. CHECKBOX COMPONENT
// ==========================================
export interface CheckboxProps extends BaseCheckboxProps {}

const customCheckboxTheme: CustomFlowbiteTheme["checkbox"] = {
  base: "flex size-[24px] items-center justify-center rounded-[4px] border border-solid border-[#929292] bg-white text-[#046bff] outline-none transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-[#84bbe5] focus:ring-offset-2 focus-visible:ring-2",
};

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox
      theme={customCheckboxTheme}
      className={`${className || ""}`}
      {...props}
    />
  );
}
