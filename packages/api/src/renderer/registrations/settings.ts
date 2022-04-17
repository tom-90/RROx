import { Registration } from ".";

export type SettingsProps = {
    /**
     * Category under which to show the settings page in the navigation tree.
     * Provide a string array to create nested items in te tree
     */
    category: string | string[];

    /**
     * Element containing the settings page
     */
    element: React.ReactElement;
};

/**
 * Registration that can be used to register an item in the settings navigation tree.
 * 
 * @param props Configuration for the navigation tree item.
 */
export const SettingsRegistration = Registration<(
    props: SettingsProps
) => void>( '@rrox/api', 'settings' );