import React from 'react';

import {Footer, Navbar, Page} from '../../../components/AppComponents';
import {
    Card,
    CardBody,
    CardHeader,
    Container,
    Main
} from '../../../components/SimpleComponents';
import {GetServerSideProps} from 'next';
import {getBaseUrlWithProtocol} from '../../../services/UtilityService';
import {BASE_TITLE} from '../../../../lib/constants';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//


const FieldUpgradesList = ({resources}) => {

    const resourceList = resources.map((resource)=>{
        return <Card>
            <CardHeader>
                <a href={'/help/field-upgrades/' + resource.resource_id}><h2>{resource.name}</h2></a>
            </CardHeader>
            <CardBody>
                <img style={{width: '50px', height: 'auto'}} src={resource.image_url}/>
            </CardBody>
        </Card>;
    });

    return (
        <Page title={`${BASE_TITLE}: Field Upgrades`} redirectIfLoggedIn={true}>
            <Navbar/>
            <Main>
                <Container>
                    {resourceList}
                </Container>
            </Main>
            <Footer/>
        </Page>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const baseUrl = getBaseUrlWithProtocol(context.req);
    const data = await fetch(baseUrl + '/api/resources?type=field_upgrade');
    const dataJson = await data.json();
    return {
        props: {
            resources: dataJson
        }
    };
};

export default FieldUpgradesList;