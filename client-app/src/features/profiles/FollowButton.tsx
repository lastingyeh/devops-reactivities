import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent } from 'react';
import { Reveal, Button } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
	profile: Profile;
}

function FollowButton({ profile }: Props) {
	const {
		profileStore: { updateFollowing, loading },
		userStore: { user },
	} = useStore();

	if (user?.username === profile.username) return null;

	const handleFollow = (e: SyntheticEvent, username: string) => {
		e.preventDefault();
		profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
	};

	return (
		<Reveal animated='move'>
			<Reveal.Content visible style={{ width: '100%' }}>
				<Button fluid color='teal' content={profile.following ? 'Following' : 'Not following'} />
			</Reveal.Content>
			<Reveal.Content hidden style={{ width: '100%' }}>
				<Button
					loading={loading}
					fluid
					basic
					color={profile.following ? 'red' : 'green'}
					content={profile.following ? 'Unfollow' : 'Follow'}
					onClick={e => handleFollow(e, profile.username)}
				/>
			</Reveal.Content>
		</Reveal>
	);
}

export default observer(FollowButton);
