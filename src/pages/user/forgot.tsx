import {GetServerSideProps} from "next";
import {getBaseUrlWithProtocol} from "../../services/UtilityService";
import {Navbar, Page} from "../../components/AppComponents";
import React, {useState} from "react";
import {Input} from "../../components/SmartComponents";
import {Container} from "../../components/SimpleComponents";

export default function confirmUserAccount({user, error}) {
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");
    //TODO ADD FORGOT PASSWORD update push
    let content = (
        <div>

            <Input type={'text'}
                   subtype={'password'}
                   value={password}
                   onChange={(value) => setPassword(value)}
                   label={'New password'}
                   required={true}
                   disabled={!user}
                   placeholder={'domino@warcom.wz'}/>


            <Input type={'text'}
                   subtype={'password'}
                   value={confirmPassword}
                   onChange={(value) =>setConfirmPassword(value)}
                   label={'Confirm new password'}
                   required={true}
                   disabled={!user}
                   placeholder={'domino@warcom.wz'}/>

        </div>
    )

    if(error){
        content = <h1>Invalid page!</h1>
    }


    return <Page title={'Warzone'} redirectIfLoggedIn={true}>
        <Navbar/>


        <Container size={'sm'} style={{maxWidth: '600px', paddingBottom: '100px'}}>

            {content}


        </Container>

    </Page>
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const {forgot_string} = context.query;
    const baseUrl = getBaseUrlWithProtocol(context.req);
    const userConfirmed = await fetch(`${baseUrl}/api/users?forgot_string=${forgot_string}`);
    let allData = (await userConfirmed.json()) as Array<object>;
    if (allData.length) {
        return {
            props: {
                user: allData,
                error: null
            }
        };
    }
    else{
        return {
            props: {
                user: {},
                error: {message: 'invalid page'}
            }
        }
    }
};
