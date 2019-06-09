import React from "react";

import { LoginForm } from "../common/forms/login";
import { SwitchnPortalPage } from "./base";

class SwitchnPortalLogin extends React.Component {
    render() {
        return (
            <SwitchnPortalPage>
                <LoginForm />
            </SwitchnPortalPage>
        )
    }
}

export { SwitchnPortalLogin }