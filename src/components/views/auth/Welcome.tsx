/*
Copyright 2019 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";
import classNames from "classnames";
import SdkConfig from "matrix-react-sdk/src/SdkConfig";
import AuthPage from "matrix-react-sdk/src/components/views/auth/AuthPage";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { UIFeature } from "matrix-react-sdk/src/settings/UIFeature";
import LanguageSelector from "matrix-react-sdk/src/components/views/auth/LanguageSelector";
import EmbeddedPage from "matrix-react-sdk/src/components/structures/EmbeddedPage";
import { MATRIX_LOGO_HTML } from "matrix-react-sdk/src/components/structures/static-page-vars";

interface IProps {
    //
}

export default class Welcome extends React.PureComponent<IProps> {
    public render(): React.ReactNode {
        const pagesConfig = SdkConfig.getObject("embedded_pages");
        let pageUrl: string | undefined;
        if (pagesConfig) {
            pageUrl = pagesConfig.get("welcome_url");
        }

        const replaceMap: Record<string, string> = {
            "$riot:ssoUrl": "#/start_sso",
            "$riot:casUrl": "#/start_cas",
            "$matrixLogo": MATRIX_LOGO_HTML,
            "[matrix]": MATRIX_LOGO_HTML,
        };

        if (!pageUrl) {
            // Fall back to default and replace $logoUrl in welcome.html
            const brandingConfig = SdkConfig.getObject("branding");
            const logoUrl = brandingConfig?.get("auth_header_logo_url") ?? "themes/element/img/logos/element-logo.svg";
            replaceMap["$logoUrl"] = logoUrl;
            pageUrl = "welcome.html";
        }

        // return (
        //     <EmbeddedPage url={pageUrl} replaceMap={replaceMap} />
        // )
        return (
            <AuthPage>
                <div
                    className={classNames("mx_Welcome", {
                        mx_WelcomePage_registrationDisabled: !SettingsStore.getValue(UIFeature.Registration),
                    })}
                >
                    <EmbeddedPage className="mx_WelcomePage" url={pageUrl} replaceMap={replaceMap} />
                    <LanguageSelector />
                </div>
            </AuthPage>
        );
    }
}
