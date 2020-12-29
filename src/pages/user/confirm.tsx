import {Navbar, Page} from "../../components/AppComponents";
import React from "react";
import {BASE_TITLE} from "../../../lib/constants";
import {useRouter} from "next/router";

export default function confirmUserAccount() {
    const router = useRouter();
    let {status} = router.query;
    let message = "Thank you for confirming your account!";
    if(status === "failure"){
        message = "there was an error confirming your account!"
    }
    return <Page title={`${BASE_TITLE}: Confirm User Account`}>
        <Navbar/>
        {message}
        <a href={"/login"}>click here to login</a>
    </Page>
}
