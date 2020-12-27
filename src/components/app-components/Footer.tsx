import {withRouter} from 'next/router';

import React from 'react';

import {Box, Button, Container, Header, LineBreak, Paragraph, Small} from './../SimpleComponents';

//===----=---=-=--=--===--=-===----=---=-=--=--===--=-===----=---=-=--=--===--=-//

class Footer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    componentDidMount() {

    }


    render() {
        const props = this.props;

        return (
            <Box id={'footer'} className={'footer'} style={props['style']}>
                <Container id={'footer-container'}>
                    <Box id={'footer-branding'}>
                        <Header>
                            WARZONE

                            <LineBreak clear/>

                            <Small>
                                Stats Tracker
                            </Small>
                        </Header>
                    </Box>

                    <Box id={'footer-item-container'}>

                        <Box className={'footer-items'} id={'footer-left'}>
                            <Paragraph>
                                <a href={'/gamers'}>
                                    Gamers
                                </a>
                            </Paragraph>

                            <Paragraph>
                                <a href={'/squads'}>
                                    Squads
                                </a>
                            </Paragraph>

                            <Paragraph>
                                <a href={'/help'}>
                                    Resources
                                </a>
                            </Paragraph>
                        </Box>

                        <Box className={'footer-items'} id={'footer-right'}>
                            <Paragraph>
                                <a>
                                    Login
                                </a>
                            </Paragraph>

                            <Paragraph>
                                <Button type={['dark']} style={{fontWeight: 500}}>
                                    Signup
                                </Button>
                            </Paragraph>
                        </Box>

                    </Box>
                </Container>

                <Container id={'footer-disclaimers'}>
                    <Paragraph type={'help'}>
                        Warzone is a registered trademark of Activision. Trademarks are the property of their respective owners. Game materials copyright Activision. Activision has not endorsed and is not responsible for this site or its content.
                    </Paragraph>

                </Container>
            </Box>
        );
    }
}

export default withRouter(Footer);