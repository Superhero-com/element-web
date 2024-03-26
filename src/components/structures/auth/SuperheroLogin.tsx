import React from "react";
import { _t } from "matrix-react-sdk/src/languageHandler";
import AccessibleButton from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import { IMatrixClientCreds } from "matrix-react-sdk/src/MatrixClientPeg";
import Field from "matrix-react-sdk/src/components/views/elements/Field";
import SdkConfig from "matrix-react-sdk/src/SdkConfig";
import Login, { sendLoginRequest } from "matrix-react-sdk/src/Login";

interface IProps {
    // Called when the user has logged in. Params:
    // - The object returned by the login API
    // - The user's password, if applicable, (may be cached in memory for a
    //   short time so the user is not required to re-enter their password
    //   for operations like uploading cross-signing keys).
    onLoggedIn(data: IMatrixClientCreds, password: string): void;

    loginLogic: Login;
}

interface IState {
    username: string;
}

export default class SuperheroLogin extends React.Component<IProps, IState> {
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
        const config = SdkConfig.get();
        const serverName = config.default_server_config?.["m.homeserver"]?.server_name;
        const userId = `@${this.state.username}:${serverName}`;
        const callbackUrl = encodeURIComponent(
            window.location.origin + "?signature={signature}&user=" + userId + window.location.hash,
        );
        const walletUrl = `https://wallet.superhero.com/sign-message?message={"user_id":"${userId}"}&jwt=true&x-success=${callbackUrl}`;
        console.log(walletUrl);
        window.location.href = walletUrl;
    };

    public async componentDidMount(): Promise<void> {
        // if url contains signature do login
        const url = new URL(window.location.href);
        const signature = url.searchParams.get("signature");
        if (signature) {
            const userId = url.searchParams.get("user");
            window.history.replaceState({}, document.title, "/#/login");
            const hsUrl = this.props.loginLogic.getHomeserverUrl();
            const isUrl = this.props.loginLogic.getIdentityServerUrl();
            const response = await sendLoginRequest(hsUrl, isUrl, "m.login.jwt", {
                identifier: {
                    type: "m.id.user",
                    user: userId,
                },
                token: signature,
            });
            this.props.onLoggedIn(response, "");
        }
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <Field type="text" label="Username" value={this.state.username} onChange={this.onUsernameChanged} />
                <AccessibleButton kind="primary" className="mx_Login_submit" onClick={this.onContinueWithSuperhero}>
                    Sign in with Superhero Wallet
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
