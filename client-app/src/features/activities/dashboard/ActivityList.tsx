import React from 'react';
import { observer } from 'mobx-react-lite';
import { Fragment } from 'react';
import { Item, Segment, Header } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityListItem from './ActivityListItem';

function ActivityList() {
	const {
		activityStore: { groupedActivities },
	} = useStore();

	return (
		<>
			{groupedActivities.map(([group, activities]) => (
				<Fragment key={group}>
					<Header sub color='teal'>
						{group}
					</Header>
					{activities.map(activity => (
						<ActivityListItem key={activity.id} activity={activity} />
					))}
				</Fragment>
			))}
		</>
	);
}

export default observer(ActivityList);
