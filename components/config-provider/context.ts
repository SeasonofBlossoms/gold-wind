import * as React from 'react';
import type { ButtonProps } from '../button';
export const defaultIconPrefixCls = 'anticon';
export const defaultPrefixCls = 'ant';
export interface ComponentStyleConfig {
    className?: string;
    style?: React.CSSProperties;
}
export type ButtonConfig = ComponentStyleConfig &
    Pick<ButtonProps, 'classNames' | 'styles' | 'autoInsertSpace' | 'variant' | 'color'>;
export interface ConfigComponentProps {
    button?: ButtonConfig;
}
type GetClassNamesOrEmptyObject<Config extends { classNames?: any }> = Config extends {
    classNames?: infer ClassNames;
}
    ? ClassNames
    : object;

type GetStylesOrEmptyObject<Config extends { styles?: any }> = Config extends {
    styles?: infer Styles;
}
    ? Styles
    : object;
type ComponentReturnType<T extends keyof ConfigComponentProps> = Omit<
    NonNullable<ConfigComponentProps[T]>,
    'classNames' | 'styles'
> & {
    classNames: GetClassNamesOrEmptyObject<NonNullable<ConfigComponentProps[T]>>;
    styles: GetStylesOrEmptyObject<NonNullable<ConfigComponentProps[T]>>;
    getPrefixCls: ConfigConsumerProps['getPrefixCls'];
    direction: ConfigConsumerProps['direction'];
    getPopupContainer: ConfigConsumerProps['getPopupContainer'];
};
const EMPTY_OBJECT = {};
export type DirectionType = 'ltr' | 'rtl' | undefined;
export interface ConfigConsumerProps extends ConfigComponentProps {
    getTargetContainer?: () => HTMLElement;
    getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;
    rootPrefixCls?: string;
    iconPrefixCls: string;
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
    //  renderEmpty?: RenderEmptyHandler;

    //  csp?: CSPConfig; 
    //  autoInsertSpaceInButton?: boolean;
    //  variant?: Variant;
    //  virtual?: boolean;
    //  locale?: Locale;
    direction?: DirectionType;
    //  popupMatchSelectWidth?: boolean;
    //  popupOverflow?: PopupOverflow;
    //  theme?: ThemeConfig;
    //  warning?: WarningContextProps;
}
// zombieJ: 🚨 Do not pass `defaultRenderEmpty` here since it will cause circular dependency.
const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) {
        return customizePrefixCls;
    }
    return suffixCls ? `${defaultPrefixCls}-${suffixCls}` : defaultPrefixCls;
};
export const ConfigContext = React.createContext<ConfigConsumerProps>({
    // We provide a default function for Context without provider
    getPrefixCls: defaultGetPrefixCls,
    iconPrefixCls: defaultIconPrefixCls,
});

export function useComponentConfig<T extends keyof ConfigComponentProps> (propName: T) {
    const context = React.useContext(ConfigContext);
    const { getPrefixCls, direction, getPopupContainer } = context;

    const propValue = context[propName];
    return {
        classNames: EMPTY_OBJECT,
        styles: EMPTY_OBJECT,
        ...propValue,
        getPrefixCls,
        direction,
        getPopupContainer,
    } as ComponentReturnType<T>;
}
