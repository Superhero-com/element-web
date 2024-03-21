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
    address: string;
}

export default class SuperheroRegister extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        this.state = {
            username: "",
            address: "",
        };
    }

    private onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            username: e.target.value,
        });
    };

    private onAddressChanged = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            address: e.target.value,
        });
    };

    private onContinueWithSuperhero = async (): Promise<void> => {
        // does not feel very safe
        // TODO find a way to fetch the server name
        const config = SdkConfig.get();
        const serverName = config.default_server_config?.["m.homeserver"]?.server_name;
        // redirect to wallet
        const { signTransactionUrl } = await fetch(
            `http://localhost:3000/ui/get-registration-tx/@${this.state.username}:${serverName}/${this.state.address}`,
        ).then((res) => res.json());

        window.open(signTransactionUrl, "_blank");
        window.location.href = "/#/login";
    };

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Field type="text" label="Username" value={this.state.username} onChange={this.onUsernameChanged} />
                <Field type="text" label="AE Address" value={this.state.address} onChange={this.onAddressChanged} />
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
