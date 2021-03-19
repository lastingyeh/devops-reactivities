import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { useStore } from '../../app/stores/store';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

function ProfilePage() {
	const { username } = useParams<{ username: string }>();
	const {
		profileStore: { loadProfile, loadingProfile, profile },
	} = useStore();

	useEffect(() => {
		loadProfile(username);
	}, [loadProfile, username]);

	if (loadingProfile) return <LoadingComponent content='Loading profile...' />;

	return (
		<Grid>
			<Grid.Column width={16}>
				{profile && (
					<>
						<ProfileHeader profile={profile} />
						<ProfileContent profile={profile} />
					</>
				)}
			</Grid.Column>
		</Grid>
	);
}

export default observer(ProfilePage);
