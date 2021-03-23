import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Header, Tab, TabProps, Image } from 'semantic-ui-react';
import { UserActivity } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import { format } from 'date-fns';

const panes = [
	{ menuItem: 'Future Events', pane: { key: 'future' } },
	{ menuItem: 'Past Events', pane: { key: 'past' } },
	{ menuItem: 'Hosting', pane: { key: 'hosting' } },
];

function ProfileActivities() {
	const {
		profileStore: { loadUserActivities, profile, laodingActivities, userActivities },
	} = useStore();

	useEffect(() => {
		loadUserActivities(profile!.username);
	}, [loadUserActivities, profile]);

	const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
		loadUserActivities(profile!.username, panes[data.activeIndex as number].pane.key);
	};

	return (
		<Tab.Pane loading={laodingActivities}>
			<Grid>
				<Grid.Column width={16}>
					<Header floated='left' icon='calendar' content='Activities' />
				</Grid.Column>
				<Grid.Column width={16}>
					<Tab
						panes={panes}
						menu={{ secondary: true, pointing: true }}
						onTabChange={(e, data) => handleTabChange(e, data)}
					/>
					<br />
					<Card.Group itemsPerRow={4}>
						{userActivities.map((activity: UserActivity) => (
							<Card key={activity.id} as={Link} to={`/activities/${activity.id}`}>
								<Image
									src={`/assets/categoryImages/${activity.category}.jpg`}
									style={{ minHeight: 100, objectFit: 'cover' }}
								/>
								<Card.Content>
									<Card.Header textAlign='center'>{activity.title}</Card.Header>
									<Card.Meta textAlign='center'>
										<div>{format(new Date(activity.date), 'do LLL')}</div>
										<div>{format(new Date(activity.date), 'h:mm a')}</div>
									</Card.Meta>
								</Card.Content>
							</Card>
						))}
					</Card.Group>
				</Grid.Column>
			</Grid>
		</Tab.Pane>
	);
}

export default observer(ProfileActivities);
