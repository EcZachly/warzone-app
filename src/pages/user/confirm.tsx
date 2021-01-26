import React from 'react';
import {useRouter} from 'next/router';

import {
    Container,
    Header,
    Card,
    CardHeader,
    Alert,
    CardBody,
    CardFooter,
    Paragraph
} from './../../components/SimpleComponents';
import {Navbar, Page} from '../../components/AppComponents';

import {BASE_TITLE} from '../../../lib/constants';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


export default function confirmUserAccount() {
    const router = useRouter();
    const {status} = router.query;

    const isSuccessful = (status === 'success');

    let message = 'An unknown error occurred while trying to confirm your account. Please try the link again.';

    if (isSuccessful) {
        message = 'Thank you for confirming your account!';
    }

    return (
        <Page title={BASE_TITLE + 'Account Confirmation'}>
            <Navbar/>

            <Container size={'sm'} style={{paddingTop: '25px'}}>
                <Card>
                    <CardHeader>
                        <Header>
                            Email Confirmation
                        </Header>
                    </CardHeader>

                    <CardBody>
                        <Alert type={isSuccessful ? 'success' : 'error'}>
                            {message}
                        </Alert>
                    </CardBody>

                    <CardFooter>
                        <a href={'/login'}>
                            Go to Login
                        </a>
                    </CardFooter>
                </Card>
            </Container>
        </Page>
    );
}
