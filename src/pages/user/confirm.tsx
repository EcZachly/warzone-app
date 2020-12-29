import {GetServerSideProps} from "next";
import {getBaseUrlWithProtocol} from "../../services/UtilityService";
import {Navbar, Page} from "../../components/AppComponents";
import React from "react";
import {BASE_TITLE} from "../../../lib/constants";

export default function confirmUserAccount({user}) {
    return <Page title={`${BASE_TITLE}: Confirm User Account`}>
        <Navbar/>
        Thank you {user.first_name}, for confirming your account!

    </Page>
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {confirm_string} = context.query;
    const baseUrl = getBaseUrlWithProtocol(context.req);
    const userConfirmed = await fetch(`${baseUrl}/api/user?confirm_string=${confirm_string}`);
    const userJson = await userConfirmed.json();

    if (userJson) {
        return {
            props: {
                user: userJson
            }
        };
    }
};