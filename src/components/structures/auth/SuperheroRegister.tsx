import Field from "matrix-react-sdk/src/components/views/elements/Field";
import AccessibleButton from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import { _t } from "matrix-react-sdk/src/languageHandler";
import React from "react";
import { MatrixClient } from "matrix-js-sdk/src/matrix";
import SdkConfig from "matrix-react-sdk/src/SdkConfig";

interface IProps {
    matrixClient: MatrixClient;
}

interface IState {
    username: string;
}

export default class Registration extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        this.state = {
            username: "",
        };
    }

    private onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            username: e.target.value,
        });
    };

    private onContinueWithSuperhero = async (): Promise<void> => {
        // does not feel very safe
        // TODO find a way to fetch the server name
        const config = SdkConfig.get();
        const serverName = config.default_server_config?.["m.homeserver"]?.server_name;

        // redirect to wallet
        // fetch tx from this
        // TODO REMOVE AE ADDRESS
        const { signTransactionUrl } = await fetch(
            `http://localhost:3000/ui/get-registration-tx/@${this.state.username}:${serverName}/ak_3CoDS4wS7N1bXZJWUgmRXNez45AbMVFG5gsVpHx9kRsWcrhp9`,
        ).then((res) => res.json());

        window.open(signTransactionUrl, "_blank");
        window.location.href = "/#/login";
    };

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Field type="text" label="Username" value={this.state.username} onChange={this.onUsernameChanged} />
                <AccessibleButton kind="primary" onClick={this.onContinueWithSuperhero}>
                    Continue with Superhero
                </AccessibleButton>
                <h2 className="mx_AuthBody_centered">
                    {_t("auth|sso_or_username_password", {
                        ssoButtons: "",
                        usernamePassword: "",
                    }).trim()}
                </h2>
            </React.Fragment>
        );
    }
}
