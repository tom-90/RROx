// Forge Configuration
const path = require( 'path' );
const rootDir = process.cwd();

module.exports = {
    // Packager Config
    packagerConfig: {
        // Set executable name
        executableName: 'RailroadsOnline Extended',
        icon: path.resolve( __dirname, '../../src/shared/appIcon.ico' ),
        protocols: [
            {
                name: 'RailroadsOnline Extended',
                schemes: [ 'rrox' ]
            }
        ]
    },
    // Forge Makers
    makers: [
        {
            name: '@electron-forge/maker-zip'
        },
        {
            // Squirrel.Windows is a no-prompt, no-hassle, no-admin method of installing
            // Windows applications and is therefore the most user friendly you can get.
            name: '@electron-forge/maker-squirrel',
            config: {
                name: 'RailroadsOnlineExtended',
                setupIcon: path.resolve( __dirname, '../../src/shared/appIcon.ico' ),
                iconUrl: 'https://github.com/tom-90/RROx/blob/master/packages/electron/src/shared/appIcon.ico?raw=true',
                setupExe: 'RailroadsOnline Extended Setup.exe',
            },
        },
        {
            name: '@electron-forge/maker-wix',
            config: {
                name: 'RailroadsOnline Extended',
                exe: 'RailroadsOnline Extended.exe',
                programFilesFolderName: 'RROx',
                shortName: 'RROx',
                shortcutFolderName: 'RROx',
                upgradeCode: 'f1fc49c8-0050-47e1-863b-c2c50a7a2b7e',
                appIconPath: path.resolve( __dirname, '../../src/shared/appIcon.ico' ),
                arch: 'x64',
                installLevel: 3, // Also default install auto update
                features: {
                    autoUpdate: true
                },
                ui: {
                    enabled: true,
                    chooseDirectory: true,
                    template: `<UI Id="UserInterface">
                    <Property Id="WixUI_Mode" Value="InstallDir" />
                  
                    <TextStyle Id="WixUI_Font_Normal" FaceName="Tahoma" Size="8" />
                    <TextStyle Id="WixUI_Font_Bigger" FaceName="Tahoma" Size="12" />
                    <TextStyle Id="WixUI_Font_Title" FaceName="Tahoma" Size="9" Bold="yes" />
                  
                    <Property Id="DefaultUIFont" Value="WixUI_Font_Normal" />
                  
                    <DialogRef Id="BrowseDlg" />
                    <DialogRef Id="DiskCostDlg" />
                    <DialogRef Id="ErrorDlg" />
                    <DialogRef Id="FatalError" />
                    <DialogRef Id="FilesInUse" />
                    <DialogRef Id="MsiRMFilesInUse" />
                    <DialogRef Id="PrepareDlg" />
                    <DialogRef Id="ProgressDlg" />
                    <DialogRef Id="ResumeDlg" />
                    <DialogRef Id="UserExit" />
                  
                    <Publish Dialog="BrowseDlg" Control="OK" Event="DoAction" Value="WixUIValidatePath" Order="3">1</Publish>
                    <Publish Dialog="BrowseDlg" Control="OK" Event="SpawnDialog" Value="InvalidDirDlg" Order="4"><![CDATA[NOT WIXUI_DONTVALIDATEPATH AND WIXUI_INSTALLDIR_VALID<>"1"]]></Publish>
                  
                    <Publish Dialog="ExitDialog" Control="Finish" Event="EndDialog" Value="Return" Order="999">1</Publish>
                  
                    <Publish Dialog="WelcomeDlg" Control="Next" Event="NewDialog" Value="InstallDirDlg">NOT Installed</Publish>
                    <Publish Dialog="WelcomeDlg" Control="Next" Event="NewDialog" Value="VerifyReadyDlg">Installed AND PATCH</Publish>
                  
                    <Publish Dialog="InstallDirDlg" Control="Back" Event="NewDialog" Value="WelcomeDlg">1</Publish>
                    <Publish Dialog="InstallDirDlg" Control="Next" Event="SetTargetPath" Value="[WIXUI_INSTALLDIR]" Order="1">1</Publish>
                    <Publish Dialog="InstallDirDlg" Control="Next" Event="DoAction" Value="WixUIValidatePath" Order="2">NOT WIXUI_DONTVALIDATEPATH</Publish>
                    <Publish Dialog="InstallDirDlg" Control="Next" Event="SpawnDialog" Value="InvalidDirDlg" Order="3"><![CDATA[NOT WIXUI_DONTVALIDATEPATH AND WIXUI_INSTALLDIR_VALID<>"1"]]></Publish>
                    <Publish Dialog="InstallDirDlg" Control="Next" Event="NewDialog" Value="VerifyReadyDlg" Order="4">WIXUI_DONTVALIDATEPATH OR WIXUI_INSTALLDIR_VALID="1"</Publish>
                    <Publish Dialog="InstallDirDlg" Control="ChangeFolder" Property="_BrowseProperty" Value="[WIXUI_INSTALLDIR]" Order="1">1</Publish>
                    <Publish Dialog="InstallDirDlg" Control="ChangeFolder" Event="SpawnDialog" Value="BrowseDlg" Order="2">1</Publish>
                  
                    <Publish Dialog="VerifyReadyDlg" Control="Back" Event="NewDialog" Value="InstallDirDlg" Order="1">NOT Installed</Publish>
                    <Publish Dialog="VerifyReadyDlg" Control="Back" Event="NewDialog" Value="MaintenanceTypeDlg" Order="2">Installed AND NOT PATCH</Publish>
                    <Publish Dialog="VerifyReadyDlg" Control="Back" Event="NewDialog" Value="WelcomeDlg" Order="2">Installed AND PATCH</Publish>
                  
                    <Publish Dialog="MaintenanceWelcomeDlg" Control="Next" Event="NewDialog" Value="MaintenanceTypeDlg">1</Publish>
                  
                    <Publish Dialog="MaintenanceTypeDlg" Control="RepairButton" Event="NewDialog" Value="VerifyReadyDlg">1</Publish>
                    <Publish Dialog="MaintenanceTypeDlg" Control="RemoveButton" Event="NewDialog" Value="VerifyReadyDlg">1</Publish>
                    <Publish Dialog="MaintenanceTypeDlg" Control="Back" Event="NewDialog" Value="MaintenanceWelcomeDlg">1</Publish>
                  
                    <Property Id="ARPNOMODIFY" Value="1" />
                  </UI>
                  <Property Id="WIXUI_INSTALLDIR" Value="APPLICATIONROOTDIRECTORY" />
                  <UIRef Id="WixUI_Common" />`
                },
                beforeCreate: (msiCreator) => {
                    msiCreator.wixTemplate = msiCreator.wixTemplate.replace(
                        'Name = "{{ApplicationName}} (Machine - MSI)"',
                        'Name = "{{ApplicationName}}"'
                    );
                    msiCreator.wixTemplate = msiCreator.wixTemplate.replace(
                        'Value="{{ApplicationName}} (Machine)"',
                        'Value="{{ApplicationName}}"'
                    );
                }
            }
        }
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'tom-90',
                    name: 'RROx'
                },
                prerelease: true
            }
        }
    ],
    // Forge Plugins
    plugins: [
        [
            // The Webpack plugin allows you to use standard Webpack tooling to compile both your main process code
            // and your renderer process code, with built in support for Hot Module Reloading in the renderer
            // process and support for multiple renderers.
            '@electron-forge/plugin-webpack',
            {
                // fix content-security-policy error when image or video src isn't same origin
                devContentSecurityPolicy: '',
                // Ports
                port: 3000, // Webpack Dev Server port
                loggerPort: 9000, // Logger port
                // Main process webpack configuration
                mainConfig: path.join( rootDir, 'tools/webpack/webpack.main.js' ),
                // Renderer process webpack configuration
                renderer: {
                    // Configuration file path
                    config: path.join( rootDir, 'tools/webpack/webpack.renderer.js' ),
                    // Entrypoints of the application
                    entryPoints: [
                        {
                            // Window process name
                            name: 'app_window_bootstrap',
                            // React Hot Module Replacement (HMR)
                            rhmr: 'react-hot-loader/patch',
                            // HTML index file template
                            html: path.join( rootDir, 'src/renderer/app.html' ),
                            // Renderer
                            js: path.join( rootDir, 'src/renderer/bootstrap/index.ts' ),
                            // Main Window
                            // Preload
                            preload: {
                                name: 'app_window_bootstrap_preload',
                                js  : path.join( rootDir, 'src/renderer/bootstrap/preload.ts' ),
                            },
                        }
                    ],
                },
                devServer: {
                    liveReload: false,
                },
            },
        ]
    ],
};
