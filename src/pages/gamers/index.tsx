import {GetServerSideProps} from 'next'
import {useState} from "react";

import GamerCard from '../../components/gamer/GamerCard';
import {Container, Header, LineBreak, Button, Box, Main} from './../../components/SimpleComponents';
import {Page, Navbar} from './../../components/AppComponents';
import {SidebarCompanion, Input, Sidebar} from '../../components/SmartComponents';

const CONFIG = {
    PLATFORM_OPTIONS: [
        {text: 'test', value: 'wow'},
        {text: 'test 2', value: 'wow 2 '},
    ]
}

//===---==--=-=--==---===----===---==--=-=--==---===----//


export default function Gamers({gamers}) {
    const [newUserValue, setNewUserValue] = useState('');
    const [newUserPlatform, setNewUserPlatform] = useState(CONFIG.PLATFORM_OPTIONS);

    return (
        <Page title={'Gamers'}>
            <Navbar/>

            <Main>
                <Container mode={'sidebar'} size={'lg'}>
                    <Sidebar>
                        <Header>
                            All Gamers
                        </Header>

                        <LineBreak/>

                        <Box>
                            <Header size={'sm'}>Add Gamer</Header>
                            <Input label={'Username'}
                                   type={'text'}
                                   value={newUserValue}
                                   onChange={setNewUserValue}
                                   placeholder={'Username'}/>
                            <Input label={'Platform'}
                                   type={'select'}
                                   options={CONFIG.PLATFORM_OPTIONS}
                                   value={newUserPlatform}
                                   onChange={setNewUserPlatform}/>
                            <Button onClick={() => addGamer(newUserValue, newUserPlatform)}>Add Gamer</Button>
                        </Box>
                    </Sidebar>
                    <SidebarCompanion>
                        {generateGamerListContent(gamers)}
                    </SidebarCompanion>
                </Container>
            </Main>

        </Page>
    )
}


function addGamer(newUserValue, newUserPlatform) {
    console.log(newUserValue)
    console.log(newUserPlatform)
}


function generateGamerListContent(gamers) {
    return gamers.map((gamer) => <GamerCard key={gamer.username + '-' + gamer.platform} gamer={gamer}/>);
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    let rawGamerList = await fetch(process.env.HOSTNAME + '/api/gamers');
    let gamerJson = await rawGamerList.json();
    return {props: {gamers: gamerJson}}
}