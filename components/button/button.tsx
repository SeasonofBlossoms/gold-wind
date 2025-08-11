import React, { useMemo } from "react";
import classNames from "classnames";
import type {
  ButtonColorType,
  ButtonVariantType,
  ButtonType,
} from "./buttonHelpers";
import {
  ConfigContext,
  useComponentConfig,
} from "../config-provider/context.ts";
export interface BaseButtonProps {
  type?: ButtonType;
  color?: ButtonColorType;
  variant?: ButtonVariantType;
  disabled?: boolean;
  loading?: boolean | { delay?: number; icon?: React.ReactNode };
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  children?: React.ReactNode;
  [key: `data-${string}`]: string;
  classNames?: { icon: string };
  styles?: { icon: React.CSSProperties };
}

type MergedHTMLAttributes = Omit<
  React.HTMLAttributes<HTMLElement> &
    React.ButtonHTMLAttributes<HTMLElement> &
    React.AnchorHTMLAttributes<HTMLElement>,
  "type" | "color"
>;

export interface ButtonProps extends BaseButtonProps, MergedHTMLAttributes {
  href?: string;
  autoInsertSpace?: boolean;
}
const InternalCompoundedButton = React.forwardRef<
  HTMLButtonElement | HTMLLinkElement,
  ButtonProps
>((props, ref) => {
  const {
    color,
    className,
    variant,
    danger = false,
    type,
    prefixCls: customizePrefixCls,
  } = props;
  type ColorVariantPairType = [
    color?: ButtonColorType,
    variant?: ButtonVariantType
  ];
  const mergedType = type || "default";
  const { button } = React.useContext(ConfigContext);
  const ButtonTypeMap: Partial<Record<ButtonType, ColorVariantPairType>> = {
    default: ["default", "outlined"],
    primary: ["primary", "solid"],
    dashed: ["default", "dashed"],
    // `link` is not a real color but we should compatible with it
    link: ["link" as any, "link"],
    text: ["default", "text"],
  };
  const [mergedColor, mergedVariant] = useMemo<ColorVariantPairType>(() => {
    // >>>>> Local
    // Color & Variant
    if (color && variant) {
      return [color, variant];
    }

    // Sugar syntax
    if (type || danger) {
      const colorVariantPair = ButtonTypeMap[mergedType] || [];
      if (danger) {
        return ["danger", colorVariantPair[1]];
      }
      return colorVariantPair;
    }

    // >>> Context fallback
    if (button?.color && button?.variant) {
      return [button.color, button.variant];
    }

    return ["default", "outlined"];
  }, [type, color, variant, danger, button?.variant, button?.color]);
  const { getPrefixCls } = useComponentConfig("button");
  const isDanger = mergedColor === "danger";
  const mergedColorText = isDanger ? "dangerous" : mergedColor;
  const prefixCls = getPrefixCls("btn", customizePrefixCls);
  const classes = classNames(
    {
      [`${prefixCls}-color-${mergedColorText}`]: mergedColorText,
    },
    className
  );

  let buttonNode = <button className={classes}>This is my-button</button>;
  return buttonNode;
});
type CompoundedComponent = typeof InternalCompoundedButton;

const Button = InternalCompoundedButton as CompoundedComponent;
export default Button;
