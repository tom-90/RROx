import { Registration } from ".";
import { MenuItemProps } from "antd";

export type MenuButtonProps = {
    /**
     * Page to open when clicking the link.
     * If the link starts with a slash, it should include the full path, including the plugin name.
     * If the link does not start with a slash, the plugin name of the plugin that registered will automatically be prepended.
     * 
     * `/@rrox/plugin/abc/test-page` and `abc/test-page` will both link to the same page.
     */
    linkTo?: string,
} & Exclude<MenuItemProps, 'key'>;

/**
 * Registration that can be used to register a button to show in the sidebar menu.
 * This is based on the `Menu.Item` component from Ant Design: {@link https://ant.design/components/menu/#Menu.Item}
 * 
 * @param content Child component of the `Menu.Item`
 * @param props Properties to give to the `Menu.Item`, in addition to a `linkTo` property to automatically link to a page.
 */
export const MenuButtonRegistration = Registration<(
    content: React.ReactNode,
    props ?: MenuButtonProps
) => void>( '@rrox/api', 'menuButton' );