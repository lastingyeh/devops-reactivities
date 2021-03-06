import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Segment, Header, Image, Button, Divider } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

function HomePage() {
	const {
		userStore: { isLoggedIn, facebookLogin, fbLoading },
		modalStore: { openModal },
	} = useStore();
	return (
		<Segment inverted textAlign='center' vertical className='masthead'>
			<Container text>
				<Header as='h1' inverted>
					<Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
					Reactivities
				</Header>
				{isLoggedIn ? (
					<>
						<Header as='h2' inverted content='Welcome to Reactivities' />
						<Button as={Link} to='/activities' size='huge' inverted>
							Go to Activities
						</Button>
					</>
				) : (
					<>
						<Button onClick={() => openModal(<LoginForm />)} size='huge' inverted>
							Login
						</Button>
						<Button onClick={() => openModal(<RegisterForm />)} size='huge' inverted>
							Register
						</Button>
						<Divider horizontal inverted>
							Or
						</Divider>
						<Button loading={fbLoading} onClick={facebookLogin} size='huge' inverted color='facebook'>
							Login with Facebook
						</Button>
					</>
				)}
			</Container>
		</Segment>
	);
}

export default observer(HomePage);
