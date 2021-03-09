import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';

function ActivityDashboard() {
	const {
		activityStore: { activitiesByDate, loadingInitial, loadActivities, activityRegistry },
	} = useStore();

	useEffect(() => {
		if (activityRegistry.size <= 1) loadActivities();
	}, [activityRegistry.size, loadActivities]);

	if (loadingInitial) return <LoadingComponent content='Loading app' />;

	return (
		<Grid>
			<Grid.Column width='10'>{activitiesByDate.length > 0 && <ActivityList />}</Grid.Column>
			<Grid.Column width='6'>
				<ActivityFilters />
			</Grid.Column>
		</Grid>
	);
}

export default observer(ActivityDashboard);
