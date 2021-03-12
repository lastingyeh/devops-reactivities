import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Segment, Header, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

function HomePage() {
	const {
		userStore: { isLoggedIn, logout, login },
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
					<Button as={Link} to='/login' size='huge' inverted>
						Login!
					</Button>
				)}
			</Container>
		</Segment>
	);
}

export default observer(HomePage);
